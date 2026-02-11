import { modelList } from "@/data/models";
import { hardwareList } from "@/data/hardware";
import { CATEGORY_LABELS, JP_SUPPORT_LABELS, QUANT_LABELS } from "@/types";
import { formatParamCount, renderStars, formatVram } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import BenchmarkChart from "@/components/BenchmarkChart";

export function generateStaticParams() {
  return modelList.map((m) => ({ id: m.id }));
}

export default async function ModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = modelList.find((m) => m.id === id);
  if (!model) notFound();

  // Find which hardware can run this model at Q4
  const compatibleHw = hardwareList
    .filter((hw) => hw.vram >= model.recommendedVram.context8k.q4)
    .sort((a, b) => a.vram - b.vram);

  const benchmarkEntries = Object.entries(model.benchmarks).filter(
    ([, v]) => v !== undefined
  ) as [string, number][];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/models" className="hover:text-gray-600">モデル一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{model.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{model.name}</h1>
          <p className="text-gray-500 mt-1">
            {model.developer} / {model.family} ファミリー
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {model.categories.map((cat) => (
              <span key={cat} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {CATEGORY_LABELS[cat]}
              </span>
            ))}
            {model.architecture === "moe" && (
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">MoE</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-amber-500 text-lg">{renderStars(model.ratings.overall)}</div>
          <div className="text-sm text-gray-500 mt-1">日本語: {JP_SUPPORT_LABELS[model.japaneseSupport]}</div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "パラメータ数", value: formatParamCount(model.parameterCount, model.activeParameters) },
          { label: "アーキテクチャ", value: model.architecture === "moe" ? "Mixture of Experts" : "Dense" },
          { label: "コンテキスト長", value: `${model.contextLength >= 1000 ? `${model.contextLength / 1000}K` : model.contextLength} tokens` },
          { label: "ライセンス", value: `${model.license}${model.commercialUse ? " (商用可)" : " (非商用)"}` },
          { label: "リリース日", value: model.releaseDate },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-400">{item.label}</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      {model.description && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">モデル概要</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{model.description}</p>
        </div>
      )}

      {/* Notes */}
      {model.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-800">{model.notes}</p>
        </div>
      )}

      {/* VRAM Requirements */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">VRAM必要量</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-6 font-medium">量子化</th>
                <th className="pb-3 pr-6 font-medium">モデルウェイト</th>
                <th className="pb-3 pr-6 font-medium">推奨 (8Kコンテキスト)</th>
                <th className="pb-3 font-medium">推奨 (32Kコンテキスト)</th>
              </tr>
            </thead>
            <tbody>
              {(["fp16", "q8", "q4"] as const).map((q) => (
                <tr key={q} className="border-b border-gray-100">
                  <td className="py-3 pr-6 font-medium text-gray-900">{QUANT_LABELS[q]}</td>
                  <td className="py-3 pr-6 text-gray-600">{formatVram(model.vramRequirements[q])}</td>
                  <td className="py-3 pr-6 text-gray-600">{formatVram(model.recommendedVram.context8k[q])}</td>
                  <td className="py-3 text-gray-600">{formatVram(model.recommendedVram.context32k[q])}</td>
                </tr>
              ))}
              {model.vramRequirements.q3 && (
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-6 font-medium text-gray-900">{QUANT_LABELS.q3}</td>
                  <td className="py-3 pr-6 text-gray-600">{formatVram(model.vramRequirements.q3)}</td>
                  <td className="py-3 pr-6 text-gray-400">-</td>
                  <td className="py-3 text-gray-400">-</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Benchmarks */}
      {benchmarkEntries.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">ベンチマークスコア</h2>
          <BenchmarkChart benchmarks={model.benchmarks} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {benchmarkEntries.map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="text-xs text-gray-400">{benchmarkLabel(key)}</div>
                <div className="text-lg font-bold text-gray-900">{(value * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ratings */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">カテゴリ別評価</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {([
            ["overall", "総合"],
            ["coding", "コーディング"],
            ["reasoning", "推論"],
            ["creative", "クリエイティブ"],
            ["multilingual", "多言語"],
          ] as const).map(([key, label]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
              <div className="text-xs text-gray-400">{label}</div>
              <div className="text-amber-500 mt-1">{renderStars(model.ratings[key])}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick start */}
      {(model.quickStart.ollama || model.quickStart.llamaCpp || model.quickStart.vllm) && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">クイックスタート</h2>
          <div className="space-y-3">
            {model.quickStart.ollama && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Ollama</div>
                <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm">
                  $ {model.quickStart.ollama}
                </div>
              </div>
            )}
            {model.quickStart.llamaCpp && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">llama.cpp</div>
                <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm">
                  $ {model.quickStart.llamaCpp}
                </div>
              </div>
            )}
            {model.quickStart.vllm && (
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">vLLM</div>
                <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm">
                  $ {model.quickStart.vllm}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Compatible hardware */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">対応ハードウェア (Q4量子化)</h2>
        {compatibleHw.length === 0 ? (
          <p className="text-gray-500">対応するハードウェアがデータベースにありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {compatibleHw.map((hw) => (
              <Link
                key={hw.id}
                href={`/hardware/${hw.id}`}
                className="block p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="font-medium text-gray-900 text-sm">{hw.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {hw.vram}GB / {hw.memoryBandwidth} GB/s / {hw.priceRange}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function benchmarkLabel(key: string): string {
  const labels: Record<string, string> = {
    mmluPro: "MMLU-Pro",
    humanEval: "HumanEval",
    mathScore: "MATH",
    aime: "AIME",
    liveCodeBench: "LiveCodeBench",
    arenaHard: "Arena Hard",
  };
  return labels[key] ?? key;
}
