import { hardwareList } from "@/data/hardware";
import { modelList } from "@/data/models";
import { HARDWARE_CATEGORY_LABELS, QUANT_LABELS } from "@/types";
import { formatVram, renderStars } from "@/lib/utils";
import { matchModels } from "@/lib/matching";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return hardwareList.map((h) => ({ id: h.id }));
}

export default async function HardwareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hardware = hardwareList.find((h) => h.id === id);
  if (!hardware) notFound();

  const results = matchModels(hardware, modelList);
  const comfortable = results.filter((r) => r.tier === "comfortable");
  const possible = results.filter((r) => r.tier === "possible");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/hardware" className="hover:text-gray-600">ハードウェア一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{hardware.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{hardware.name}</h1>
      <p className="text-gray-500">{HARDWARE_CATEGORY_LABELS[hardware.category]}</p>

      {/* Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 mb-8">
        {[
          { label: "VRAM", value: `${hardware.vram}GB` },
          { label: "メモリ帯域幅", value: `${hardware.memoryBandwidth} GB/s` },
          { label: "メモリ種別", value: hardware.memoryType },
          { label: "TDP", value: `${hardware.tdp}W` },
          { label: "価格帯", value: hardware.priceRange },
          { label: "統合メモリ", value: hardware.unifiedMemory ? "はい" : "いいえ" },
          { label: "マルチGPU対応", value: hardware.multiGpuSupport ? "はい" : "いいえ" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-xs text-gray-400">{item.label}</div>
            <div className="text-sm font-semibold text-gray-900 mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Description */}
      {hardware.description && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">概要</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{hardware.description}</p>
        </div>
      )}

      {hardware.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-800">{hardware.notes}</p>
        </div>
      )}

      {/* Compatible models */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          対応モデル一覧
          <span className="text-sm font-normal text-gray-500 ml-2">
            (快適: {comfortable.length} / 動作可能: {possible.length})
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-3 pr-4 font-medium">ステータス</th>
                <th className="pb-3 pr-4 font-medium">モデル</th>
                <th className="pb-3 pr-4 font-medium">量子化</th>
                <th className="pb-3 pr-4 font-medium">必要VRAM</th>
                <th className="pb-3 pr-4 font-medium hidden sm:table-cell">最大コンテキスト</th>
                <th className="pb-3 pr-4 font-medium hidden md:table-cell">推定速度</th>
                <th className="pb-3 font-medium">評価</th>
              </tr>
            </thead>
            <tbody>
              {results.filter((r) => r.tier !== "difficult").map((r) => (
                <tr key={r.model.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.tier === "comfortable"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {r.tier === "comfortable" ? "快適" : "可能"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <Link href={`/models/${r.model.id}`} className="font-medium text-blue-600 hover:underline">
                      {r.model.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{QUANT_LABELS[r.quantLevel]}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatVram(r.requiredVram)}</td>
                  <td className="py-3 pr-4 text-gray-600 hidden sm:table-cell">{r.maxContext}</td>
                  <td className="py-3 pr-4 text-gray-500 text-xs hidden md:table-cell">{r.estimatedSpeed}</td>
                  <td className="py-3 text-amber-500 text-xs">{renderStars(r.model.ratings.overall)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
