## リファクタリング要件定義書（改訂版・2025） ✅

---

## 1. 背景

* 現状:

  * `src/components/primitives` を中心に多数の自作 UI コンポーネントが存在
  * スタイリングは Tailwind CSS に強く依存し、className の組み合わせが複雑化
  * JSX/TSX とスタイル定義が密結合し、保守・変更コストが高い
* 課題:

  * UI 実装の一貫性・アクセシビリティの担保が困難
  * Tailwind 依存によるデザインルールの分散
  * 技術的負債が蓄積し、全体最適が困難
* 方針:

  * **Tailwind CSS をコードベースから完全撤去**
  * **MUI v5 + Emotion + Design Tokens を唯一の UI / スタイル基盤として採用**

---

## 2. 目標（ゴール）🎯

* **UI 基盤の単一化**

  * スタイリング手段を *MUI Theme / Design Tokens* に完全統一
* **保守性の最大化**

  * UI 実装を MUI 標準コンポーネント＋最小限の拡張に集約
* **アクセシビリティの担保**

  * MUI が提供する A11y 標準を全面的に活用
* **技術的負債の解消**

  * Tailwind 由来の ad-hoc な class 設計・中間互換レイヤーを残さない
* **リリース前前提の大胆な刷新**

  * 後方互換性を考慮せず、将来最適を優先

---

## 3. スコープ（重要）❗

### 本移行の前提

* **Tailwind CSS は段階的移行ではなく、一括で完全撤去する**
* ProgressBar / TopMenuBar / primitives / pages を含む **全 UI が対象**
* レガシー API・レイアウト・実装に拘らない
* 一時的なビルド・TypeScript エラーは許容し、**最終フェーズでまとめて解消**

### 明示的に禁止されるもの

* Tailwind の部分残存
* Tailwind 前提のユーティリティ・ラッパー
* 将来のための互換レイヤー
* TODO / FIXME による先送り

---

## 4. 影響範囲（簡易サマリ）🔎

* **主要変更対象**

  * `src/components/primitives/*`
  * primitives を利用する全ページ・共通コンポーネント
* **スタイリング**

  * Tailwind → **MUI + Emotion + Design Tokens に全面移行**
  * CSS-in-JS（Emotion）を標準
* **見た目差分**

  * MUI デフォルトとの差分は Theme 側で吸収
  * 各コンポーネントで個別調整しない

---

## 5. コンポーネント方針・API マッピング 🔁

### 原則（優先順）

1. **MUI ネイティブコンポーネントを直接使う**
2. **Theme / variants / slots で拡張**
3. **どうしても必要な場合のみ自作**

> 「既存 API を守る」ことより
> **MUI の設計思想に寄せることを最優先**する。

### 例

* Button → `@mui/material/Button`
* Input / Textarea → `TextField`, `Input`, `TextareaAutosize`
* Select → `Select` + `MenuItem`
* Checkbox / Radio / Switch → MUI 標準
* Dialog / Popover / Tooltip → MUI 標準
* Table → MUI Table（仮想化は別途検討）

---

## 6. 移行方針（実行ルール）🛠️

### 重要な前提

* **ビルド・型エラーの完全解消を待たずに進めてよい**
* エラーは *最終フェーズで一括解消* する
* 安全な中間状態を維持する必要はない

### 実行ルール

1. Tailwind を物理的に削除する
2. 壊れた UI / JSX は後で直す
3. MUI Theme / Tokens を唯一の正解にする
4. 中途半端な互換実装を残さない

---

## 7. Design Tokens / Theme 方針 🎨

* 色・フォント・余白・角丸・影は **Design Tokens がソースオブトゥルース**
* Tokens → MUI Theme に集約
* `sx` は例外的使用のみ（乱用禁止）
* コンポーネント固有の style は theme overrides / variants に集約

---

## 8. 技術スタック ⚖️

* Framework: React 19 + Vite 5
* UI: `@mui/material` v5
* Styling: Emotion（必須）
* Icons: `@mui/icons-material`（必要最小限）
* Tailwind: **完全撤廃（導入・再利用禁止）**

---

## 9. 品質・テスト要件（最終フェーズ）✅

* Unit / Component: Vitest + RTL
* Storybook: primitives / 主要 UI
* E2E: 主要ユーザーフロー
* A11y: axe + 手動キーボード検証

※ 移行途中でのテスト失敗は許容
※ **最終状態でのみ全テストパスが必須**

---

## 10. 受け入れ基準（完了条件）✅

* Tailwind 関連コード・依存が **完全に 0**
* UI スタイル基盤が MUI Theme / Tokens に一本化されている
* 不要ファイル・未使用 export が残っていない
* `tsc` / `vite build` / `test` がすべて成功
* Main ブランチがそのままリリース可能

---

## 11. ロールアウト方針（プレリリース前提）

* 後方互換性・段階リリースは考慮しない
* API 破壊的変更は許容
* 問題が出た場合は **修正で前進**（ロールバック前提にしない）

---

## 12. アクション（更新）

* ~~PoC 作成~~ → **不要（全面移行を即実施）**
* Theme / Tokens 設計 → **最優先**
* Tailwind 完全撤去 → **即時・一括**
* 最終フェーズでエラー・テストを一括解消

---

### 最終補足

本リファクタリングは
**「安全に少しずつ移行するプロジェクト」ではありません。**

> **Tailwind を捨て、MUI を前提にコードベースを再構築するプロジェクトです。**

この前提をすべての実装・判断の基準としてください。
