# MUI 移行 — フェーズ分解とタスク一覧（改訂版）

---

## フェーズ A: 強制リセット & 方針確定（短期・即時）

### ゴール

* Tailwind を「技術的に」「思想的に」完全に捨てる
* UI 基盤を **MUI + Emotion + Design Tokens に一本化**する前提を確立

### タスク

* Tailwind 関連の全依存を削除

  * `tailwindcss`
  * `postcss`
  * `autoprefixer`
  * `tailwind-merge`
  * `cn` / Tailwind 前提 util
* Tailwind 設定ファイル削除

  * `tailwind.config.*`
  * `postcss.config.*`
* global CSS から Tailwind import を削除
* 「Tailwind 使用禁止」をルールとして明文化

### 成果物

* Tailwind が **物理的に存在しない** リポジトリ
* UI が壊れていても OK

---

## フェーズ B: Tailwind 完全撤去 & クリーンアップ（最優先・実行中）

### ゴール

* **className に Tailwind が一切存在しない状態**を作る
* JSX / TSX を「MUI 前提で書き直せる状態」にする

### タスク

* 全 `className` の一括削除 or 無効化

  * template literal / 条件付き / レスポンシブ含む
* Tailwind 前提のレイアウトロジック除去
* primitives / pages / legacy components を区別せず処理
* codemod + 手動修正の併用
* **ビルド・型エラーは無視して進行**

### 成果物

* Tailwind が完全に消えたコードベース
* 多数のエラーがあっても許容

---

## フェーズ C: MUI Theme / Design Tokens 確立（並行実行）

### ゴール

* **スタイルの唯一のソースオブトゥルースを確立**
* 「どう直すか」を考える前に「どうあるべきか」を定義

### タスク

* Design Tokens 初版定義

  * Color / Typography / Spacing / Radius / Shadow
* MUI Theme 構築

  * palette
  * typography
  * shape
  * components overrides / variants
* sx 乱用防止ルール策定

### 成果物

* Theme が存在し、すべての UI がそこに寄せられる前提が完成

---

## フェーズ D: primitives の全面再実装（中核）

### ゴール

* `src/components/primitives` を **MUI 前提で再構築**
* 互換性より「正しさ」を優先

### 対象

* Button
* Input / TextField
* Select
* Checkbox / Radio / Switch
* Dialog / Modal
* Tooltip / Popover
* Tabs / Menu / Table / Badge / Avatar

### タスク

* primitives を **MUI ネイティブで直接実装**
* 不要な wrapper / props は削除
* Tailwind 前提 API は破壊してよい
* 可能な限り Theme 側に寄せる

### 成果物

* primitives が「薄い or ほぼ存在しない」状態
* UI の主語が完全に MUI になる

---

## フェーズ E: ページ・業務 UI 再接続

### ゴール

* primitives を使ってページ UI を復旧
* 見た目より「構造と一貫性」を優先

### タスク

* 主要ページから順に修復

  * 問題作成 / 編集
  * マイページ
  * 検索・一覧
* レイアウトは MUI Grid / Stack に統一
* ページ固有の style は最小限に抑制

### 成果物

* 主要ユーザーフローが UI 的に復旧

---

## フェーズ F: エラー・テスト一括解消（最終フェーズ）

### ゴール

* **ここで初めて「壊れているものを直す」**
* プロダクション品質へ到達

### タスク

* TypeScript エラー全解消
* `pnpm build` 成功
* Unit / Storybook / E2E を順に復旧
* A11y チェック（axe + 手動）

### 成果物

* CI 完全グリーン
* リリース可能状態

---

## フェーズ G: 最終整理 & ドキュメント

### ゴール

* 技術的負債を残さず完了

### タスク

* 未使用ファイル / export 削除
* primitives / Theme 使用ガイド作成
* Tailwind 再導入防止ガイドライン追加

### 成果物

* クリーンな UI 基盤
* 将来の開発者が迷わないドキュメント

---

## フェーズ構成まとめ 🧭

| フェーズ | 内容             | エラー許容 |
| ---- | -------------- | ----- |
| A    | 方針確定・依存削除      | ✔     |
| B    | Tailwind 完全撤去  | ✔     |
| C    | Theme / Tokens | ✔     |
| D    | primitives 再実装 | ✔     |
| E    | ページ復旧          | ✔     |
| F    | エラー・テスト解消      | ❌     |
| G    | 仕上げ            | ❌     |

---

## 所要感（再見積）

* 全体: **3–5 ヶ月**
* 最大短縮ポイント:

  * PoC / feature flag / 段階互換を捨てたこと
  * Tailwind と MUI の共存期間を作らないこと

---

## 最終注意事項（重要）

* 本移行は **「安全な移行」ではない**
* 中間状態の見た目・エラー・壊れは問題にしない
* 判断基準は常に以下：

> **「Tailwind を完全に捨て、MUI 前提で将来が楽になるか？」**

この基準に反する実装・妥協は行わない。