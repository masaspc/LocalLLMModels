import Link from "next/link";
import { Terminal, Monitor, Server, Cpu, Zap, ExternalLink } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ローカルLLM 入門ガイド</h1>
      <p className="text-gray-500 mb-10">
        ローカルLLMのセットアップ方法をハードウェア別に解説します。
        初めての方はまず「共通の基礎知識」を読んでから、お使いの環境に合ったセクションに進んでください。
      </p>

      {/* Table of contents */}
      <nav className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">目次</h2>
        <ol className="space-y-2 text-sm text-blue-600">
          <li><a href="#basics" className="hover:underline">1. 共通の基礎知識</a></li>
          <li><a href="#ollama" className="hover:underline">2. Ollama で始める（最も簡単）</a></li>
          <li><a href="#dgx-spark" className="hover:underline">3. NVIDIA DGX Spark セットアップ【詳細解説】</a></li>
          <li><a href="#nvidia-gpu" className="hover:underline">4. NVIDIA GPU（Windows / Linux）</a></li>
          <li><a href="#apple-silicon" className="hover:underline">5. Apple Silicon Mac</a></li>
          <li><a href="#tips" className="hover:underline">6. 量子化とVRAMの基礎</a></li>
        </ol>
      </nav>

      {/* ====== 1. Basics ====== */}
      <section id="basics" className="mb-14">
        <SectionHeader icon={<Cpu className="w-6 h-6" />} title="1. 共通の基礎知識" />
        <div className="prose-section">
          <h3>ローカルLLMとは？</h3>
          <p>
            ローカルLLMとは、クラウドAPIを使わずに自分のPCやサーバー上で動かす大規模言語モデルのことです。
            データが外部に送信されないためプライバシーが守られ、API利用料もかかりません。
          </p>

          <h3>必要なもの</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">項目</th>
                <th className="pb-2 font-medium text-gray-500">説明</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">VRAM（GPU メモリ）</td>
                <td className="py-2 text-gray-600">モデルを格納する領域。最も重要な要素</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">メモリ帯域幅</td>
                <td className="py-2 text-gray-600">推論速度（トークン/秒）を左右する</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">推論エンジン</td>
                <td className="py-2 text-gray-600">Ollama, llama.cpp, vLLM, TensorRT-LLM など</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">モデルファイル</td>
                <td className="py-2 text-gray-600">GGUF（llama.cpp）やSafetensors（vLLM）形式</td>
              </tr>
            </tbody>
          </table>

          <h3>推論エンジンの選び方</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">エンジン</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">難易度</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">特徴</th>
                <th className="pb-2 font-medium text-gray-500">おすすめ用途</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Ollama</td>
                <td className="py-2 pr-4"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">簡単</span></td>
                <td className="py-2 pr-4 text-gray-600">1コマンドでモデルDL・実行。GUIあり</td>
                <td className="py-2 text-gray-600">初心者、個人利用</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">llama.cpp</td>
                <td className="py-2 pr-4"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">中級</span></td>
                <td className="py-2 pr-4 text-gray-600">GGUF量子化モデル。CPU+GPUハイブリッド</td>
                <td className="py-2 text-gray-600">メモリ制限環境、カスタマイズ</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">vLLM</td>
                <td className="py-2 pr-4"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">中級</span></td>
                <td className="py-2 pr-4 text-gray-600">高スループット。OpenAI互換API</td>
                <td className="py-2 text-gray-600">本番運用、API提供</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">TensorRT-LLM</td>
                <td className="py-2 pr-4"><span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">上級</span></td>
                <td className="py-2 pr-4 text-gray-600">NVIDIA最適化。最高の推論速度</td>
                <td className="py-2 text-gray-600">最大パフォーマンス追求</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">LM Studio</td>
                <td className="py-2 pr-4"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">簡単</span></td>
                <td className="py-2 pr-4 text-gray-600">GUIアプリ。モデル検索・DL・実行が一体</td>
                <td className="py-2 text-gray-600">初心者、デスクトップ利用</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== 2. Ollama ====== */}
      <section id="ollama" className="mb-14">
        <SectionHeader icon={<Terminal className="w-6 h-6" />} title="2. Ollama で始める（最も簡単）" />
        <div className="prose-section">
          <p>
            Ollama はローカルLLMを最も手軽に使えるツールです。
            1コマンドでモデルのダウンロードから実行までできます。
          </p>

          <h3>インストール</h3>
          <CodeBlock title="macOS / Linux">
            {`curl -fsSL https://ollama.com/install.sh | sh`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Windows の場合は <a href="https://ollama.com/download" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ollama.com/download</a> からインストーラーをダウンロードしてください。
          </p>

          <h3>モデルを実行</h3>
          <CodeBlock title="小型モデル（8GB VRAM以下）">
            {`# Qwen3 4B - 日本語が得意な小型モデル
ollama run qwen3:4b

# Gemma 3 4B - Googleの軽量モデル
ollama run gemma3:4b`}
          </CodeBlock>
          <CodeBlock title="中型モデル（16GB VRAM向け）">
            {`# Qwen3 8B - 日本語◎のバランスモデル
ollama run qwen3:8b

# DeepSeek R1 14B - 推論・数学に強い
ollama run deepseek-r1:14b`}
          </CodeBlock>
          <CodeBlock title="大型モデル（32GB+ VRAM向け）">
            {`# Qwen3 32B - コーディングと日本語に最強
ollama run qwen3:32b

# Llama 3.3 70B (Q4量子化) - 40GB+ VRAMが必要
ollama run llama3.3:70b`}
          </CodeBlock>

          <h3>Web UIを追加する（Open WebUI）</h3>
          <p>ChatGPTのようなインターフェースで使いたい場合は Open WebUI を追加します。</p>
          <CodeBlock title="Docker で Open WebUI を起動">
            {`docker run -d -p 3000:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:main`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2">
            ブラウザで <code className="bg-gray-100 px-1.5 py-0.5 rounded">http://localhost:3000</code> を開くとチャットUIが使えます。
          </p>
        </div>
      </section>

      {/* ====== 3. DGX Spark ====== */}
      <section id="dgx-spark" className="mb-14">
        <SectionHeader icon={<Server className="w-6 h-6" />} title="3. NVIDIA DGX Spark セットアップ【詳細解説】" />
        <div className="prose-section">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800 font-medium mb-2">DGX Spark の特徴</p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>GB10 Grace Blackwell Superchip（ARM CPU + Blackwell GPU 統合）</li>
              <li>128GB LPDDR5x 統合メモリ — モデルに全量使用可能</li>
              <li>DGX OS（Ubuntu 24.04 ベース）</li>
              <li>200Bパラメータクラスのモデルまで推論可能</li>
              <li>2台クラスタで 256GB、405Bクラスも対応</li>
            </ul>
          </div>

          <h3>3.1 初期セットアップ</h3>
          <p>DGX Sparkは出荷時にDGX OS（Ubuntu 24.04ベース）がインストール済みです。</p>
          <CodeBlock title="システム確認">
            {`# OS確認
cat /etc/os-release

# GPUの確認
nvidia-smi

# CUDAバージョン確認
nvcc --version

# メモリ確認（128GB統合メモリ）
free -h`}
          </CodeBlock>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 my-4">
            <p className="text-sm text-yellow-800">
              <strong>重要:</strong> DGX Sparkは ARM64（aarch64）アーキテクチャです。
              x86向けのインストール手順がそのまま使えない場合があります。
              以下ではDGX Spark専用の手順を記載しています。
            </p>
          </div>

          <h3>3.2 方法A: Ollama + Open WebUI（おすすめ、最も簡単）</h3>
          <p>
            NVIDIAの公式プレイブックに基づく方法です。
            Dockerコンテナ1つで Ollama と Web UI がセットアップできます。
          </p>
          <CodeBlock title="Ollama + Open WebUI をDocker で起動">
            {`# Dockerが入っていることを確認
docker --version

# Ollama + Open WebUI コンテナを起動
docker run -d \\
  --gpus all \\
  -p 3000:8080 \\
  -p 11434:11434 \\
  -v ollama:/root/.ollama \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:ollama`}
          </CodeBlock>
          <CodeBlock title="モデルをダウンロード・実行">
            {`# コンテナ内のOllamaでモデルをpull
docker exec open-webui ollama pull qwen3:32b

# 128GBメモリを活かして大型モデルも実行可能
docker exec open-webui ollama pull llama3.3:70b

# DGX Spark 2台クラスタなら
docker exec open-webui ollama pull llama3.3:70b-instruct-fp16`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2">
            ブラウザで <code className="bg-gray-100 px-1.5 py-0.5 rounded">http://&lt;DGX-SparkのIP&gt;:3000</code> を開くとチャットUIが使えます。
          </p>

          <h4 className="text-base font-bold text-gray-900 mt-6 mb-2">DGX Spark で実行可能なモデルの目安</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">モデル</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">量子化</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">必要メモリ</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">推定速度</th>
                <th className="pb-2 font-medium text-gray-500">推奨度</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Qwen3 8B</td>
                <td className="py-2 pr-4">FP16</td>
                <td className="py-2 pr-4">~18GB</td>
                <td className="py-2 pr-4">50+ t/s</td>
                <td className="py-2">快適</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Qwen3 32B</td>
                <td className="py-2 pr-4">Q8</td>
                <td className="py-2 pr-4">~36GB</td>
                <td className="py-2 pr-4">20-30 t/s</td>
                <td className="py-2">快適</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Llama 3.3 70B</td>
                <td className="py-2 pr-4">Q4</td>
                <td className="py-2 pr-4">~44GB</td>
                <td className="py-2 pr-4">10-15 t/s</td>
                <td className="py-2">快適</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Llama 3.3 70B</td>
                <td className="py-2 pr-4">FP16</td>
                <td className="py-2 pr-4">~148GB</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2 text-red-600">2台必要</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Nemotron 51B</td>
                <td className="py-2 pr-4">Q8</td>
                <td className="py-2 pr-4">~57GB</td>
                <td className="py-2 pr-4">8-12 t/s</td>
                <td className="py-2">快適</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">DeepSeek R1 70B</td>
                <td className="py-2 pr-4">Q4</td>
                <td className="py-2 pr-4">~44GB</td>
                <td className="py-2 pr-4">10-15 t/s</td>
                <td className="py-2">快適</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Qwen3 235B (MoE)</td>
                <td className="py-2 pr-4">Q4</td>
                <td className="py-2 pr-4">~140GB</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2 text-red-600">2台必要</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4 mb-6">
            <p className="text-sm text-gray-600">
              <strong>帯域幅について:</strong> DGX Sparkのメモリ帯域幅は273 GB/sで、RTX 5090（1,792 GB/s）などのGPUより低いため、
              同じモデルでもGPUに比べて推論速度は遅くなります。
              ただし128GBの大容量メモリにより、GPUでは載らない大型モデルを丸ごと実行できる点が最大の利点です。
            </p>
          </div>

          <h3>3.3 方法B: vLLM（本番向け・API提供に最適）</h3>
          <p>
            vLLM は高スループットの推論エンジンで、OpenAI互換のAPIを提供します。
            複数ユーザーからの同時リクエストに強く、本番運用に適しています。
          </p>

          <h4 className="text-base font-semibold text-gray-800 mt-4 mb-2">方法B-1: Docker で起動（推奨）</h4>
          <CodeBlock title="vLLM Docker コンテナを起動">
            {`# NVIDIA公式のvLLMコンテナを使用
docker run -d \\
  --gpus all \\
  --ipc=host \\
  -p 8000:8000 \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  --name vllm-server \\
  vllm/vllm-openai:latest \\
  --model Qwen/Qwen3-32B \\
  --max-model-len 8192 \\
  --enforce-eager`}
          </CodeBlock>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 my-4">
            <p className="text-sm text-yellow-800">
              <strong>--enforce-eager フラグについて:</strong> DGX SparkのBlackwellアーキテクチャ（sm_12.1）では、
              CUDAグラフのキャプチャに問題が発生する場合があります。<code className="bg-yellow-100 px-1 rounded">--enforce-eager</code>
              を付けることで安定動作します（速度は若干低下します）。
            </p>
          </div>

          <CodeBlock title="APIを使ってみる">
            {`# OpenAI互換APIとしてアクセス
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "Qwen/Qwen3-32B",
    "messages": [
      {"role": "user", "content": "日本の首都はどこですか？"}
    ],
    "max_tokens": 256
  }'`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2">
            OpenAI SDKからもそのまま接続できます（<code className="bg-gray-100 px-1.5 py-0.5 rounded">base_url=&quot;http://localhost:8000/v1&quot;</code>）。
          </p>

          <h4 className="text-base font-semibold text-gray-800 mt-6 mb-2">方法B-2: ソースからビルド（上級者向け）</h4>
          <p className="text-sm text-gray-600 mb-3">
            DGX SparkのARM64環境では、公式Dockerイメージが動作しない場合があります。
            その場合はソースからビルドします。
          </p>
          <CodeBlock title="vLLMをソースからビルド">
            {`# 依存パッケージ
sudo apt update && sudo apt install -y \\
  python3-pip python3-venv git cmake

# venvを作成
python3 -m venv ~/vllm-env
source ~/vllm-env/bin/activate

# PyTorch（ARM64 + CUDA対応版）
pip install torch --index-url https://download.pytorch.org/whl/cu126

# vLLMをソースからインストール
git clone https://github.com/vllm-project/vllm.git
cd vllm
pip install -e .

# 起動
vllm serve Qwen/Qwen3-32B \\
  --max-model-len 8192 \\
  --enforce-eager`}
          </CodeBlock>

          <h3>3.4 方法C: TensorRT-LLM（最高速度）</h3>
          <p>
            NVIDIA純正の推論最適化エンジンです。
            モデルをTensorRTエンジンに変換することで、最高速度の推論が可能になります。
          </p>
          <CodeBlock title="TensorRT-LLM Docker で起動">
            {`docker run -d \\
  --gpus all \\
  --ipc=host \\
  -p 8000:8000 \\
  -v ~/.cache:/root/.cache \\
  --name trt-llm \\
  nvcr.io/nvidia/tritonserver:latest-trtllm-python-py3 \\
  --model_repo /models`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2">
            詳細な手順は
            <a href="https://build.nvidia.com/spark/trt-llm" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              NVIDIA公式 TRT-LLMプレイブック
            </a>
            を参照してください。
          </p>

          <h3>3.5 2台クラスタ構成（256GB）</h3>
          <p>
            DGX Spark 2台を NVLink（200Gbps ConnectX-7）で接続すると、
            256GBのメモリプールとして大規模モデルを実行できます。
          </p>
          <CodeBlock title="2台クラスタでvLLMを起動">
            {`# ノード1（マスター）
vllm serve meta-llama/Llama-3.3-70B-Instruct \\
  --tensor-parallel-size 2 \\
  --enforce-eager \\
  --distributed-executor-backend ray

# 事前にRayクラスタの設定が必要
# ray start --head (マスター側)
# ray start --address=<マスターIP>:6379 (ワーカー側)`}
          </CodeBlock>

          <h3>3.6 参考リンク</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <ExtLink href="https://build.nvidia.com/spark" title="DGX Spark 公式プレイブック" desc="NVIDIA公式のセットアップガイド集" />
            <ExtLink href="https://build.nvidia.com/spark/open-webui" title="Ollama + Open WebUI" desc="公式: GUIチャット環境の構築" />
            <ExtLink href="https://build.nvidia.com/spark/vllm" title="vLLM セットアップ" desc="公式: 高スループット推論サーバー" />
            <ExtLink href="https://build.nvidia.com/spark/trt-llm" title="TensorRT-LLM" desc="公式: NVIDIA最適化推論" />
            <ExtLink href="https://github.com/NVIDIA/dgx-spark-playbooks" title="DGX Spark Playbooks" desc="GitHub: 全ワークロードの手順集" />
            <ExtLink href="https://learn.arm.com/learning-paths/laptops-and-desktops/dgx_spark_llamacpp/1a_gb10_setup/" title="llama.cpp on DGX Spark" desc="Arm公式: llama.cppのビルドと実行" />
          </div>
        </div>
      </section>

      {/* ====== 4. NVIDIA GPU ====== */}
      <section id="nvidia-gpu" className="mb-14">
        <SectionHeader icon={<Monitor className="w-6 h-6" />} title="4. NVIDIA GPU（Windows / Linux）" />
        <div className="prose-section">
          <h3>前提条件</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>NVIDIA GPU（RTX 3060以上推奨）</li>
            <li>最新のNVIDIAドライバー</li>
            <li>CUDA Toolkit（vLLM使用時）</li>
          </ul>

          <h3>Windows の場合</h3>
          <p className="text-sm text-gray-600 mb-3">
            Windows では Ollama または LM Studio が最も簡単です。
          </p>
          <CodeBlock title="Ollama（コマンドライン）">
            {`# 1. https://ollama.com/download からインストーラーをDL
# 2. インストール後、コマンドプロンプトで:
ollama run qwen3:8b`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            GUI で使いたい場合は <a href="https://lmstudio.ai" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LM Studio</a> がおすすめです。
            モデルの検索・ダウンロード・実行がすべてGUIで完結します。
          </p>

          <h3>Linux の場合</h3>
          <CodeBlock title="Ollama を使う場合">
            {`curl -fsSL https://ollama.com/install.sh | sh
ollama run qwen3:32b`}
          </CodeBlock>
          <CodeBlock title="vLLM を使う場合">
            {`pip install vllm
vllm serve Qwen/Qwen3-32B --max-model-len 8192`}
          </CodeBlock>
        </div>
      </section>

      {/* ====== 5. Apple Silicon ====== */}
      <section id="apple-silicon" className="mb-14">
        <SectionHeader icon={<Cpu className="w-6 h-6" />} title="5. Apple Silicon Mac" />
        <div className="prose-section">
          <p>
            Apple SiliconのMacは統合メモリにより、VRAM容量 = 搭載RAM となります。
            M3 Max 96GBなら96GB全量をモデルに使用可能です。
          </p>

          <h3>Ollama（推奨）</h3>
          <CodeBlock title="インストールと実行">
            {`# Homebrew でインストール
brew install ollama

# または公式インストーラー
curl -fsSL https://ollama.com/install.sh | sh

# 起動
ollama serve &

# モデルを実行
ollama run qwen3:32b`}
          </CodeBlock>

          <h3>LM Studio（GUIで使いたい場合）</h3>
          <p className="text-sm text-gray-600 mb-3">
            <a href="https://lmstudio.ai" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">LM Studio</a>
            をダウンロードしてインストールするだけです。
            Apple Silicon に最適化されたMLXバックエンドが使えます。
          </p>

          <h3>注意点</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>メモリ帯域幅がGPUより低い（150〜546 GB/s）ため、推論速度はやや遅め</li>
              <li>vLLM は macOS 非対応。Ollama, llama.cpp, MLX を使用</li>
              <li>スワップが発生すると極端に遅くなるため、モデルサイズに余裕を持たせる</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ====== 6. Quantization basics ====== */}
      <section id="tips" className="mb-14">
        <SectionHeader icon={<Zap className="w-6 h-6" />} title="6. 量子化とVRAMの基礎" />
        <div className="prose-section">
          <h3>量子化とは？</h3>
          <p>
            モデルの各パラメータの精度（ビット数）を下げてサイズを縮小する技術です。
            精度を落とすほどVRAM使用量は減りますが、出力品質も低下します。
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">量子化</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">ビット数</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">サイズ目安</th>
                <th className="pb-2 font-medium text-gray-500">品質</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">FP16</td>
                <td className="py-2 pr-4">16bit</td>
                <td className="py-2 pr-4">パラメータ数 x 2 GB</td>
                <td className="py-2">最高（オリジナル品質）</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Q8</td>
                <td className="py-2 pr-4">8bit</td>
                <td className="py-2 pr-4">パラメータ数 x 1 GB</td>
                <td className="py-2">ほぼFP16と同等</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Q4_K_M</td>
                <td className="py-2 pr-4">4bit</td>
                <td className="py-2 pr-4">パラメータ数 x 0.5 GB</td>
                <td className="py-2">実用的（おすすめ）</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">Q3_K_M</td>
                <td className="py-2 pr-4">3bit</td>
                <td className="py-2 pr-4">パラメータ数 x 0.375 GB</td>
                <td className="py-2">品質低下あり</td>
              </tr>
            </tbody>
          </table>

          <h3>VRAM計算の例</h3>
          <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 font-mono text-sm mb-4">
            <div className="text-gray-400"># 例: Qwen3 32B を Q4 量子化で動かす場合</div>
            <div className="mt-1">モデルウェイト = 32B x 0.5 = <span className="text-white font-bold">16GB</span></div>
            <div>KVキャッシュ(8K) = 32B x 0.1 = <span className="text-white font-bold">3.2GB</span></div>
            <div>システム = <span className="text-white font-bold">~2GB</span></div>
            <div className="mt-1 border-t border-gray-700 pt-1">合計 = <span className="text-white font-bold">約21.2GB</span> → RTX 5090 (32GB) で快適動作</div>
          </div>

          <p className="text-sm text-gray-500">
            より詳しいマッチングは <Link href="/" className="text-blue-600 hover:underline">トップページ</Link> でハードウェアを選択して確認できます。
          </p>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
      <span className="text-blue-600">{icon}</span>
      {title}
    </h2>
  );
}

function CodeBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-medium text-gray-500 mb-1">{title}</div>
      <pre className="bg-gray-900 text-green-400 rounded-lg px-4 py-3 text-sm overflow-x-auto whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

function ExtLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-1.5 font-medium text-blue-600 text-sm">
        {title} <ExternalLink className="w-3.5 h-3.5" />
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
    </a>
  );
}
