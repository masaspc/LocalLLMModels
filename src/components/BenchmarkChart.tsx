"use client";

import { Benchmarks } from "@/types";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

const benchmarkLabels: Record<string, string> = {
  mmluPro: "MMLU-Pro",
  humanEval: "HumanEval",
  mathScore: "MATH",
  aime: "AIME",
  liveCodeBench: "LiveCodeBench",
  arenaHard: "Arena Hard",
};

interface Props {
  benchmarks: Benchmarks;
  compareBenchmarks?: { name: string; benchmarks: Benchmarks }[];
}

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function BenchmarkChart({ benchmarks, compareBenchmarks }: Props) {
  const keys = Object.keys(benchmarkLabels).filter(
    (k) => {
      if ((benchmarks as Record<string, unknown>)[k] != null) return true;
      return compareBenchmarks?.some((c) => (c.benchmarks as Record<string, unknown>)[k] != null);
    }
  );

  if (keys.length < 3) return null;

  const data = keys.map((key) => {
    const entry: Record<string, unknown> = {
      subject: benchmarkLabels[key],
      value: ((benchmarks as Record<string, unknown>)[key] as number ?? 0) * 100,
    };
    compareBenchmarks?.forEach((c, i) => {
      entry[`compare${i}`] = ((c.benchmarks as Record<string, unknown>)[key] as number ?? 0) * 100;
    });
    return entry;
  });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="スコア"
            dataKey="value"
            stroke={COLORS[0]}
            fill={COLORS[0]}
            fillOpacity={0.2}
          />
          {compareBenchmarks?.map((c, i) => (
            <Radar
              key={c.name}
              name={c.name}
              dataKey={`compare${i}`}
              stroke={COLORS[(i + 1) % COLORS.length]}
              fill={COLORS[(i + 1) % COLORS.length]}
              fillOpacity={0.1}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
