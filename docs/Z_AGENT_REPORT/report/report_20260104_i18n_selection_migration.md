# Project Report: i18n移行 — 選択肢/チェックボックスの中央管理化

**作成日:** 2026-01-04  
**作成者:** GitHub Copilot

---

## 1. 概要
非可変（マスターでない）ドロップダウンやチェックボックス（大学・学部・科目・教員・キーワードを除く）のラベルを、それぞれ固有のIDで管理して i18n（翻訳）ファイルへ移行しました。これにより、UIテキストの一元管理と多言語対応が容易になります。

## 2. 進捗状況
| フェーズ | ステータス | 完了日 | 担当者 |
|----------|------------|--------|--------|
| 要件確認・スキャン | 完了 | 2025-12-28 | GitHub Copilot |
| 実装（定数化・コンポーネント修正） | 完了 | 2026-01-03 | GitHub Copilot |
| ローカライズ（ja/en 追加） | 完了 | 2026-01-03 | GitHub Copilot |
| テスト修正・検証 | 完了 | 2026-01-03 | GitHub Copilot |
| PR準備・レビュー | 進行中 | - | TAKUMI / チーム |
| スクリーンショット（自動） | 要検討（環境依存） | - | TAKUMI / CI |

### 変更の要約
- 新規: `src/features/ui/selectionOptions.ts`（選択肢の集中定義: id / value / labelKey）
- 更新: 多数の UI コンポーネントを i18n に合わせて修正（例: `StartPhase`, `AdvancedSearchPanel`, `ResultEditor`, `DifficultySelect`, `GenerationTimeline`, `MyPage` 等）
- ローカル: `src/locales/ja/translation.json`, `src/locales/en/translation.json` に新しいキーを追加
- テスト: 一部のユニットテストを i18n対応に更新

## 3. 問題点 / 課題
- Playwright のブラウザバイナリがこのホスト OS ではインストールできず、自動スクリーンショットが実行できませんでした。代替として Docker 実行か手動スクリーンショットの検討が必要です。⚠️
- 変更を一時コミットした結果、現在コミットは `main` に存在します（コミット: `e8a1436`）。PR を作成する際にブランチ整理（コミットを別ブランチに移すか、そのまま新ブランチを作って push するか）の決定が必要です。

## 4. 今後の予定
- （短期）PR ブランチを作成してプッシュ → Draft PR を作成（現状の候補ブランチ名: `feat/i18n-selection-options`）
- レビューを受け、ローカライゼーションチームへ翻訳依頼（`docs/PR_CHANGELOG_I18N_SELECTIONS.md` を参照）
- スクリーンショット方針の確定：
  - Docker を使って Playwright + Chromium コンテナでキャプチャする（推奨）
  - あるいはユーザ側で `npx playwright install` を実行してから自動スクリプトを走らせる
  - または手動で主要画面のスクショを撮影してもらう
- CI 上でのスナップショットと e2e の追加テスト（必要に応じて）

## 5. 備考
- PR 用の変更ログ: `docs/PR_CHANGELOG_I18N_SELECTIONS.md`
- 影響範囲（例）: `src/features/ui/selectionOptions.ts`, `src/components/page/ProblemCreatePage/*`, `src/components/page/HomePage/AdvancedSearchPanel.tsx`, `src/components/common/selects/*`, `src/locales/*` 等
- テスト状況: ローカルでユニットテストは全通（67 tests passed）

---

必要であれば、このレポートをベースに PR の本文・レビューページのチェックリスト・翻訳用のキー一覧（CSV/表形式）を追加作成できます。どれを次に作成しましょうか？