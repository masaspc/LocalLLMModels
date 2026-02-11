export type Category =
  | "general"
  | "coding"
  | "math"
  | "reasoning"
  | "multilingual"
  | "rag"
  | "agent"
  | "creative";

export type HardwareCategory =
  | "nvidia_consumer"
  | "nvidia_pro"
  | "amd"
  | "apple_silicon"
  | "dedicated_ai"
  | "multi_gpu";

export type JapaneseSupport = "excellent" | "good" | "fair" | "poor";

export type Architecture = "dense" | "moe";

export type QuantLevel = "fp16" | "q8" | "q4" | "q3";

export interface VramRequirements {
  fp16: number;
  q8: number;
  q4: number;
  q3?: number;
}

export interface ContextVram {
  q4: number;
  q8: number;
  fp16: number;
}

export interface Benchmarks {
  mmluPro?: number;
  humanEval?: number;
  mathScore?: number;
  aime?: number;
  liveCodeBench?: number;
  arenaHard?: number;
}

export interface Ratings {
  overall: number;
  coding: number;
  reasoning: number;
  creative: number;
  multilingual: number;
}

export interface QuickStart {
  ollama?: string;
  llamaCpp?: string;
  vllm?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  family: string;
  developer: string;
  parameterCount: number;
  activeParameters?: number;
  architecture: Architecture;
  contextLength: number;
  license: string;
  commercialUse: boolean;
  releaseDate: string;
  categories: Category[];
  japaneseSupport: JapaneseSupport;
  vramRequirements: VramRequirements;
  recommendedVram: {
    context8k: ContextVram;
    context32k: ContextVram;
  };
  benchmarks: Benchmarks;
  ratings: Ratings;
  quickStart: QuickStart;
  description: string;
  notes: string;
}

export interface Hardware {
  id: string;
  name: string;
  category: HardwareCategory;
  vram: number;
  memoryBandwidth: number;
  memoryType: string;
  tdp: number;
  priceRange: string;
  multiGpuSupport: boolean;
  unifiedMemory: boolean;
  description: string;
  notes: string;
}

export type MatchTier = "comfortable" | "possible" | "difficult";

export interface MatchResult {
  model: LLMModel;
  tier: MatchTier;
  quantLevel: QuantLevel;
  requiredVram: number;
  availableVram: number;
  maxContext: string;
  estimatedSpeed: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  general: "汎用チャット",
  coding: "コーディング",
  math: "数学",
  reasoning: "推論",
  multilingual: "多言語",
  rag: "RAG",
  agent: "エージェント",
  creative: "クリエイティブ",
};

export const HARDWARE_CATEGORY_LABELS: Record<HardwareCategory, string> = {
  nvidia_consumer: "NVIDIA コンシューマ",
  nvidia_pro: "NVIDIA プロ",
  amd: "AMD",
  apple_silicon: "Apple Silicon",
  dedicated_ai: "専用AI機",
  multi_gpu: "マルチGPU",
};

export const JP_SUPPORT_LABELS: Record<JapaneseSupport, string> = {
  excellent: "◎",
  good: "○",
  fair: "△",
  poor: "×",
};

export const QUANT_LABELS: Record<QuantLevel, string> = {
  fp16: "FP16",
  q8: "Q8",
  q4: "Q4_K_M",
  q3: "Q3_K_M",
};
