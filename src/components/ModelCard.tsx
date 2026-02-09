"use client";

import Link from "next/link";
import { MatchResult, CATEGORY_LABELS, JP_SUPPORT_LABELS, QUANT_LABELS } from "@/types";
import { formatParamCount, renderStars, formatVram } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Plus, ExternalLink } from "lucide-react";

const tierConfig = {
  comfortable: {
    label: "快適動作",
    emoji: "\u{1F7E2}",
    bg: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-800",
  },
  possible: {
    label: "動作可能",
    emoji: "\u{1F7E1}",
    bg: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
  },
  difficult: {
    label: "動作困難",
    emoji: "\u{1F534}",
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
  },
};

interface Props {
  result: MatchResult;
  onCompareAdd?: (modelId: string) => void;
  compareSelected?: boolean;
}

export default function ModelCard({ result, onCompareAdd, compareSelected }: Props) {
  const { model, tier, quantLevel, requiredVram, maxContext, estimatedSpeed } = result;
  const config = tierConfig[tier];

  return (
    <div className={cn("rounded-xl border-2 p-5 transition-all hover:shadow-md", config.bg)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">{config.emoji}</span>
            <h3 className="font-bold text-gray-900 text-base">{model.name}</h3>
            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.badge)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {model.developer} / {model.family}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold text-amber-600">
            {renderStars(model.ratings.overall)}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            日本語 {JP_SUPPORT_LABELS[model.japaneseSupport]}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>
          <span className="text-gray-400">パラメータ:</span>{" "}
          {formatParamCount(model.parameterCount, model.activeParameters)}
        </span>
        <span>
          <span className="text-gray-400">量子化:</span> {QUANT_LABELS[quantLevel]}
        </span>
        <span>
          <span className="text-gray-400">VRAM:</span> {formatVram(requiredVram)}
        </span>
        <span>
          <span className="text-gray-400">コンテキスト:</span> {maxContext}
        </span>
      </div>

      {/* Speed estimate */}
      <div className="mt-2 text-xs text-gray-500">
        推定速度: {estimatedSpeed}
      </div>

      {/* Category tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {model.categories.map((cat) => (
          <span
            key={cat}
            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
          >
            {CATEGORY_LABELS[cat]}
          </span>
        ))}
        {model.architecture === "moe" && (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            MoE
          </span>
        )}
        {model.commercialUse && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
            商用可
          </span>
        )}
      </div>

      {/* Ollama command */}
      {model.quickStart.ollama && (
        <div className="mt-3 bg-gray-900 text-green-400 rounded-lg px-3 py-2 text-xs font-mono overflow-x-auto">
          $ {model.quickStart.ollama}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/models/${model.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          詳細を見る <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        {onCompareAdd && (
          <button
            onClick={() => onCompareAdd(model.id)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              compareSelected
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            比較
          </button>
        )}
      </div>
    </div>
  );
}
