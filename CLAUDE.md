# CLAUDE.md

## Project Overview

**LocalLLM Finder** — ユーザーのハードウェアに最適なローカルLLMモデルを見つけるための静的Webサイト。
GPU・Apple Silicon・DGX Sparkなどを選択すると、VRAMベースのマッチングで実行可能なモデル一覧を表示する。

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deploy target**: Static site (Vercel, Cloudflare Pages, GitHub Pages)

## Repository Structure

```
src/
  app/              # Next.js App Router pages
    page.tsx        # Top page (hardware selection + matching)
    models/         # Model list + detail pages
    hardware/       # Hardware list + detail pages
    compare/        # Model comparison page
  components/       # React components
    Header.tsx      # Navigation header
    Footer.tsx      # Site footer
    HardwareSelector.tsx  # Hardware preset selector
    ModelCard.tsx   # Model result card
    FilterPanel.tsx # Filter/sort sidebar
    BenchmarkChart.tsx # Radar chart for benchmarks
  data/
    models.ts       # LLM model database (32+ models)
    hardware.ts     # Hardware presets (30+ devices)
  lib/
    matching.ts     # VRAM matching engine
    utils.ts        # Utility functions
  types/
    index.ts        # TypeScript type definitions
```

## Common Commands

- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Key Conventions

- All UI text is in Japanese
- Data is stored in TypeScript files (not JSON) for type safety
- Static export mode (`output: "export"` in next.config.ts)
- No server-side runtime required — all matching runs client-side
- Model/hardware data updates: edit `src/data/models.ts` or `src/data/hardware.ts`

## Adding New Models

Add entries to `src/data/models.ts` following the `LLMModel` interface:
- Required VRAM values for each quantization level (fp16, q8, q4)
- Recommended VRAM with KV cache for 8K and 32K context
- Benchmark scores, ratings, and quick start commands

## Adding New Hardware

Add entries to `src/data/hardware.ts` following the `Hardware` interface:
- VRAM capacity, memory bandwidth, memory type
- Price range and category classification
