import { modelList } from "@/data/models";
import { CATEGORY_LABELS, JP_SUPPORT_LABELS, QUANT_LABELS } from "@/types";
import { formatParamCount, renderStars, formatVram } from "@/lib/utils";
import Link from "next/link";
import BenchmarkChart from "@/components/BenchmarkChart";

// おすすめ5選のモデルID
const recommendedIds = [
  "qwen3-8b",
  "qwen3-32b",
  "deepseek-r1-32b",
  "mistral-small-24b",
  "gemma3-27b",
];

const recommendedReasons: Record<string, {
  rank: number;
  badge: string;
  tagline: string;
  whyRecommend: string;
  bestFor: string[];
  idealHardware: string[];
  proscons: { pros: string[]; cons: string[] };
}> = {
  "qwen3-8b": {
    rank: 1,
    badge: "日本語最強の8B",
    tagline: "日本語ローカルLLMの決定版。コスパ・性能・日本語力のすべてがトップクラス",
    whyRecommend: "ローカルLLMを初めて試す日本語ユーザーに最もおすすめのモデルです。8Bパラメータというコンパクトなサイズながら、日本語の自然な文章生成、敬語の使い分け、ビジネス文書の作成において群を抜く品質を発揮します。Alibabaの大規模な日本語コーパスによるトレーニングの成果が顕著で、同サイズの他モデル（Llama 3.3 8B、Gemma 3 12Bなど）と比較しても日本語能力で明確な優位性があります。HumanEval 68%のコーディング能力も実用レベルで、日常的なプログラミング支援にも十分に対応。Q4量子化でわずか6GB程度のVRAMで動作するため、GTX 1660やRTX 3060といったミドルレンジGPUから利用可能です。",
    bestFor: ["日本語でのチャット・文書作成", "ビジネスメール・レポートの下書き", "簡単なコーディング支援", "ローカルLLM入門の第一歩"],
    idealHardware: ["RTX 3060 12GB（快適）", "RTX 4060 8GB（Q4で動作）", "M1/M2 MacBook Pro 16GB", "GTX 1660 Super 6GB（Q4で動作）"],
    proscons: {
      pros: ["日本語能力がサイズクラス最高", "6GBのVRAMで動作するコンパクトさ", "Apache 2.0で商用利用完全自由", "Ollamaで簡単にセットアップ可能"],
      cons: ["32Kコンテキストでロングコンテキストは弱め", "複雑な推論タスクは大型モデルに劣る", "マルチモーダル（画像理解）非対応"],
    },
  },
  "qwen3-32b": {
    rank: 2,
    badge: "最高コスパの32B",
    tagline: "RTX 4090で動く最強クラス。コーディングも日本語も妥協なし",
    whyRecommend: "ハイエンドコンシューマGPU（RTX 4090）で動作する最高性能モデルです。MMLU-Pro 69%、HumanEval 80%、MATH 72%と全ベンチマークで高水準を達成しており、70Bクラスのモデルに迫る総合力を32Bというコンパクトなサイズで実現しています。特にコーディング能力（HumanEval 80%）は圧巻で、複数ファイルにまたがるコードの理解、アーキテクチャ設計の提案、デバッグ支援まで幅広く対応。日本語も「◎」評価で、高品質な日本語文書の生成、翻訳、要約が可能です。Q4量子化で18GBのVRAMで動作し、RTX 4090（24GB）にぴったり収まるサイズ感が絶妙。「1枚のGPUで最大限の性能が欲しい」ユーザーの決定版です。",
    bestFor: ["本格的なコーディング支援・コードレビュー", "日本語の高品質ドキュメント生成", "技術文書の翻訳・要約", "企業向けチャットボット・RAGシステム"],
    idealHardware: ["RTX 4090 24GB（快適）", "RTX 3090 24GB（Q4で動作）", "M2 Pro/Max MacBook Pro 32GB", "Apple M4 Pro 24GB"],
    proscons: {
      pros: ["RTX 4090で動く最高性能モデル", "コーディング能力（HumanEval 80%）が突出", "日本語能力◎、多言語対応も万全", "32Kコンテキストで実用的な長文処理"],
      cons: ["24GB以上のVRAMが必要", "FP16では64GBのVRAMが必要", "MoEモデルほどの推論速度は出ない"],
    },
  },
  "deepseek-r1-32b": {
    rank: 3,
    badge: "推論力No.1の32B",
    tagline: "「考えるAI」をローカルで。数学とコーディングの推論力が圧倒的",
    whyRecommend: "「AIに深く考えてほしい」タスクに最適なモデルです。DeepSeek R1シリーズは、Chain-of-Thought（思考の連鎖）を内蔵した推論特化型モデルで、回答前に「<think>」タグ内で段階的に思考プロセスを展開します。MATH 80%という極めて高い数学スコアは、大学レベルの数学問題や統計分析にも対応できるレベル。コーディングではHumanEval 76%を記録し、アルゴリズム設計やデータ構造の最適化提案に強みを持ちます。MIT Licenseで完全にオープンソース・商用利用可能という点も大きな魅力。Qwen3 32Bと同じ18-22GBのVRAMで動作するため、RTX 4090でも利用可能です。汎用性よりも「深い推論力」を求めるユーザーにはこちらがベストです。",
    bestFor: ["数学的推論・統計分析", "アルゴリズム設計・コードの最適化", "論理的な文書作成・分析レポート", "複雑な問題の段階的解決"],
    idealHardware: ["RTX 4090 24GB（Q4で快適）", "RTX 3090 24GB（Q4で動作）", "M2 Pro/Max MacBook Pro 32GB", "RTX PRO 6000 96GB（FP16で動作）"],
    proscons: {
      pros: ["数学推論MATH 80%は同サイズ最高", "思考プロセスが可視化され信頼性が高い", "MIT Licenseで完全オープンソース", "商用利用が完全に自由"],
      cons: ["推論過程を出力するため応答が長くなる", "クリエイティブ・雑談タスクは苦手", "日本語は「良好」だが「◎」ではない"],
    },
  },
  "mistral-small-24b": {
    rank: 4,
    badge: "Apache 2.0の万能型",
    tagline: "商用利用完全自由で128Kコンテキスト。企業導入に最適なバランスモデル",
    whyRecommend: "企業がプロダクション環境にローカルLLMを導入する際の最有力候補です。Apache 2.0ライセンスにより商用利用が完全に自由で、ライセンス費用やコンプライアンスの心配が一切不要。128Kコンテキスト長は実務で非常に重要で、長文の契約書、技術仕様書、コードベース全体を一度に処理できます。MMLU-Pro 66%、HumanEval 73%とバランスの取れた高い性能で、コーディング、推論、クリエイティブ、多言語のすべてで安定した4つ星評価を獲得。フランスのMistral AIが開発しており、欧州のデータ保護規制（GDPR）を意識した設計思想も企業にとって安心材料です。Q4量子化で14-17GBのVRAMで動作します。",
    bestFor: ["企業の商用プロダクトへのLLM組み込み", "長文ドキュメントの処理・分析（128K対応）", "多言語カスタマーサポート", "Apache 2.0が必要なプロジェクト"],
    idealHardware: ["RTX 4090 24GB（快適）", "RTX 4080 16GB（Q4で動作）", "M2 Pro MacBook Pro 32GB", "RTX 3090 24GB"],
    proscons: {
      pros: ["Apache 2.0で商用利用完全自由", "128Kコンテキストで長文処理に強い", "全カテゴリで安定した高性能", "14-17GBのVRAMで動作可能"],
      cons: ["日本語は「良好」だがQwen3ほどではない", "推論特化タスクではDeepSeek R1に劣る", "32Bモデルほどの総合性能はない"],
    },
  },
  "gemma3-27b": {
    rank: 5,
    badge: "Google品質の安定派",
    tagline: "マルチモーダル対応でGoogle品質。安定性と信頼性を重視する方に",
    whyRecommend: "Google DeepMindが開発した高品質モデルで、Googleの膨大な研究成果が凝縮されています。最大の特徴はマルチモーダル対応で、テキストだけでなく画像の理解・分析も可能な点。128Kコンテキスト長で長文処理にも対応し、MMLU-Pro 65%、HumanEval 72%と着実な性能を発揮します。Googleの安全性フィルタリングが組み込まれており、不適切なコンテンツの生成リスクが低い点は、顧客向けサービスでの利用に大きな安心材料です。Q4量子化で15-19GBのVRAMで動作し、RTX 4090（24GB）で快適に利用可能。派手さはないものの、安定性・信頼性・総合力で選ぶならGemma 3 27Bは堅実な選択です。",
    bestFor: ["画像を含むマルチモーダルタスク", "安全性が求められる顧客向けサービス", "長文ドキュメントの要約・分析", "Google Cloud環境との連携"],
    idealHardware: ["RTX 4090 24GB（快適）", "RTX 3090 24GB（Q4で動作）", "M2 Pro/Max MacBook Pro 32GB", "Apple M4 Pro 24GB"],
    proscons: {
      pros: ["マルチモーダル（画像理解）対応", "Google品質の安全性フィルタリング", "128Kコンテキストで長文に強い", "安定した総合性能（全カテゴリ4つ星）"],
      cons: ["同サイズのQwen3やMistralよりベンチマークスコアがやや低い", "Gemma Licenseは一部制約あり", "MoEではないため推論速度は標準的"],
    },
  },
};

export default function RecommendedPage() {
  const recommendedModels = recommendedIds
    .map((id) => modelList.find((m) => m.id === id)!)
    .filter(Boolean);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          おすすめローカルLLMモデル 5選
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          2025年最新のローカルLLMモデルから、性能・コスパ・日本語対応・用途を総合的に評価して
          厳選した5モデルを詳しく解説します。初心者から上級者まで、あなたに最適なモデルが見つかります。
        </p>
      </div>

      {/* Selection criteria */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4">選定基準</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎯", title: "性能", desc: "ベンチマークスコア（MMLU-Pro、HumanEval、MATH）を総合評価" },
            { icon: "💰", title: "コスパ", desc: "必要VRAM量と性能のバランス。手頃なGPUで動くかを重視" },
            { icon: "🇯🇵", title: "日本語力", desc: "日本語の理解・生成品質。ビジネス利用レベルかを評価" },
            { icon: "📜", title: "ライセンス", desc: "商用利用の可否、利用制限の少なさを考慮" },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick comparison table */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">5選モデル比較一覧</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 text-left">
                <th className="pb-3 pr-4 font-semibold text-gray-700">順位</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">モデル名</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">サイズ</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">必要VRAM (Q4)</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">日本語</th>
                <th className="pb-3 pr-4 font-semibold text-gray-700">ライセンス</th>
                <th className="pb-3 font-semibold text-gray-700">特徴</th>
              </tr>
            </thead>
            <tbody>
              {recommendedModels.map((model) => {
                const info = recommendedReasons[model.id];
                return (
                  <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {info.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      <Link href={`/models/${model.id}`} className="hover:text-blue-600">
                        {model.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{formatParamCount(model.parameterCount)}</td>
                    <td className="py-3 pr-4 text-gray-600">{formatVram(model.recommendedVram.context8k.q4)}</td>
                    <td className="py-3 pr-4">{JP_SUPPORT_LABELS[model.japaneseSupport]}</td>
                    <td className="py-3 pr-4 text-gray-600 text-xs">{model.license}</td>
                    <td className="py-3 text-gray-600 text-xs">{info.badge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed reviews */}
      <div className="space-y-16">
        {recommendedModels.map((model) => {
          const info = recommendedReasons[model.id];
          const benchmarkEntries = Object.entries(model.benchmarks).filter(
            ([, v]) => v !== undefined
          ) as [string, number][];

          return (
            <article key={model.id} id={model.id} className="scroll-mt-20">
              {/* Rank badge + title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center">
                  <span className="text-xs leading-none">No.</span>
                  <span className="text-2xl font-bold leading-none">{info.rank}</span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">{model.name}</h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                      {info.badge}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{model.developer} / {model.family} ファミリー</p>
                  <p className="text-gray-700 mt-2 font-medium">{info.tagline}</p>
                </div>
              </div>

              {/* Category tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {model.categories.map((cat) => (
                  <span key={cat} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {CATEGORY_LABELS[cat]}
                  </span>
                ))}
                {model.architecture === "moe" && (
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">MoE</span>
                )}
              </div>

              {/* Spec cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  { label: "パラメータ", value: formatParamCount(model.parameterCount, model.activeParameters) },
                  { label: "コンテキスト", value: `${model.contextLength >= 1000 ? `${model.contextLength / 1000}K` : model.contextLength}` },
                  { label: "VRAM (Q4)", value: formatVram(model.recommendedVram.context8k.q4) },
                  { label: "日本語", value: JP_SUPPORT_LABELS[model.japaneseSupport] },
                  { label: "総合評価", value: renderStars(model.ratings.overall) },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-900 mt-1">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Why recommend */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-base font-bold text-blue-900 mb-3">おすすめの理由</h3>
                <p className="text-sm text-blue-800 leading-relaxed">{info.whyRecommend}</p>
              </div>

              {/* Best for + Ideal hardware */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">こんな用途に最適</h3>
                  <ul className="space-y-2">
                    {info.bestFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">推奨ハードウェア</h3>
                  <ul className="space-y-2">
                    {info.idealHardware.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">&#9679;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-green-800 mb-3">メリット</h3>
                  <ul className="space-y-2">
                    {info.proscons.pros.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                        <span className="mt-0.5 flex-shrink-0">&#9675;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-red-800 mb-3">デメリット</h3>
                  <ul className="space-y-2">
                    {info.proscons.cons.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                        <span className="mt-0.5 flex-shrink-0">&#9651;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benchmark scores */}
              {benchmarkEntries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">ベンチマークスコア</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {benchmarkEntries.map(([key, value]) => (
                      <div key={key} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xs text-gray-400">{benchmarkLabel(key)}</div>
                        <div className="text-lg font-bold text-gray-900">{(value * 100).toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VRAM table */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">VRAM必要量</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left text-gray-500">
                        <th className="pb-2 pr-6 font-medium text-xs">量子化</th>
                        <th className="pb-2 pr-6 font-medium text-xs">モデルウェイト</th>
                        <th className="pb-2 pr-6 font-medium text-xs">推奨 (8K)</th>
                        <th className="pb-2 font-medium text-xs">推奨 (32K)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(["fp16", "q8", "q4"] as const).map((q) => (
                        <tr key={q} className="border-b border-gray-100">
                          <td className="py-2 pr-6 font-medium text-gray-900 text-xs">{QUANT_LABELS[q]}</td>
                          <td className="py-2 pr-6 text-gray-600 text-xs">{formatVram(model.vramRequirements[q])}</td>
                          <td className="py-2 pr-6 text-gray-600 text-xs">{formatVram(model.recommendedVram.context8k[q])}</td>
                          <td className="py-2 text-gray-600 text-xs">{formatVram(model.recommendedVram.context32k[q])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick start */}
              {model.quickStart.ollama && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">クイックスタート</h3>
                  <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm">
                    $ {model.quickStart.ollama}
                  </div>
                </div>
              )}

              {/* Link to detail page */}
              <div className="flex justify-end">
                <Link
                  href={`/models/${model.id}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  詳細ページへ &rarr;
                </Link>
              </div>

              {/* Divider */}
              {info.rank < 5 && <hr className="mt-12 border-gray-200" />}
            </article>
          );
        })}
      </div>

      {/* Summary / Decision guide */}
      <div className="mt-16 bg-gray-900 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">目的別おすすめ早見表</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { need: "初めてのローカルLLM", model: "Qwen3 8B", reason: "6GBのVRAMで動作、日本語最強、セットアップ簡単" },
            { need: "1枚のGPUで最強性能", model: "Qwen3 32B", reason: "RTX 4090で動く最高性能、コーディングHumanEval 80%" },
            { need: "数学・推論・分析タスク", model: "DeepSeek R1 32B", reason: "MATH 80%の推論力、思考プロセス可視化" },
            { need: "企業の商用プロダクト", model: "Mistral Small 3.1 24B", reason: "Apache 2.0ライセンス、128Kコンテキスト" },
            { need: "画像理解が必要", model: "Gemma 3 27B", reason: "マルチモーダル対応、Google品質の安全性" },
            { need: "リソースが限られている", model: "Qwen3 8B", reason: "Q4で6GB、GTX 1660でも動作可能" },
          ].map((item) => (
            <div key={item.need} className="bg-white/10 rounded-xl p-4">
              <div className="text-sm text-gray-300 mb-1">{item.need}</div>
              <div className="font-bold text-lg text-white">{item.model}</div>
              <div className="text-xs text-gray-400 mt-1">{item.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">お持ちのハードウェアで動くモデルを探しましょう</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            ハードウェアで検索
          </Link>
          <Link
            href="/models"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            全モデル一覧
          </Link>
          <Link
            href="/compare"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            モデルを比較
          </Link>
        </div>
      </div>
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
