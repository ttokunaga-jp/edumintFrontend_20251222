# docs/F_ARCHITECTURE — Architecture Indexes

目的: このフォルダはフロントエンドのアーキテクチャ索引ファイル（`F*_ARCHITECTURE_INDEX_*.md`）を集約します。これらはCodingAgentと開発者が目的のファイル／ディレクトリへ素早く到達するための案内です。

運用ルール（簡潔）
- 新しいディレクトリをインデックス化するときは、`F1..` の命名規則に従い `F*_ARCHITECTURE_INDEX_<path>.md` を追加してください。
- 各 Index は必ず YAML frontmatter を持つ（必須: `name`, `path`, `type`, `description`, `last_updated`）。
- 単一ディレクトリのファイル数が多い場合、サブ分割して `F<layer>_ARCHITECTURE_INDEX_<dir>_<sub>.md` としてください（例: `primitives` を A-F / G-N / O-Z に分割）。

自動生成
- `scripts/generate-architecture-index.js` を使って `docs/F_ARCHITECTURE/index.json` を生成できます。実行:

  ```bash
  pnpm run generate:arch-index
  # または
  node scripts/generate-architecture-index.js
  ```

- スクリプトは `file_count` と `last_updated` を検出して既存のインデックスファイルの frontmatter を更新します（完全ではありません、手動確認を推奨）。

CI 連携 (推奨)
- レポジトリに PR がマージされる前にこのスクリプトを実行するワークフローを追加し、`docs/F_ARCHITECTURE/index.json` を最新に保つことを推奨します。

---

作業履歴:
- 2025-12-27: Index template と初期インデックスを作成、生成スクリプトを追加
