import Link from "next/link";
import { Database, BookOpen, Shield, Server, ExternalLink } from "lucide-react";

export default function AdvancedGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/guide" className="hover:text-gray-600">入門ガイド</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">応用ガイド</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">応用ガイド — RAG・MCP・データベース連携</h1>
      <p className="text-gray-500 mb-10">
        ローカルLLMを社内データと連携させる実践的な手順を解説します。
        RAGによるドキュメント検索、MCPによるデータベース接続（Oracle / SQL Server）の具体的な構築手順を紹介します。
      </p>

      {/* TOC */}
      <nav className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">目次</h2>
        <ol className="space-y-2 text-sm text-blue-600">
          <li><a href="#rag-overview" className="hover:underline">1. RAG（検索拡張生成）とは</a></li>
          <li><a href="#rag-setup" className="hover:underline">2. RAGシステムの構築手順</a></li>
          <li><a href="#mcp-overview" className="hover:underline">3. MCP（Model Context Protocol）とは</a></li>
          <li><a href="#mcp-oracle" className="hover:underline">4. MCP × Oracle Database 連携</a></li>
          <li><a href="#mcp-sqlserver" className="hover:underline">5. MCP × SQL Server 連携</a></li>
          <li><a href="#security" className="hover:underline">6. セキュリティのベストプラクティス</a></li>
          <li><a href="#architecture" className="hover:underline">7. 社内AI基盤の構成例</a></li>
        </ol>
      </nav>

      {/* ====== 1. RAG Overview ====== */}
      <section id="rag-overview" className="mb-14">
        <SectionHeader icon={<BookOpen className="w-6 h-6" />} title="1. RAG（検索拡張生成）とは" />
        <div className="prose-section">
          <p>
            RAG（Retrieval-Augmented Generation）は、LLMに外部の知識を与えて回答精度を向上させる技術です。
            LLM単体では学習データにない情報（社内ドキュメント、最新データなど）に回答できませんが、
            RAGを使えば「検索して読んでから回答する」ことが可能になります。
          </p>

          <h3>RAGの処理フロー</h3>
          <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-4 font-mono text-sm mb-4">
            <div className="text-gray-400"># === インデックス作成（事前準備）===</div>
            <div>ドキュメント(PDF,Word,HTML等)</div>
            <div>  → テキスト抽出</div>
            <div>  → チャンク分割（500〜1000文字ごと）</div>
            <div>  → 埋め込みモデルでベクトル化</div>
            <div>  → ベクトルDBに格納（ChromaDB等）</div>
            <div className="mt-3 text-gray-400"># === 質問応答（実行時）===</div>
            <div>ユーザーの質問</div>
            <div>  → 質問をベクトル化</div>
            <div>  → ベクトルDBで類似検索（上位5件取得）</div>
            <div>  → 取得したテキスト + 質問をLLMに入力</div>
            <div>  → LLMが文脈に基づいて回答を生成</div>
          </div>

          <h3>必要なコンポーネント</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">コンポーネント</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">役割</th>
                <th className="pb-2 font-medium text-gray-500">推奨ツール</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">LLM（推論エンジン）</td>
                <td className="py-2 pr-4 text-gray-600">回答を生成</td>
                <td className="py-2 text-gray-600">Ollama + Qwen3/Llama等</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">埋め込みモデル</td>
                <td className="py-2 pr-4 text-gray-600">テキストをベクトルに変換</td>
                <td className="py-2 text-gray-600">nomic-embed-text, mxbai-embed-large</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">ベクトルDB</td>
                <td className="py-2 pr-4 text-gray-600">ベクトルを格納・類似検索</td>
                <td className="py-2 text-gray-600">ChromaDB, Elasticsearch</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">オーケストレーション</td>
                <td className="py-2 pr-4 text-gray-600">パイプライン全体の制御</td>
                <td className="py-2 text-gray-600">LangChain, LlamaIndex</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== 2. RAG Setup ====== */}
      <section id="rag-setup" className="mb-14">
        <SectionHeader icon={<BookOpen className="w-6 h-6" />} title="2. RAGシステムの構築手順" />
        <div className="prose-section">
          <p>
            完全ローカルで動作するRAGシステムを、Ollama + ChromaDB + LangChain で構築します。
            データが外部に送信されないため、社内ドキュメントにも安心して使えます。
          </p>

          <h3>Step 1: 環境準備</h3>
          <CodeBlock title="Ollama でモデルと埋め込みモデルを取得">
            {`# LLM（回答生成用）
ollama pull qwen3:8b

# 埋め込みモデル（ベクトル化用）
ollama pull nomic-embed-text`}
          </CodeBlock>
          <CodeBlock title="Python パッケージのインストール">
            {`pip install langchain langchain-community langchain-ollama
pip install chromadb
pip install unstructured   # PDF等のドキュメント読み込み
pip install pypdf          # PDF読み込み`}
          </CodeBlock>

          <h3>Step 2: ドキュメントの読み込みとベクトル化</h3>
          <CodeBlock title="rag_index.py — ドキュメントをベクトルDBに格納">
            {`from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

# 1. ドキュメントを読み込み（data/ フォルダ内のPDF）
loader = DirectoryLoader("./data", glob="**/*.pdf", loader_cls=PyPDFLoader)
documents = loader.load()
print(f"{len(documents)} ページを読み込みました")

# 2. テキストをチャンクに分割
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # 1チャンクあたりの文字数
    chunk_overlap=50,     # チャンク間の重複文字数
)
chunks = splitter.split_documents(documents)
print(f"{len(chunks)} チャンクに分割しました")

# 3. 埋め込みモデルでベクトル化 → ChromaDB に格納
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",  # ディスクに永続化
)
print("ベクトルDBへの格納が完了しました")`}
          </CodeBlock>

          <h3>Step 3: 質問応答システムの構築</h3>
          <CodeBlock title="rag_chat.py — RAGで質問に回答">
            {`from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# 1. ベクトルDBを読み込み
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
)

# 2. LLMを設定
llm = OllamaLLM(model="qwen3:8b", temperature=0)

# 3. プロンプトテンプレート（日本語用）
prompt = PromptTemplate(
    template="""以下のコンテキストに基づいて質問に回答してください。
コンテキストに情報がない場合は「資料に記載がありません」と回答してください。

コンテキスト:
{context}

質問: {question}

回答:""",
    input_variables=["context", "question"],
)

# 4. RAGチェーンを構築
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    chain_type_kwargs={"prompt": prompt},
)

# 5. 対話ループ
print("RAGチャットボットが起動しました（'quit'で終了）")
while True:
    question = input("\\n質問: ")
    if question.lower() == "quit":
        break
    result = qa_chain.invoke({"query": question})
    print(f"\\n回答: {result['result']}")`}
          </CodeBlock>

          <h3>Step 4: 実行</h3>
          <CodeBlock title="実行手順">
            {`# data/ フォルダにPDFを配置してから

# 1. インデックス作成（初回のみ）
python rag_index.py

# 2. チャットボット起動
python rag_chat.py

# 質問例:
# > 質問: 就業規則の有給休暇の付与日数は？
# > 回答: 就業規則第XX条によると、勤続6ヶ月で10日...`}
          </CodeBlock>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-4">
            <p className="text-sm text-blue-800 font-medium mb-2">Web UIを追加する場合</p>
            <p className="text-sm text-blue-700">
              上記のコードに <code className="bg-blue-100 px-1 rounded">streamlit</code> や <code className="bg-blue-100 px-1 rounded">gradio</code> を組み合わせることで、
              ブラウザから使えるチャットUIを追加できます。
              また、Open WebUIにはRAG機能が内蔵されており、PDFをアップロードするだけで同様のことが可能です。
            </p>
          </div>

          <h3>参考リンク</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <ExtLink href="https://www.gpu-mart.com/blog/how-to-build-local-rag-app-with-langchain-ollama-python-and-chroma" title="RAG構築チュートリアル" desc="LangChain + Ollama + ChromaDB の詳細手順" />
            <ExtLink href="https://developers.llamaindex.ai/python/examples/low_level/oss_ingestion_retrieval/" title="LlamaIndex RAG構築" desc="公式: オープンソースのみでRAGを構築" />
          </div>
        </div>
      </section>

      {/* ====== 3. MCP Overview ====== */}
      <section id="mcp-overview" className="mb-14">
        <SectionHeader icon={<Database className="w-6 h-6" />} title="3. MCP（Model Context Protocol）とは" />
        <div className="prose-section">
          <p>
            MCP（Model Context Protocol）は、LLMアプリケーションと外部データソース・ツールを標準的に接続するためのオープンプロトコルです。
            Anthropic社が策定し、「AIアプリケーションのUSB-C」とも呼ばれています。
          </p>

          <h3>MCPの仕組み</h3>
          <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-4 font-mono text-sm mb-4">
            <div className="text-gray-400"># MCP のアーキテクチャ</div>
            <div className="mt-1"></div>
            <div>┌─────────────┐     MCP Protocol     ┌─────────────────┐</div>
            <div>│  MCP Client │ ◄──────────────────► │   MCP Server    │</div>
            <div>│ (Claude等)  │    JSON-RPC 2.0      │ (DB接続・ツール) │</div>
            <div>└─────────────┘                       └────────┬────────┘</div>
            <div>                                               │</div>
            <div>                                      ┌────────▼────────┐</div>
            <div>                                      │  データソース    │</div>
            <div>                                      │ Oracle/SQL Server│</div>
            <div>                                      │ ファイル/API等   │</div>
            <div>                                      └─────────────────┘</div>
          </div>

          <h3>RAGとMCPの違い</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">項目</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">RAG</th>
                <th className="pb-2 font-medium text-gray-500">MCP</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">アプローチ</td>
                <td className="py-2 pr-4 text-gray-600">事前にベクトル化して検索</td>
                <td className="py-2 text-gray-600">リアルタイムでDBに接続</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">データの鮮度</td>
                <td className="py-2 pr-4 text-gray-600">インデックス更新タイミング依存</td>
                <td className="py-2 text-gray-600">常に最新</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">得意な用途</td>
                <td className="py-2 pr-4 text-gray-600">ドキュメント検索・ナレッジベース</td>
                <td className="py-2 text-gray-600">DB操作・構造化データ検索</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">セットアップ</td>
                <td className="py-2 pr-4 text-gray-600">ベクトルDB + 埋め込みモデル必要</td>
                <td className="py-2 text-gray-600">MCPサーバーの設定のみ</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium">組み合わせ</td>
                <td className="py-2 pr-4 text-gray-600" colSpan={2}>両方を組み合わせることで最強の社内AI基盤に</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ====== 4. MCP × Oracle ====== */}
      <section id="mcp-oracle" className="mb-14">
        <SectionHeader icon={<Database className="w-6 h-6" />} title="4. MCP × Oracle Database 連携" />
        <div className="prose-section">
          <p>
            Oracle Database への MCP 接続には複数の方法があります。
            ここでは公式の SQLcl 方式と、汎用的な MCP-Alchemy 方式を紹介します。
          </p>

          <h3>方法A: Oracle SQLcl MCP Server（公式推奨）</h3>
          <p className="text-sm text-gray-600 mb-3">
            Oracle 公式ツール SQLcl が MCP サーバーとして動作します。
            Oracle Database 19c〜26ai に対応し、オンプレミス・クラウド問わず接続可能です。
          </p>

          <CodeBlock title="Step 1: SQLcl のインストール">
            {`# Oracle SQLcl をダウンロード（Java 17+が必要）
# https://www.oracle.com/database/sqldeveloper/technologies/sqlcl/

# Linux/Mac
unzip sqlcl-latest.zip
export PATH=$PATH:$(pwd)/sqlcl/bin

# 接続テスト
sql username/password@hostname:1521/service_name`}
          </CodeBlock>

          <CodeBlock title="Step 2: MCP設定ファイルに追加（claude_desktop_config.json）">
            {`{
  "mcpServers": {
    "oracle-db": {
      "command": "sql",
      "args": [
        "-mcp"
      ],
      "env": {
        "TNS_ADMIN": "/path/to/wallet"
      }
    }
  }
}`}
          </CodeBlock>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-4">
            <p className="text-sm text-blue-800">
              <strong>設定ファイルの場所:</strong><br />
              Windows: <code className="bg-blue-100 px-1 rounded">%APPDATA%\Claude\claude_desktop_config.json</code><br />
              Mac: <code className="bg-blue-100 px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </p>
          </div>

          <CodeBlock title="Step 3: 利用例（Claudeデスクトップから）">
            {`# Claude Desktop を再起動すると、Oracleのツールが利用可能に
# 以下のような質問が可能:

「売上テーブルの直近1ヶ月の売上合計を教えて」
→ Claude が SQLcl 経由で SELECT文を生成・実行し、結果を回答

「従業員テーブルの構造を教えて」
→ Claude が DESCRIBE文を実行してテーブル定義を表示

「パフォーマンスが悪いクエリを見つけて改善案を提示して」
→ Claude が V$SQL等のビューを参照してチューニング提案`}
          </CodeBlock>

          <h3>方法B: MCP-Alchemy（汎用、Python製）</h3>
          <p className="text-sm text-gray-600 mb-3">
            SQLAlchemy ベースの MCP サーバーで、Oracle を含む複数DBに対応します。
          </p>

          <CodeBlock title="MCP-Alchemy のセットアップ">
            {`# インストール
pip install mcp-alchemy

# Oracle用ドライバーも必要
pip install oracledb`}
          </CodeBlock>

          <CodeBlock title="claude_desktop_config.json に追加">
            {`{
  "mcpServers": {
    "oracle-alchemy": {
      "command": "uvx",
      "args": ["mcp-alchemy"],
      "env": {
        "DB_URL": "oracle+oracledb://user:pass@hostname:1521/?service_name=ORCL"
      }
    }
  }
}`}
          </CodeBlock>

          <h3>参考リンク</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <ExtLink href="https://blogs.oracle.com/database/introducing-mcp-server-for-oracle-database" title="Oracle公式: MCP Server紹介" desc="SQLclベースのMCPサーバーの概要" />
            <ExtLink href="https://www.thatjeffsmith.com/archive/2025/07/getting-started-with-our-mcp-server-for-oracle-database/" title="MCP Server 導入ガイド" desc="SQLcl MCPの詳細なセットアップ手順" />
            <ExtLink href="https://github.com/runekaagaard/mcp-alchemy" title="MCP-Alchemy (GitHub)" desc="SQLAlchemyベースの汎用MCPサーバー" />
            <ExtLink href="https://blogs.oracle.com/database/how-can-developers-and-dbas-benefit-from-mcp-server-for-oracle-database" title="Oracle MCP活用例" desc="開発者・DBA向けMCPの活用シナリオ" />
          </div>
        </div>
      </section>

      {/* ====== 5. MCP × SQL Server ====== */}
      <section id="mcp-sqlserver" className="mb-14">
        <SectionHeader icon={<Database className="w-6 h-6" />} title="5. MCP × SQL Server 連携" />
        <div className="prose-section">
          <p>
            SQL Server への MCP 接続にはコミュニティ製の優れたツールが複数あります。
            用途に応じて選択してください。
          </p>

          <h3>方法A: mssql_mcp_server（Python / 最も簡単）</h3>
          <CodeBlock title="claude_desktop_config.json">
            {`{
  "mcpServers": {
    "mssql": {
      "command": "uvx",
      "args": ["microsoft_sql_server_mcp"],
      "env": {
        "MSSQL_SERVER": "localhost",
        "MSSQL_DATABASE": "your_database",
        "MSSQL_USER": "your_username",
        "MSSQL_PASSWORD": "your_password"
      }
    }
  }
}`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Claude Desktop を再起動すれば、SQL Server へのクエリが可能になります。
          </p>

          <h3>方法B: MCPServerForMSSQL（pymssql、ODBCドライバー不要）</h3>
          <CodeBlock title="セットアップ手順">
            {`# リポジトリをクローン
git clone https://github.com/shakunvohradeltek/MCPServerForMSSQL.git
cd MCPServerForMSSQL

# 依存関係をインストール
pip install -r requirements.txt

# 設定ファイルを編集
cp .env.example .env
# .env 内の接続情報を記入:
#   MSSQL_SERVER=your_server
#   MSSQL_DATABASE=your_database
#   MSSQL_USER=your_user
#   MSSQL_PASSWORD=your_password`}
          </CodeBlock>

          <CodeBlock title="claude_desktop_config.json に追加">
            {`{
  "mcpServers": {
    "mssql-pymssql": {
      "command": "python",
      "args": ["/path/to/MCPServerForMSSQL/server.py"],
      "env": {
        "MSSQL_SERVER": "your_server",
        "MSSQL_DATABASE": "your_database",
        "MSSQL_USER": "your_user",
        "MSSQL_PASSWORD": "your_password"
      }
    }
  }
}`}
          </CodeBlock>

          <h3>方法C: MCP-Alchemy（Oracle と同じツールで統一管理）</h3>
          <p className="text-sm text-gray-600 mb-3">
            Oracle と SQL Server の両方を1つの MCP サーバーで管理したい場合に最適です。
          </p>
          <CodeBlock title="SQL Server 用の設定">
            {`{
  "mcpServers": {
    "sqlserver-alchemy": {
      "command": "uvx",
      "args": ["mcp-alchemy"],
      "env": {
        "DB_URL": "mssql+pymssql://user:pass@hostname:1433/database_name"
      }
    }
  }
}`}
          </CodeBlock>

          <h3>方法D: Node.js 版（読み取り専用、最もセキュア）</h3>
          <CodeBlock title="dperussina/mssql-mcp-server">
            {`# インストール
git clone https://github.com/dperussina/mssql-mcp-server.git
cd mssql-mcp-server
npm install

# .env を設定
DB_SERVER=your_server
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
DB_PORT=1433`}
          </CodeBlock>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            デフォルトで全クエリが<strong>読み取り専用</strong>のため、誤ったDELETE/UPDATEの実行を防げます。
          </p>

          <h3>利用例（SQL Server 接続後）</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 my-4 space-y-3">
            <div>
              <div className="text-sm font-medium text-gray-700">テーブル一覧を確認</div>
              <div className="text-sm text-gray-500 italic">「データベース内のテーブル一覧を見せて」</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">データ分析</div>
              <div className="text-sm text-gray-500 italic">「売上テーブルから月別売上推移をまとめて」</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">スキーマ確認</div>
              <div className="text-sm text-gray-500 italic">「顧客テーブルのカラム定義と型を教えて」</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">クエリ最適化</div>
              <div className="text-sm text-gray-500 italic">「この遅いクエリの実行計画を分析して改善案を出して」</div>
            </div>
          </div>

          <h3>参考リンク</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <ExtLink href="https://github.com/RichardHan/mssql_mcp_server" title="mssql_mcp_server" desc="Python/uv ベースの軽量MCPサーバー" />
            <ExtLink href="https://github.com/shakunvohradeltek/MCPServerForMSSQL" title="MCPServerForMSSQL" desc="pymssql版（ODBC不要）" />
            <ExtLink href="https://github.com/dperussina/mssql-mcp-server" title="Node.js版 MCP Server" desc="読み取り専用のセキュアなサーバー" />
            <ExtLink href="https://github.com/runekaagaard/mcp-alchemy" title="MCP-Alchemy" desc="SQLAlchemy対応（Oracle/SQL Server/PostgreSQL等）" />
          </div>
        </div>
      </section>

      {/* ====== 6. Security ====== */}
      <section id="security" className="mb-14">
        <SectionHeader icon={<Shield className="w-6 h-6" />} title="6. セキュリティのベストプラクティス" />
        <div className="prose-section">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-800 font-medium mb-2">重要: LLMにデータベースを接続する際の注意</p>
            <p className="text-sm text-red-700">
              LLMは自然言語からSQLを生成するため、意図しないクエリが実行されるリスクがあります。
              以下のベストプラクティスを必ず適用してください。
            </p>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">対策</th>
                <th className="pb-2 font-medium text-gray-500">詳細</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">最小権限の原則</td>
                <td className="py-3 text-gray-600">接続ユーザーにはSELECT権限のみ付与。必要なテーブルのみアクセス許可</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">読み取り専用モード</td>
                <td className="py-3 text-gray-600">MCPサーバーの設定でDML（INSERT/UPDATE/DELETE）を禁止</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">データマスキング</td>
                <td className="py-3 text-gray-600">個人情報カラム（氏名、メール等）にはRedactionやビューでマスク</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">検証環境で先にテスト</td>
                <td className="py-3 text-gray-600">本番接続前にサニタイズ済みのテストDBで動作確認</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">自動承認を無効化</td>
                <td className="py-3 text-gray-600">MCP Clientの「auto-approve」は絶対にオフ。毎回クエリを確認</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">行数制限</td>
                <td className="py-3 text-gray-600">SELECT結果の最大行数を制限（例: 1000行）して大量データ取得を防止</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">監査ログ</td>
                <td className="py-3 text-gray-600">実行されたクエリのログを保存。Oracle Audit / SQL Server監査機能を活用</td>
              </tr>
            </tbody>
          </table>

          <CodeBlock title="Oracle: 読み取り専用ユーザーの作成例">
            {`-- MCP専用の読み取り専用ユーザーを作成
CREATE USER mcp_readonly IDENTIFIED BY "secure_password";
GRANT CREATE SESSION TO mcp_readonly;

-- 必要なテーブルのみSELECT権限を付与
GRANT SELECT ON sales.orders TO mcp_readonly;
GRANT SELECT ON sales.customers TO mcp_readonly;
-- ※ 全テーブルへのアクセスは付与しない`}
          </CodeBlock>

          <CodeBlock title="SQL Server: 読み取り専用ユーザーの作成例">
            {`-- MCP専用ログインとユーザーを作成
CREATE LOGIN mcp_readonly WITH PASSWORD = 'secure_password';
USE your_database;
CREATE USER mcp_readonly FOR LOGIN mcp_readonly;

-- db_datareader ロールで読み取り専用に
ALTER ROLE db_datareader ADD MEMBER mcp_readonly;
-- ※ db_datawriter は付与しない`}
          </CodeBlock>
        </div>
      </section>

      {/* ====== 7. Architecture ====== */}
      <section id="architecture" className="mb-14">
        <SectionHeader icon={<Server className="w-6 h-6" />} title="7. 社内AI基盤の構成例" />
        <div className="prose-section">
          <p>RAGとMCPを組み合わせた社内AI基盤の構成例を紹介します。</p>

          <h3>構成例: 社内ナレッジ + データベース連携</h3>
          <div className="bg-gray-900 text-green-400 rounded-lg px-4 py-4 font-mono text-xs sm:text-sm mb-4 overflow-x-auto">
            <div>┌──────────────────────────────────────────────────┐</div>
            <div>│              ユーザー（ブラウザ）                  │</div>
            <div>│           Open WebUI / カスタムUI                 │</div>
            <div>└──────────────┬───────────────────────────────────┘</div>
            <div>               │</div>
            <div>┌──────────────▼───────────────────────────────────┐</div>
            <div>│         ローカルLLM（Ollama / vLLM）              │</div>
            <div>│         Qwen3 32B / Llama 3.3 70B 等             │</div>
            <div>└──────┬──────────────────────────────┬────────────┘</div>
            <div>       │                              │</div>
            <div>┌──────▼──────┐              ┌────────▼───────────┐</div>
            <div>│  RAG パイプ  │              │    MCP Server      │</div>
            <div>│  ライン     │              │                    │</div>
            <div>│ ┌─────────┐ │              │  ┌──────────────┐  │</div>
            <div>│ │ChromaDB │ │              │  │ Oracle DB    │  │</div>
            <div>│ │(ベクトル)│ │              │  │ SQL Server   │  │</div>
            <div>│ └─────────┘ │              │  │ PostgreSQL   │  │</div>
            <div>│      ▲      │              │  └──────────────┘  │</div>
            <div>│ ┌────┴────┐ │              └────────────────────┘</div>
            <div>│ │社内文書  │ │</div>
            <div>│ │PDF/Word │ │</div>
            <div>│ │Wiki/FAQ │ │</div>
            <div>│ └─────────┘ │</div>
            <div>└─────────────┘</div>
          </div>

          <h3>用途別おすすめ構成</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-4 font-medium text-gray-500">用途</th>
                <th className="pb-2 pr-4 font-medium text-gray-500">技術構成</th>
                <th className="pb-2 font-medium text-gray-500">ハードウェア目安</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">社内FAQ チャットボット</td>
                <td className="py-3 pr-4 text-gray-600">Ollama + Open WebUI + RAG（PDF読込）</td>
                <td className="py-3 text-gray-600">16GB VRAM〜</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">データ分析アシスタント</td>
                <td className="py-3 pr-4 text-gray-600">Ollama + MCP + SQL Server/Oracle</td>
                <td className="py-3 text-gray-600">24GB VRAM〜</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">全社AI基盤</td>
                <td className="py-3 pr-4 text-gray-600">vLLM + RAG + MCP + 複数DB</td>
                <td className="py-3 text-gray-600">DGX Spark / 64GB+</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 font-medium">コーディングアシスタント</td>
                <td className="py-3 pr-4 text-gray-600">Ollama + Continue(VSCode拡張)</td>
                <td className="py-3 text-gray-600">16GB VRAM〜</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-green-800 font-medium mb-2">まずは小さく始める</p>
            <p className="text-sm text-green-700">
              いきなり全社基盤を構築する必要はありません。
              まず Ollama + Open WebUI で社内チャットボットを作り、
              効果を確認してから RAG や MCP を段階的に追加していくのがおすすめです。
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            ハードウェア選定は <Link href="/" className="text-blue-600 hover:underline">トップページ</Link> のマッチング機能をご活用ください。
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
