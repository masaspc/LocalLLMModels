"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { modelList } from "@/data/models";
import { CATEGORY_LABELS, JP_SUPPORT_LABELS, QUANT_LABELS, Category } from "@/types";
import { formatParamCount, renderStars } from "@/lib/utils";

const sizeRanges = ["すべて", "~3B", "3~8B", "8~14B", "14~32B", "32~70B", "70B~"];

export default function ModelsPage() {
  const [search, setSearch] = useState("");
  const [sizeRange, setSizeRange] = useState("すべて");
  const [selectedCat, setSelectedCat] = useState<Category | "">("");
  const [sortBy, setSortBy] = useState("recommended");

  const filtered = useMemo(() => {
    let list = [...modelList];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.family.toLowerCase().includes(q) ||
          m.developer.toLowerCase().includes(q)
      );
    }

    if (selectedCat) {
      list = list.filter((m) => m.categories.includes(selectedCat));
    }

    if (sizeRange !== "すべて") {
      list = list.filter((m) => {
        const p = m.parameterCount;
        switch (sizeRange) {
          case "~3B": return p <= 3;
          case "3~8B": return p > 3 && p <= 8;
          case "8~14B": return p > 8 && p <= 14;
          case "14~32B": return p > 14 && p <= 32;
          case "32~70B": return p > 32 && p <= 70;
          case "70B~": return p > 70;
          default: return true;
        }
      });
    }

    switch (sortBy) {
      case "benchmark":
        list.sort((a, b) => (b.benchmarks.mmluPro ?? 0) - (a.benchmarks.mmluPro ?? 0));
        break;
      case "param_asc":
        list.sort((a, b) => a.parameterCount - b.parameterCount);
        break;
      case "param_desc":
        list.sort((a, b) => b.parameterCount - a.parameterCount);
        break;
      case "release_date":
        list.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
        break;
      default:
        list.sort((a, b) => b.ratings.overall - a.ratings.overall);
    }

    return list;
  }, [search, sizeRange, selectedCat, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">モデル一覧</h1>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="モデル名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={sizeRange}
          onChange={(e) => setSizeRange(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          {sizeRanges.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value as Category | "")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="">全用途</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="recommended">おすすめ度順</option>
          <option value="benchmark">ベンチマーク順</option>
          <option value="param_asc">パラメータ（小→大）</option>
          <option value="param_desc">パラメータ（大→小）</option>
          <option value="release_date">リリース日順</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length} モデル</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="pb-3 pr-4 font-medium">モデル</th>
              <th className="pb-3 pr-4 font-medium">パラメータ</th>
              <th className="pb-3 pr-4 font-medium">アーキ</th>
              <th className="pb-3 pr-4 font-medium hidden md:table-cell">コンテキスト</th>
              <th className="pb-3 pr-4 font-medium hidden lg:table-cell">VRAM (Q4)</th>
              <th className="pb-3 pr-4 font-medium">日本語</th>
              <th className="pb-3 pr-4 font-medium hidden sm:table-cell">ライセンス</th>
              <th className="pb-3 font-medium">評価</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 pr-4">
                  <Link href={`/models/${m.id}`} className="font-medium text-blue-600 hover:underline">
                    {m.name}
                  </Link>
                  <div className="text-xs text-gray-400">{m.developer}</div>
                </td>
                <td className="py-3 pr-4 text-gray-700">
                  {formatParamCount(m.parameterCount, m.activeParameters)}
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${m.architecture === "moe" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                    {m.architecture === "moe" ? "MoE" : "Dense"}
                  </span>
                </td>
                <td className="py-3 pr-4 text-gray-600 hidden md:table-cell">
                  {m.contextLength >= 1000 ? `${m.contextLength / 1000}K` : m.contextLength}
                </td>
                <td className="py-3 pr-4 text-gray-600 hidden lg:table-cell">
                  {m.vramRequirements.q4}GB
                </td>
                <td className="py-3 pr-4">{JP_SUPPORT_LABELS[m.japaneseSupport]}</td>
                <td className="py-3 pr-4 text-gray-600 text-xs hidden sm:table-cell">
                  {m.license}
                  {m.commercialUse && <span className="ml-1 text-blue-600">(商用可)</span>}
                </td>
                <td className="py-3 text-amber-500 text-xs">{renderStars(m.ratings.overall)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
