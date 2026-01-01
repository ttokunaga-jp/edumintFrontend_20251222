# D_3 ProblemView/Edit Component REQUIREMENTS

## スコープ
- ProblemMetaBlock, QuestionBlock, AnswerBlock, PreviewEditToggle, EditHistoryBlock, CommentList (Phase2), ActionBar。

## 機能要件
- 表示
  - Meta/Question/Answer/History をブロックで表示
  - 広告/ロック制御（段階開示、投稿者免除）
- 編集（投稿者）
  - **単一 Page ファイル**で Preview/Edit を切替（Edit 内で Preview を参照できる構造）。
  - Preview/Edit トグルでフォーム切替、保存/取消
  - History: version 差分表示、ロールバック（`GET /exam-edit-history/{examId}`, `POST /exam-history/{examId}/rollback`）
- Social（Phase2）
  - いいね/コメント/投票/通知はヘルスとフラグで制御
  - API: `POST /exams/{examId}/like`, `GET/POST/DELETE /comments`, `POST /comments/{commentId}/vote`
- ActionBar
  - bookmark/share/report を提供（`POST /exams/{examId}/bookmark`, `POST /exams/{examId}/share`, `POST /reports`）
  - 実装規約: UI コンポーネントは `services/api/*` を直接 import しない。`features/content` / `features/moderation` / `features/notifications` の hook/repository 経由で呼ぶ。
- ServiceHealth
  - `GET /health/content`（閲覧/編集の一次依存）
  - `GET /health/community`, `GET /health/notifications`（Social/通知）
- モック（暫定）
  - `src/src/services/api/gateway.ts` は `VITE_API_BASE_URL` が localhost の場合にモックへ分岐

## 非機能要件
- 保存は API 完了後に UI 反映（楽観不可）。エラーは Toast + inline。
- i18n。アクセシビリティ: keyboard navigation。

## ファイル構成（改訂版 - アーキテクチャ準拠）

### ページ
- `src/pages/ProblemViewEditPage.tsx` : ページエントリーポイント

### ProblemViewEditPage 専用コンポーネント
```
src/components/page/ProblemViewEditPage/
├── PreviewView.tsx           : Preview 表示エリア
├── EditView.tsx              : Edit 表示エリア
├── MetaSection.tsx           : メタ情報エディタ
├── ActionSection.tsx         : 保存/キャンセル/切り替えバー
├── QuestionSection/
│   ├── QuestionBlock.tsx     : 大問コンテナ
│   ├── Header.tsx            : 大問番号・削除
│   ├── Meta.tsx              : 難易度・キーワード
│   └── Content.tsx           : 大問本文（QuestionEditorPreview）
├── SubQuestionSection/
│   ├── SubQuestionBlock.tsx  : 小問振り分けコンポーネント
│   ├── common/
│   │   ├── Header.tsx        : 小問番号・タイプ・アクション
│   │   └── Meta.tsx          : キーワード・タイプ選択
│   ├── Selection/
│   │   ├── SelectionEditor.tsx       : 選択肢形式エディタ
│   │   ├── OptionBlock.tsx           : 選択肢入力（QuestionEditorPreview）
│   │   └── Content.tsx              : 選択肢レイアウト
│   ├── Matching/
│   │   ├── MatchingEditor.tsx        : ペア形式エディタ
│   │   ├── PairBlock.tsx             : ペア入力（質問/回答それぞれ QuestionEditorPreview）
│   │   └── Content.tsx              : ペアレイアウト
│   ├── Ordering/
│   │   ├── OrderingEditor.tsx        : 順序形式エディタ
│   │   ├── ItemBlock.tsx             : アイテム入力（QuestionEditorPreview）
│   │   └── Content.tsx              : アイテムレイアウト
│   └── Essay/
│       ├── EssayEditor.tsx           : 記述形式エディタ
│       ├── AnswerBlock.tsx           : 解答・採点基準（QuestionEditorPreview）
│       └── Content.tsx              : 記述レイアウト
├── CommentSection.tsx        : コメント機能（Phase 2）
├── EditHistoryBlock.tsx      : 編集履歴・ロールバック
├── AdGateModal.tsx           : 広告ロック UI
└── ReportModal.tsx           : 通報フォーム
```

### 共通コンポーネント
```
src/components/common/
├── TopMenuBar.tsx            : トップメニューバー
├── ContextHealthAlert.tsx    : サービスヘルスアラート
├── PreviewEditToggle.tsx     : Preview/Edit トグル
└── editors/
    ├── QuestionEditorPreview.tsx     : LaTeX/Markdown 統合エディタ
    ├── EditorPreviewPanel.tsx        : エディタ + プレビュー
    ├── FormEditor.tsx                : テキスト入力フォーム
    ├── LaTeXPreview.tsx              : LaTeX/Markdown レンダリング
    ├── types.ts                      : Editor 関連の型定義
    └── index.ts                      : 再エクスポート
```

## Sources
- `../overview/requirements.md`, `../overview/use-cases.md`
- `../implementation/service-health/README.md`
- `src/src/services/api/gateway.ts`

## 完全なディレクトリ構造ツリー（共通コンポーネント中心）

```
src/
├── components/
│   ├── common/
│   │   ├── TopMenuBar.tsx
│   │   ├── ContextHealthAlert.tsx
│   │   ├── PreviewEditToggle.tsx
│   │   └── editors/                      ← 統一エディタ層
│   │       ├── QuestionEditorPreview.tsx  │ モード切り替え (preview|edit)
│   │       ├── EditorPreviewPanel.tsx     │ 分割パネル (editor + preview)
│   │       ├── FormEditor.tsx             │ テキスト入力 (LaTeX補助機能)
│   │       ├── LaTeXPreview.tsx           │ Math & Markdown レンダリング
│   │       ├── types.ts                   │ エディタ型定義
│   │       └── index.ts                   └ 再エクスポート
│   │
│   └── page/
│       └── ProblemViewEditPage/
│           ├── PreviewView.tsx
│           ├── EditView.tsx
│           ├── MetaSection.tsx
│           ├── ActionSection.tsx
│           ├── QuestionSection/
│           │   ├── QuestionBlock.tsx
│           │   ├── Header.tsx
│           │   ├── Meta.tsx
│           │   └── Content.tsx
│           ├── SubQuestionSection/
│           │   ├── SubQuestionBlock.tsx
│           │   ├── common/
│           │   │   ├── Header.tsx
│           │   │   └── Meta.tsx
│           │   ├── Selection/           ← 選択肢形式 (ID: 1,2,3)
│           │   │   ├── SelectionEditor.tsx
│           │   │   ├── OptionBlock.tsx
│           │   │   └── Content.tsx
│           │   ├── Matching/            ← ペア形式 (ID: 4)
│           │   │   ├── MatchingEditor.tsx
│           │   │   ├── PairBlock.tsx
│           │   │   └── Content.tsx
│           │   ├── Ordering/            ← 順序形式 (ID: 5)
│           │   │   ├── OrderingEditor.tsx
│           │   │   ├── ItemBlock.tsx
│           │   │   └── Content.tsx
│           │   └── Essay/               ← 記述形式 (ID: 10-14)
│           │       ├── EssayEditor.tsx
│           │       ├── AnswerBlock.tsx
│           │       └── Content.tsx
│           ├── CommentSection.tsx        (Phase 2)
│           ├── EditHistoryBlock.tsx
│           ├── AdGateModal.tsx
│           └── ReportModal.tsx
│
├── features/
│   └── content/
│       ├── hooks/
│       │   ├── useProblemState.ts
│       │   ├── useQuestionState.ts
│       │   ├── useSubQuestionState.ts
│       │   └── useUnsavedChanges.ts
│       ├── types/
│       │   ├── problem.ts
│       │   ├── question.ts
│       │   ├── subQuestion.ts
│       │   ├── selection.ts
│       │   ├── matching.ts
│       │   ├── ordering.ts
│       │   └── essay.ts
│       ├── config/
│       │   ├── questionTypeConfig.ts
│       │   ├── difficultiesConfig.ts
│       │   └── keywordsConfig.ts
│       ├── utils/
│       │   ├── normalizeQuestion.ts
│       │   ├── validateQuestion.ts
│       │   ├── normalizeSubQuestion.ts
│       │   └── validateSubQuestion.ts
│       └── repositories/
│           ├── problemRepository.ts
│           ├── questionRepository.ts
│           └── subQuestionRepository.ts
│
├── services/
│   └── api/
│       ├── gateway.ts
│       ├── problem.ts
│       ├── question.ts
│       ├── subQuestion.ts
│       └── health.ts
│
└── hooks/
    ├── useEditorHooks.ts
    ├── useAsync.ts
    └── useDebounce.ts
```

## レイヤー別責務

### Components Layer
- **common/editors/** : 再利用可能なエディタコンポーネント (QuestionEditorPreview が中心)
- **page/ProblemViewEditPage/** : ページ構造を展開（ビジネスロジック分離）

### Features Layer
- **content/{hooks,types,config,utils}** : 状態管理とドメイン知識
- **content/repositories** : API との通信インターフェース

### Services Layer
- **api/** : APIエンドポイント（実装は Phase 2）

## Sources
- `../overview/requirements.md`, `../overview/use-cases.md`
- `../implementation/service-health/README.md`
- `src/src/services/api/gateway.ts`
