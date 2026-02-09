# LocalLLM Finder

あなたのハードウェアに最適なローカルLLMモデルを見つけるためのWebサイトです。

GPU・Apple Silicon・DGX Sparkなどのハードウェアを選択するだけで、VRAMベースのマッチングにより実行可能なモデル一覧を即座に表示します。

## 主な機能

- **ハードウェア選択** — 30種以上のプリセット（NVIDIA / AMD / Apple Silicon / DGX Spark / マルチGPU）
- **モデルデータベース** — 32種以上のLLMモデル（Llama, Qwen, DeepSeek, Gemma, Mistral など）
- **VRAMマッチング** — 3段階の動作判定（快適動作 / 動作可能 / 動作困難）
- **フィルタ・ソート** — 用途、モデルサイズ、量子化、ライセンス、日本語対応で絞り込み
- **モデル詳細** — VRAM必要量、ベンチマーク、レーダーチャート、セットアップ手順
- **比較機能** — 最大4モデルの横並び比較

## 開発を始める

開発サーバーを起動します：

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、サイトが表示されます。

## コマンド一覧

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルド（静的サイト生成） |
| `npm run start` | ビルド済みサイトを起動 |
| `npm run lint` | ESLintでコードチェック |

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router, 静的エクスポート)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **チャート**: Recharts
- **アイコン**: Lucide React

## デプロイ

静的サイトとして出力されるため、以下のサービスで無料ホスティングできます：

- [Vercel](https://vercel.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

```bash
npm run build
# out/ ディレクトリに静的ファイルが生成されます
```

## データの更新

新しいモデルやハードウェアを追加するには、以下のファイルを編集してください：

- **モデル追加**: `src/data/models.ts`
- **ハードウェア追加**: `src/data/hardware.ts`

型定義は `src/types/index.ts` にあります。
