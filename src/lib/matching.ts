import { LLMModel, Hardware, MatchResult, MatchTier, QuantLevel } from "@/types";

const QUANT_LEVELS: QuantLevel[] = ["q4", "q8", "fp16"];

function getVramForQuant(model: LLMModel, quant: QuantLevel): number {
  return model.vramRequirements[quant] ?? Infinity;
}

function getRecommendedVram(model: LLMModel, quant: QuantLevel): number {
  const ctx = model.recommendedVram.context8k;
  return ctx[quant === "q3" ? "q4" : quant] ?? Infinity;
}

function getRecommendedVram32k(model: LLMModel, quant: QuantLevel): number {
  const ctx = model.recommendedVram.context32k;
  return ctx[quant === "q3" ? "q4" : quant] ?? Infinity;
}

function determineTier(requiredVram: number, availableVram: number): MatchTier {
  if (requiredVram <= availableVram * 0.85) return "comfortable";
  if (requiredVram <= availableVram) return "possible";
  return "difficult";
}

function estimateSpeed(hardware: Hardware, model: LLMModel, quant: QuantLevel): string {
  const modelVram = getVramForQuant(model, quant);
  if (modelVram > hardware.vram) return "CPUオフロード必要 (1-5 t/s)";

  const bw = hardware.memoryBandwidth;
  if (bw >= 1000) return "高速 (50-100+ t/s)";
  if (bw >= 500) return "快速 (30-60 t/s)";
  if (bw >= 250) return "標準 (15-35 t/s)";
  return "低速 (5-15 t/s)";
}

function getMaxContext(model: LLMModel, quant: QuantLevel, availableVram: number): string {
  const vram8k = getRecommendedVram(model, quant);
  const vram32k = getRecommendedVram32k(model, quant);

  if (vram32k <= availableVram * 0.85) return "32K+";
  if (vram32k <= availableVram) return "~32K";
  if (vram8k <= availableVram) return "~8K";
  return "制限あり";
}

export function matchModels(
  hardware: Hardware,
  models: LLMModel[],
  filters?: {
    categories?: string[];
    sizeRange?: string;
    commercialOnly?: boolean;
    japaneseOnly?: boolean;
    quantLevel?: QuantLevel;
    architecture?: string;
  }
): MatchResult[] {
  const results: MatchResult[] = [];

  for (const model of models) {
    // Apply filters
    if (filters?.categories?.length) {
      const hasMatch = filters.categories.some((c) =>
        model.categories.includes(c as never)
      );
      if (!hasMatch) continue;
    }

    if (filters?.sizeRange) {
      const p = model.parameterCount;
      switch (filters.sizeRange) {
        case "~3B": if (p > 3) continue; break;
        case "3~8B": if (p <= 3 || p > 8) continue; break;
        case "8~14B": if (p <= 8 || p > 14) continue; break;
        case "14~32B": if (p <= 14 || p > 32) continue; break;
        case "32~70B": if (p <= 32 || p > 70) continue; break;
        case "70B~": if (p <= 70) continue; break;
      }
    }

    if (filters?.commercialOnly && !model.commercialUse) continue;
    if (filters?.japaneseOnly && (model.japaneseSupport === "poor" || model.japaneseSupport === "fair")) continue;
    if (filters?.architecture && model.architecture !== filters.architecture) continue;

    // Find best quantization level that fits
    const quantLevels: QuantLevel[] = filters?.quantLevel
      ? [filters.quantLevel]
      : QUANT_LEVELS;

    let bestMatch: MatchResult | null = null;

    for (const quant of quantLevels) {
      const requiredVram = getRecommendedVram(model, quant);
      const tier = determineTier(requiredVram, hardware.vram);

      if (!bestMatch || tierPriority(tier) < tierPriority(bestMatch.tier)) {
        bestMatch = {
          model,
          tier,
          quantLevel: quant,
          requiredVram,
          availableVram: hardware.vram,
          maxContext: getMaxContext(model, quant, hardware.vram),
          estimatedSpeed: estimateSpeed(hardware, model, quant),
        };
      }
    }

    if (bestMatch) {
      results.push(bestMatch);
    }
  }

  // Sort: comfortable first, then by overall rating, then by parameter count
  return results.sort((a, b) => {
    const tierDiff = tierPriority(a.tier) - tierPriority(b.tier);
    if (tierDiff !== 0) return tierDiff;
    const ratingDiff = b.model.ratings.overall - a.model.ratings.overall;
    if (ratingDiff !== 0) return ratingDiff;
    return b.model.parameterCount - a.model.parameterCount;
  });
}

function tierPriority(tier: MatchTier): number {
  switch (tier) {
    case "comfortable": return 0;
    case "possible": return 1;
    case "difficult": return 2;
  }
}

export function getModelById(models: LLMModel[], id: string): LLMModel | undefined {
  return models.find((m) => m.id === id);
}

export function getHardwareById(hardware: Hardware[], id: string): Hardware | undefined {
  return hardware.find((h) => h.id === id);
}
