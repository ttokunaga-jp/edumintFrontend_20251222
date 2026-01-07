# i18n / ハードコード文字列調査レポート

**目的**: プロジェクト全体のハードコードされた日本語文字列と、選択肢（Select/Checkbox/Radio）に関係する定数を網羅的に抽出しました。

---

## 要約
- 合計検出ファイル（src 配下の主なもの）: **主な 25 ファイル以上**（モック・テスト含む）
- 優先対応候補（高）:
  - `src/features/exam/schema.ts` (QuestionTypeLabels 等) — SSOT で日本語ラベルを持つ
  - `src/components/common/selects/QuestionTypeSelect.tsx` — 数値 ID とラベルがハードコード
  - `src/pages/LoginRegisterPage.tsx` — 多数のエラーメッセージ、ラベル、利用規約ダイアログの長文
  - `src/features/exam/components/ExamMetaSection.tsx` — 多数のフォームラベル
- 良好な実装箇所:
  - `src/features/ui/selectionOptions.ts` は多くの `labelKey` を持っており、i18n の観点で良い

---

## 1) 選択肢・定数（ID と直接関係）
各エントリは: `ファイルパス | 行番号 | コード断片 | 管理されている ID` の順。

### src/features/exam/schema.ts
- lines 11–29
- コード:
```ts
export const QuestionTypeEnum = z.enum(['1','2','3','4','5','10','11','12','13','14']);
export const QuestionTypeLabels: Record<string, string> = {
  '1': '単一選択',
  '2': '複数選択',
  '3': '正誤判定',
  '4': '組み合わせ',
  '5': '順序並べ替え',
  '10': '記述式',
  '11': '証明問題',
  '12': 'コード記述',
  '13': '翻訳',
  '14': '数値計算',
};
```
- 分類: 選択肢定義（**数値IDベース**）。
- 推奨: `i18n` へ移行し、ID を数値で扱うマップに置換（高優先）。

### src/components/common/selects/QuestionTypeSelect.tsx
- lines 8–20
- コード:
```ts
const defaultOptions = [
  { value: 1, label: '単一選択' },
  { value: 2, label: '複数選択' },
  ...
  { value: 14, label: '数値計算' },
];
```
- 分類: 選択肢定義（ハードコードされたラベル + number value）。
- 推奨: `enumMappings` を使ったラベル解決に置き換え（getEnumLabel で表示）。

### src/features/ui/selectionOptions.ts
- lines 1–80
- コード例:
```ts
export const PROBLEM_FORMAT_OPTIONS = [
  { id: 'format.single_choice', value: 'single_choice', labelKey: 'enum.format.single_choice' },
  ...
];
export const LEVEL_OPTIONS = [
  { id: 'level.basic', value: 0, labelKey: 'enum.level.basic' },
  { id: 'level.standard', value: 1, labelKey: 'enum.level.standard' },
  { id: 'level.advanced', value: 2, labelKey: 'enum.level.advanced' },
];
```
- 分類: 設計良好（labelKey を使用）。ただし `value` の型が string か number か混在している点に注意。
- 推奨: バックエンドが INT を用いる箇所では `value` を number に揃えるか、フロントで明確に変換を行う。

---

## 2) JSX/TSX に直接書かれている日本語（抜粋）
重要な箇所のみ抜粋。移行優先度を併記。

### src/pages/LoginRegisterPage.tsx
- lines 44–78, 200–320
- 抜粋:
  - 'メールアドレスとパスワードを入力してください' (バリデーション)
  - 'パスワードは8文字以上である必要があります'
  - '利用規約'（Dialog タイトル）、利用規約本文（長文）
  - ボタン: 'ログイン', '登録', helperText: '8文字以上の英数字とスペシャル文字を含めてください'
- 分類: バリデーション / ダイアログ（**高優先**）

### src/components/page/HomePage/AdvancedSearchPanel.tsx
- lines 425–615
- 抜粋:
  - placeholder="選択または入力"
  - Button: 'リセット'
  - チェックボックスのラベル群（多くは t('...') を使用しているが一部生文字列あり）
- 分類: UIラベル / プレースホルダ (中優先)

### src/features/exam/components/ExamMetaSection.tsx
- lines 204–232, 352–420
- 抜粋:
  - '種別', '試験名', '系統', '学問分野', '大学名', '学部', '教授', '試験年度', '科目名', '所要時間 (分)'
- 分類: UI ラベル（フォーム） — **高優先**

### src/features/exam/components/SubQuestionItem.tsx
- lines 120–160
- 抜粋: '問題文', '問題文を入力してください（Markdown/LaTeX対応）', '解答解説'
- 分類: UI ラベル / プレースホルダ（中優先）

### src/components/problemTypes/viewers/SQ3_TrueFalse.tsx
- 抜粋: '✓ 正解'（解答表示）
- 分類: UI ラベル（低〜中）

### src/types/api.ts
- lines 50–96
- 抜粋: HTTP ステータスに紐づく日本語メッセージ群 (例: '入力内容に誤りがあります。再度ご確認の上、操作してください。')
- 分類: エラーメッセージ（**高優先**）

### src/types/health.ts
- 抽出: ServiceCategory 型に日本語リテラル('AI生成エンジン'等)
- 分類: その他（内部型に日本語が含まれるため修正推奨）

---

## 3) モック / テスト内の言語・ID利用
- src/mocks/handlers/problemHandlers.ts: 一部ロジックやマップで日本語が利用（科目・大学名マッピングなど）
- src/mocks/mockData/*.json: 大学名/学問名/問題データに日本語が埋め込まれている（モック用）
- tests/features/exam/*.test.tsx: `questionTypeId` を '1' etc で参照しているテストが有り、移行時にテスト調整必要

---

## 4) 優先度と推奨次ステップ（短く）
1. 高: `schema.ts` の `QuestionTypeLabels` を `enumMappings` 化、`QuestionTypeSelect` を `getEnumLabel` 参照に差し替え（重要: 型は number を使う）
2. 高: `types/api.ts` のエラーメッセージを i18n 化
3. 中: 各フォームのラベル（ExamMetaSection, SubQuestionItem, LoginRegister）を逐次 i18n 化
4. 低: モックに含まれる日本語は運用上は問題ないが、E2E テストのローカライズを確認

---

## 5) 添付: 検索に使ったパターンのメモ
- 日本語判定: 正規表現で[一-龯ぁ-んァ-ン]+ を使用。これにより、コメント・ドキュメントの日本語も検出されます。

---

**要確認**: この報告は抜粋版です。全文（行番号付きの完全リスト）を出力する準備ができています。続けて完全一覧が必要であれば『完全一覧を出力』と指示してください。

---

(報告作成者: GitHub Copilot)
