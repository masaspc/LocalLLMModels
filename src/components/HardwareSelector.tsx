"use client";

import { Hardware, HardwareCategory, HARDWARE_CATEGORY_LABELS } from "@/types";
import { hardwareList } from "@/data/hardware";
import { cn } from "@/lib/utils";

const categoryOrder: HardwareCategory[] = [
  "nvidia_consumer",
  "nvidia_pro",
  "amd",
  "apple_silicon",
  "dedicated_ai",
  "multi_gpu",
];

interface Props {
  selectedId: string | null;
  onSelect: (hw: Hardware) => void;
  activeCategory: HardwareCategory;
  onCategoryChange: (cat: HardwareCategory) => void;
}

export default function HardwareSelector({
  selectedId,
  onSelect,
  activeCategory,
  onCategoryChange,
}: Props) {
  const filtered = hardwareList.filter((h) => h.category === activeCategory);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">
        ハードウェアを選択
      </h2>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {HARDWARE_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Hardware grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((hw) => (
          <button
            key={hw.id}
            onClick={() => onSelect(hw)}
            className={cn(
              "text-left p-4 rounded-xl border-2 transition-all",
              selectedId === hw.id
                ? "border-blue-600 bg-blue-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <div className="font-semibold text-gray-900 text-sm">
              {hw.name}
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span className="font-medium text-blue-600">{hw.vram}GB</span>
              <span>{hw.memoryBandwidth} GB/s</span>
              <span>{hw.memoryType}</span>
            </div>
            <div className="mt-1 text-xs text-gray-400">{hw.priceRange}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
