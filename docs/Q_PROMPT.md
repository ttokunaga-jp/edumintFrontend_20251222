# Q_PROMPT

目的: 他の CodingAgent（または人間の実装者）に実装を依頼する際にそのままコピペできる詳細プロンプトのテンプレート群です。PR 作成・実装報告・検証まで一貫して使える形に整えています。

注意事項（必ず守る）
- 変更対象ファイルは必ず `git` でブランチを切って PR を作成すること。
- 外部 OSS（例: Moodle、CodeRunner）のコードを参照・組み込む場合はライセンスに従うこと（GPL 等）。
- 変更は小さなコミットに分割し、各コミットで CI が通るようにすること。
- PR 本文には `docs/P_IMPLEMENT_REPORT_FMT.md` 準拠の実装報告（YAML frontmatter + 概要）を必ず貼ること。
- 実装前に `docs/F_ARCHITECTURE` の該当インデックスを確認し、影響範囲に Index の更新が必要かを判断すること。

---

## 共通コンテキスト
- リポジトリ: edumintFrontend_2025
- 主言語: TypeScript + React
- 主要 Page: `src/pages/ProblemViewEditPage.tsx`
- 既存 UI: `src/components/page/ProblemViewEditPage/*`（`SubQuestionBlock.tsx` 等）
- 参照 Index: `docs/F_ARCHITECTURE/F1_ARCHITECTURE_INDEX_src_components_problemTypes.md`

---

## テンプレ: フェーズ実装依頼（コピーして使用）

目的: `ProblemViewEditPage` を小問タイプ別プラグインアーキテクチャにリファクタする（フェーズ指定）

必須事項（PR 作成時）
- ブランチ命名規約に従う: `refactor/problem-types/<phase>-<short-desc>`
- PR 本文に `docs/P_IMPLEMENT_REPORT_FMT.md` に沿った YAML frontmatter を貼る
- 関連する `docs/F_ARCHITECTURE` Index の更新が必要なら `scripts/generate-architecture-index.js` を実行し、生成された `docs/F_ARCHITECTURE/index.json` を差分に含める

作業範囲（例: フェーズ 1: Registry）
1. `src/components/problemTypes/ProblemTypeRegistry.tsx` を追加
2. `src/types/problemTypes.ts` に Props 型を追加
3. Registry のユニットテストを追加
4. `docs/F_ARCHITECTURE` の problemTypes Index に `entry_points` を追加（または `scripts/generate-architecture-index.js` で自動更新）

検証手順（必須）
- `pnpm install && pnpm run build`（ビルドが通ること）
- `pnpm run test`（ユニットテストが通ること）
- Storybook がある場合は該当ストーリーで表示確認

受け入れ基準（例）
- Registry の基本機能がユニットテストで確認できること
- PR に実装報告が添付されていること
- `docs/F_ARCHITECTURE/index.json` に反映があること（必要な場合）

---

## テンプレ: 小さな PR（チェックリスト）
- [ ] Branch を切っている
- [ ] 1 機能 = 1 PR（可能な限り小さい）
- [ ] `docs/P_IMPLEMENT_REPORT_FMT.md` に準拠した実装報告を PR 本文に貼った
- [ ] 必要なら `scripts/generate-architecture-index.js` を実行して `docs/F_ARCHITECTURE/index.json` を更新した
- [ ] CI が通る

---

## テンプレ: CodingAgent に渡す短い実行命令（英語でも日本語でも可）
- 「Please implement Phase 2 (FreeTextView): add `src/components/problemTypes/FreeTextView.tsx`, story, snapshot test. Use `ProblemTypeViewProps`. Create small PR, attach implementation report. Run `pnpm run test` and report failing tests (if any).」

---

## 補足: PR の自動化ルール（推奨）
- CI ワークフローで `pnpm run generate:arch-index` を実行し、`docs/F_ARCHITECTURE/index.json` の変更がある場合はエラーか自動コミットのどちらかの運用にすること。これは Index の鮮度を保つために有効です。

---

必要ならこのテンプレをベースに特定フェーズ用のより詳細なプロンプトを生成します（例: FreeTextView の内部 DOM・アクセシビリティ要件など）。

## Prompt 2: Vite Configuration Adjustment (If needed)

```markdown
# Context
We are running Vite inside Docker. Sometimes Vite restricts network access to local loopback by default.

# Task
Check `vite.config.ts` (or `vite.config.js`). ensure the server is configured to listen on all interfaces.
- Add or verify:
  ```ts
  server: {
    host: true, // or '0.0.0.0'
    port: 5173,
    watch: {
        usePolling: true // Sometimes needed for Windows/WSL file system events
    }
  }
  ```
- If the file needs modification, please apply this change.
```

---

## Prompt 3: Documentation Update (Phase 3)

```markdown
# Task
Update the project documentation to explain how to use the new Docker setup.

# Action
Create a new file `docs/DOCKER_README.md` (or append to main README) with the following info:
1. **Prerequisites**: Docker Desktop installed.
2. **Start Dev Server**: `docker-compose up`
3. **Rebuild**: `docker-compose up --build`
4. **Stop**: `docker-compose down`
5. **Troubleshooting**: Brief note about ensuring ports are free.
```
