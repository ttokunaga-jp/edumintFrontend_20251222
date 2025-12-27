# React 19 へのアップグレード要件定義書 ✅

## 概要
`React.startTransition` に関する警告（v7 系の警告）が開発／本番ログに出ているため、React を v19 へアップグレードし、警告の解消と互換性確保を行う。

## 目的
- 実行時の警告を完全に解消する（コンソール／ログに警告が残らないこと）。
- React v19 の新機能／挙動に対応し、既存機能（UI／テスト／ビルド）を壊さないこと。

## スコープ（含むもの）
- `react` / `react-dom` を `^19.x` にアップグレード。
- TypeScript 型パッケージ（`@types/react` / `@types/react-dom`）の更新。
- 直接の依存パッケージで React の peerDependency を満たさないものの判定・アップデート／代替対応。
- ビルド（Vite）、ユニットテスト（vitest）、E2E（Playwright）での検証。
- ドキュメント（CHANGELOG、README、`docs/`）とリリース手順の更新。

## 非スコープ（含めないもの）
- バックエンドの大改修。フロントエンドのみの移行。
- 主要なライブラリを React に合わせて大幅に置換すること（代替案が必要な場合、別タスクで検討）。

## 受け入れ基準（Definition of Done）✅
- ローカル開発・ビルド（`npm run dev` / `npm run build` / `npm run preview`）において、対象の警告が再現されない。
- `pnpm run typecheck`（もしくは `tsc --noEmit`）が通る。
- `vitest` の全テストが成功する（少なくとも主要なテスト）。
- Playwright の E2E（最低 1 シナリオ）が問題なく通過する。
- CI（`pnpm ci`）がパスし、ステージング環境で問題なければ本番リリースできる状態である。

## リスクと対応策 ⚠️
- 依存ライブラリの互換性不足 → 事前に peerDependencies を洗い出し、互換バージョンがなければ一時的にフォーク／Patch／差し替えを検討。
- 型の不一致によるビルド失敗 → `@types` の更新と、必要ならローカル型定義の一時 patch を行う。
- 重大なランタイム回帰 → ステージングでの回帰テストを厳格化、ロールバック手順を用意。

## 影響調査方法（実施手順の一例）
1. 再現: `npm run dev` と `npm run preview`（および本番ビルド）で警告を再現し、コンソールのスタックトレースで発生元パッケージを特定する。  
2. 依存監査: `pnpm why <package>` / `pnpm ls` / `npm ls` を使って、`startTransition` を参照しているパッケージや React に依存するパッケージを洗い出す。  
3. 互換性確認: 主要パッケージ（Radix, motion, lucide-react, sonner, zustand など）のリリースノートと peerDependencies を確認する。  
4. テスト計画作成: 退避テスト（既存の UI フロー）、ユニット・E2E の優先テストケースを選定。

## 推奨作業タスク（優先度順）
- 調査フェーズ（1 日〜2 日）
  - 警告発生箇所の特定（スタックトレース）、影響範囲調査。
  - 互換性の取れないパッケージ一覧作成。
- 実装フェーズ（1-3 日）
  - `react` / `react-dom` / `@types/*` を `^19` に更新（別ブランチ、単一 PR）。
  - 依存パッケージを順次更新し、必要に応じて差替えや簡易修正を実施。
- テスト・修正フェーズ（1-4 日）
  - 型エラー・テスト失敗を修正。E2E 環境で重点的にチェック。
- CI / リリースフェーズ（0.5-1 日）
  - CI の Node バージョンやビルドキャッシュを調整。ステージングで確認後、本番リリース。

## ロールと責任（提案例）
- 実装（Owner）: フロントエンド開発者（A）
- 依存監査（Owner）: ライブラリ担当（B）
- テスト（Owner）: QA/テスト担当（C）
- リリース（Owner）: リリース担当（D）

## ロールバック計画
- PR マージ前: ブランチ保護とステージングの E2E が必須。  
- 本番リリース後の不具合時: 迅速に元の `react` バージョンを復元する PR とタグを切り、即時ロールバック。ビルド済みアセットの保管と比較用ログを残す。

## 重要コマンド（参考）
- 再現 / デバッグ: `pnpm dev` / `pnpm build` / `pnpm preview`  
- 依存関係調査: `pnpm ls` / `pnpm why react`  
- バージョン更新（提案）: `pnpm add -D @types/react@^19 @types/react-dom@^19` / `pnpm add react@^19 react-dom@^19`  

---


※ 本要件書は最初のドラフトです。調査の結果に応じて、互換対象パッケージの追加や作業見積の調整を行ってください。

## 調査結果（現時点） 🔎
- 発生源: `react-router`（`react-router-dom` を含む）内に `v7_startTransition` に関する deprecation 警告のロジックが存在することを確認しました。  
  - 該当箇所: `node_modules/react-router/dist/...` にて `logV6DeprecationWarnings` により警告が出力される実装があるため、`RouterProvider` / `MemoryRouter` 等の利用時に警告が表示される可能性があります。  
- 影響: テスト実行時やブラウザ上で `React.startTransition` の将来挙動に関する警告が表示される（開発ログや CI ログにノイズ）。

### 暫定対応（短期 / 低リスク） ✅
- **テストコードと Router を利用するラッパーに `future: { v7_startTransition: false }` を明示的に渡す**ことで、当該 deprecation 警告を抑止できます（本リポジトリ内のテストに適用済み）。

### 中・長期対応（推奨） 🔄
- **React の v19 へのアップグレード**計画を進めつつ、`react-router` とその他主要ライブラリの互換性（peerDependencies）を確認・アップデートする。  
- `react-router` の将来バージョン（v7 以降）が安定した時点で、`future` フラグの再見直し／機能の有効化を検討してください。
