import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalLLM Finder — ハードウェアに最適なローカルLLMを見つけよう",
  description:
    "GPU・Apple Silicon・DGX Sparkなどのハードウェアを選ぶだけで、実行可能なローカルLLMモデルを即座にマッチング。VRAM計算・ベンチマーク比較・セットアップ手順まで。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
