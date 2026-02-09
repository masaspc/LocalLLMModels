"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { modelList } from "@/data/models";
import { CATEGORY_LABELS, JP_SUPPORT_LABELS, QUANT_LABELS, LLMModel } from "@/types";
import { formatParamCount, renderStars, formatVram } from "@/lib/utils";
import BenchmarkChart from "@/components/BenchmarkChart";
import Link from "next/link";
import { X } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const initialIds = searchParams.get("models")?.split(",").filter(Boolean) ?? [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);

  const models = useMemo(
    () => selectedIds.map((id) => modelList.find((m) => m.id === id)).filter(Boolean) as LLMModel[],
    [selectedIds]
  );

  const availableModels = modelList.filter((m) => !selectedIds.includes(m.id));

  const addModel = (id: string) => {
    if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeModel = (id: string) => {
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">モデル比較</h1>

      {/* Add model */}
      {selectedIds.length < 4 && (
        <div className="mb-6">
          <select
            onChange={(e) => {
              if (e.target.value) addModel(e.target.value);
              e.target.value = "";
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>モデルを追加 ({selectedIds.length}/4)</option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.parameterCount}B)</option>
            ))}
          </select>
        </div>
      )}

      {models.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">比較するモデルを選択してください</p>
          <p className="text-sm mt-2">最大4モデルまで比較できます</p>
        </div>
      ) : (
        <>
          {/* Selected model pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {models.map((m) => (
              <span key={m.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
                {m.name}
                <button onClick={() => removeModel(m.id)} className="hover:text-blue-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 text-left text-gray-500 font-medium w-40">項目</th>
                  {models.map((m) => (
                    <th key={m.id} className="pb-3 pr-4 text-left font-medium text-gray-900">
                      <Link href={`/models/${m.id}`} className="text-blue-600 hover:underline">
                        {m.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="開発元" values={models.map((m) => m.developer)} />
                <CompareRow label="パラメータ" values={models.map((m) => formatParamCount(m.parameterCount, m.activeParameters))} />
                <CompareRow label="アーキテクチャ" values={models.map((m) => m.architecture === "moe" ? "MoE" : "Dense")} />
                <CompareRow
                  label="コンテキスト長"
                  values={models.map((m) => m.contextLength >= 1000 ? `${m.contextLength / 1000}K` : `${m.contextLength}`)}
                />
                <CompareRow
                  label="VRAM (Q4)"
                  values={models.map((m) => formatVram(m.vramRequirements.q4))}
                />
                <CompareRow
                  label="VRAM (Q8)"
                  values={models.map((m) => formatVram(m.vramRequirements.q8))}
                />
                <CompareRow
                  label="VRAM (FP16)"
                  values={models.map((m) => formatVram(m.vramRequirements.fp16))}
                />
                <CompareRow
                  label="推奨VRAM (Q4, 8K)"
                  values={models.map((m) => formatVram(m.recommendedVram.context8k.q4))}
                />
                <CompareRow
                  label="ライセンス"
                  values={models.map((m) => `${m.license}${m.commercialUse ? " (商用可)" : ""}`)}
                />
                <CompareRow
                  label="日本語"
                  values={models.map((m) => JP_SUPPORT_LABELS[m.japaneseSupport])}
                />
                <CompareRow
                  label="総合評価"
                  values={models.map((m) => renderStars(m.ratings.overall))}
                  isRating
                />
                <CompareRow
                  label="コーディング"
                  values={models.map((m) => renderStars(m.ratings.coding))}
                  isRating
                />
                <CompareRow
                  label="推論"
                  values={models.map((m) => renderStars(m.ratings.reasoning))}
                  isRating
                />
                <CompareRow
                  label="多言語"
                  values={models.map((m) => renderStars(m.ratings.multilingual))}
                  isRating
                />
                <CompareRow
                  label="MMLU-Pro"
                  values={models.map((m) => m.benchmarks.mmluPro ? `${(m.benchmarks.mmluPro * 100).toFixed(1)}%` : "-")}
                />
                <CompareRow
                  label="HumanEval"
                  values={models.map((m) => m.benchmarks.humanEval ? `${(m.benchmarks.humanEval * 100).toFixed(1)}%` : "-")}
                />
                <CompareRow
                  label="MATH"
                  values={models.map((m) => m.benchmarks.mathScore ? `${(m.benchmarks.mathScore * 100).toFixed(1)}%` : "-")}
                />
                <CompareRow
                  label="用途"
                  values={models.map((m) => m.categories.map((c) => CATEGORY_LABELS[c]).join(", "))}
                />
              </tbody>
            </table>
          </div>

          {/* Radar chart */}
          {models.length >= 2 && models[0].benchmarks && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">ベンチマーク比較チャート</h2>
              <BenchmarkChart
                benchmarks={models[0].benchmarks}
                compareBenchmarks={models.slice(1).map((m) => ({
                  name: m.name,
                  benchmarks: m.benchmarks,
                }))}
              />
              <div className="flex gap-4 justify-center mt-2 text-sm">
                {models.map((m, i) => (
                  <span key={m.id} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][i] }}
                    />
                    {m.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* VRAM comparison bars */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">VRAM使用量比較 (Q4)</h2>
            <div className="space-y-3">
              {models.map((m, i) => {
                const maxVram = Math.max(...models.map((x) => x.vramRequirements.q4));
                const pct = (m.vramRequirements.q4 / maxVram) * 100;
                return (
                  <div key={m.id}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900">{m.name}</span>
                      <span className="text-gray-500">{formatVram(m.vramRequirements.q4)}</span>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][i],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function CompareRow({
  label,
  values,
  isRating,
}: {
  label: string;
  values: string[];
  isRating?: boolean;
}) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pr-6 text-gray-500 font-medium">{label}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={`py-3 pr-4 ${isRating ? "text-amber-500" : "text-gray-700"}`}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">読み込み中...</div>}>
      <CompareContent />
    </Suspense>
  );
}
