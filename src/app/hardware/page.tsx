"use client";

import { useState } from "react";
import Link from "next/link";
import { hardwareList } from "@/data/hardware";
import { HardwareCategory, HARDWARE_CATEGORY_LABELS } from "@/types";

const categories: (HardwareCategory | "all")[] = [
  "all", "nvidia_consumer", "nvidia_pro", "amd", "apple_silicon", "dedicated_ai", "multi_gpu",
];

export default function HardwarePage() {
  const [selectedCat, setSelectedCat] = useState<HardwareCategory | "all">("all");

  const filtered = selectedCat === "all"
    ? hardwareList
    : hardwareList.filter((h) => h.category === selectedCat);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ハードウェア一覧</h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCat === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat === "all" ? "すべて" : HARDWARE_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} ハードウェア</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">ハードウェア</th>
              <th className="pb-3 pr-4 font-medium">VRAM</th>
              <th className="pb-3 pr-4 font-medium">帯域幅</th>
              <th className="pb-3 pr-4 font-medium hidden md:table-cell">メモリ種別</th>
              <th className="pb-3 pr-4 font-medium hidden lg:table-cell">TDP</th>
              <th className="pb-3 pr-4 font-medium hidden sm:table-cell">価格帯</th>
              <th className="pb-3 font-medium hidden lg:table-cell">特徴</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((hw) => (
              <tr key={hw.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4">
                  <Link href={`/hardware/${hw.id}`} className="font-medium text-blue-600 hover:underline">
                    {hw.name}
                  </Link>
                  <div className="text-xs text-gray-400">
                    {HARDWARE_CATEGORY_LABELS[hw.category]}
                  </div>
                </td>
                <td className="py-3 pr-4 font-semibold text-gray-900">{hw.vram}GB</td>
                <td className="py-3 pr-4 text-gray-600">{hw.memoryBandwidth} GB/s</td>
                <td className="py-3 pr-4 text-gray-600 hidden md:table-cell">{hw.memoryType}</td>
                <td className="py-3 pr-4 text-gray-600 hidden lg:table-cell">{hw.tdp}W</td>
                <td className="py-3 pr-4 text-gray-600 hidden sm:table-cell">{hw.priceRange}</td>
                <td className="py-3 text-gray-500 text-xs hidden lg:table-cell max-w-xs truncate">
                  {hw.unifiedMemory && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded mr-1">統合メモリ</span>}
                  {hw.multiGpuSupport && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded mr-1">マルチGPU</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
