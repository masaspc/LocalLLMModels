"use client";

import { Category, CATEGORY_LABELS, QuantLevel, QUANT_LABELS } from "@/types";
import { cn } from "@/lib/utils";

const sizeRanges = ["~3B", "3~8B", "8~14B", "14~32B", "32~70B", "70B~"];

const categoryOptions: Category[] = [
  "general", "coding", "math", "reasoning", "multilingual", "rag", "agent", "creative",
];

const quantOptions: QuantLevel[] = ["fp16", "q8", "q4"];

const sortOptions = [
  { value: "recommended", label: "おすすめ度順" },
  { value: "benchmark", label: "ベンチマーク順" },
  { value: "vram_efficiency", label: "VRAM効率順" },
  { value: "release_date", label: "リリース日順" },
  { value: "param_asc", label: "パラメータ数（小→大）" },
  { value: "param_desc", label: "パラメータ数（大→小）" },
];

interface Filters {
  categories: Category[];
  sizeRange: string;
  commercialOnly: boolean;
  japaneseOnly: boolean;
  quantLevel: QuantLevel | "";
  architecture: string;
  sortBy: string;
}

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterPanel({ filters, onFilterChange }: Props) {
  const toggleCategory = (cat: Category) => {
    const cats = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: cats });
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-xl border border-gray-200">
      <h3 className="font-bold text-gray-900 text-sm">フィルタ</h3>

      {/* Category */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">用途</label>
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filters.categories.includes(cat)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Size range */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">モデルサイズ</label>
        <div className="flex flex-wrap gap-1.5">
          {sizeRanges.map((range) => (
            <button
              key={range}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  sizeRange: filters.sizeRange === range ? "" : range,
                })
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filters.sizeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quantization */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">量子化レベル</label>
        <div className="flex flex-wrap gap-1.5">
          {quantOptions.map((q) => (
            <button
              key={q}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  quantLevel: filters.quantLevel === q ? "" : q,
                })
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filters.quantLevel === q
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {QUANT_LABELS[q]}
            </button>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">アーキテクチャ</label>
        <div className="flex gap-1.5">
          {["", "dense", "moe"].map((arch) => (
            <button
              key={arch}
              onClick={() => onFilterChange({ ...filters, architecture: filters.architecture === arch ? "" : arch })}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filters.architecture === arch
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {arch === "" ? "すべて" : arch === "dense" ? "Dense" : "MoE"}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.commercialOnly}
            onChange={(e) => onFilterChange({ ...filters, commercialOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          商用利用可のみ
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.japaneseOnly}
            onChange={(e) => onFilterChange({ ...filters, japaneseOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          日本語対応のみ
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1.5">ソート</label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() =>
          onFilterChange({
            categories: [],
            sizeRange: "",
            commercialOnly: false,
            japaneseOnly: false,
            quantLevel: "",
            architecture: "",
            sortBy: "recommended",
          })
        }
        className="w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
      >
        フィルタをリセット
      </button>
    </div>
  );
}
