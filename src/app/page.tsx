"use client";

import { useState, useMemo } from "react";
import { Hardware, HardwareCategory, Category, QuantLevel } from "@/types";
import { modelList } from "@/data/models";
import HardwareSelector from "@/components/HardwareSelector";
import ModelCard from "@/components/ModelCard";
import FilterPanel from "@/components/FilterPanel";
import { matchModels } from "@/lib/matching";
import { Cpu, Zap, Database } from "lucide-react";

interface Filters {
  categories: Category[];
  sizeRange: string;
  commercialOnly: boolean;
  japaneseOnly: boolean;
  quantLevel: QuantLevel | "";
  architecture: string;
  sortBy: string;
}

const defaultFilters: Filters = {
  categories: [],
  sizeRange: "",
  commercialOnly: false,
  japaneseOnly: false,
  quantLevel: "",
  architecture: "",
  sortBy: "recommended",
};

export default function HomePage() {
  const [selectedHw, setSelectedHw] = useState<Hardware | null>(null);
  const [activeCategory, setActiveCategory] = useState<HardwareCategory>("nvidia_consumer");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    if (!selectedHw) return [];
    const matched = matchModels(selectedHw, modelList, {
      categories: filters.categories.length > 0 ? filters.categories : undefined,
      sizeRange: filters.sizeRange || undefined,
      commercialOnly: filters.commercialOnly,
      japaneseOnly: filters.japaneseOnly,
      quantLevel: filters.quantLevel || undefined,
      architecture: filters.architecture || undefined,
    });

    switch (filters.sortBy) {
      case "benchmark":
        return [...matched].sort(
          (a, b) => (b.model.benchmarks.mmluPro ?? 0) - (a.model.benchmarks.mmluPro ?? 0)
        );
      case "vram_efficiency":
        return [...matched].sort(
          (a, b) =>
            (b.model.ratings.overall / b.requiredVram) -
            (a.model.ratings.overall / a.requiredVram)
        );
      case "release_date":
        return [...matched].sort(
          (a, b) => b.model.releaseDate.localeCompare(a.model.releaseDate)
        );
      case "param_asc":
        return [...matched].sort(
          (a, b) => a.model.parameterCount - b.model.parameterCount
        );
      case "param_desc":
        return [...matched].sort(
          (a, b) => b.model.parameterCount - a.model.parameterCount
        );
      default:
        return matched;
    }
  }, [selectedHw, filters]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const comfortable = results.filter((r) => r.tier === "comfortable");
  const possible = results.filter((r) => r.tier === "possible");
  const difficult = results.filter((r) => r.tier === "difficult");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      {!selectedHw && (
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            あなたのハードウェアに
            <br className="sm:hidden" />
            最適なLLMを見つけよう
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            GPU・Apple Silicon・DGX Sparkなどを選ぶだけで、実行可能なローカルLLMモデルを即座にマッチング。
            VRAM計算からセットアップ手順まで、すべてここで。
          </p>
          <div className="mt-6 flex justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> 30+ ハードウェア
            </span>
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4" /> 32+ モデル
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> 即時マッチング
            </span>
          </div>
        </div>
      )}

      {/* Hardware Selector */}
      <HardwareSelector
        selectedId={selectedHw?.id ?? null}
        onSelect={setSelectedHw}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Results */}
      {selectedHw && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedHw.name} のマッチング結果
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({results.length} モデル)
              </span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {showFilters ? "フィルタを隠す" : "フィルタ"}
            </button>
          </div>

          <div className="flex gap-6">
            {/* Filter sidebar (desktop) */}
            {showFilters && (
              <div className="w-72 shrink-0 hidden lg:block">
                <FilterPanel filters={filters} onFilterChange={setFilters} />
              </div>
            )}

            {/* Mobile filters overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setShowFilters(false)}>
                <div className="absolute right-0 top-0 h-full w-80 bg-gray-50 p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <FilterPanel filters={filters} onFilterChange={setFilters} />
                </div>
              </div>
            )}

            {/* Results grid */}
            <div className="flex-1 space-y-6">
              {/* Compare bar */}
              {compareIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {compareIds.length}/4 モデルを選択中
                  </span>
                  <a
                    href={`/compare?models=${compareIds.join(",")}`}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    比較する
                  </a>
                </div>
              )}

              {comfortable.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">{"\u{1F7E2}"}</span> 快適動作 ({comfortable.length})
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {comfortable.map((r) => (
                      <ModelCard
                        key={r.model.id + r.quantLevel}
                        result={r}
                        onCompareAdd={toggleCompare}
                        compareSelected={compareIds.includes(r.model.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {possible.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">{"\u{1F7E1}"}</span> 動作可能 ({possible.length})
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {possible.map((r) => (
                      <ModelCard
                        key={r.model.id + r.quantLevel}
                        result={r}
                        onCompareAdd={toggleCompare}
                        compareSelected={compareIds.includes(r.model.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {difficult.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <span className="text-lg">{"\u{1F534}"}</span> 動作困難 ({difficult.length})
                  </h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {difficult.map((r) => (
                      <ModelCard
                        key={r.model.id + r.quantLevel}
                        result={r}
                        onCompareAdd={toggleCompare}
                        compareSelected={compareIds.includes(r.model.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-lg">条件に一致するモデルがありません</p>
                  <p className="text-sm mt-1">フィルタ条件を変更してみてください</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
