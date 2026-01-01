import React from 'react';
import { ProblemTypeEditProps, ProblemTypeRegistration, ProblemTypeViewProps } from '@/types/problemTypes';

const registry = new Map<number, ProblemTypeRegistration>();

/**
 * ProblemTypeRegistry
 * 
 * 問題形式（typeId）とコンポーネントのマッピングを管理するレジストリ
 * 
 * ========================================
 * typeId マッピング（実装参照）
 * ========================================
 * 
 * 【パターンA：選択・構造化データ系】
 * ID 1 | 単一選択         | SelectionViewer (isSingleSelect=true)
 * ID 2 | 複数選択         | MultipleChoiceView (SelectionViewer採用)
 * ID 3 | 正誤判定         | SelectionViewer (Yes/No二者択一)
 * ID 4 | 組み合わせ       | MatchViewer (ペアリング)
 * ID 5 | 順序並べ替え     | OrderViewer (シーケンス)
 * 
 * 【パターンB：自由記述・テキスト系】
 * ID 10 | 記述式          | NormalSubQuestionView (汎用エッセイ)
 * ID 11 | 証明問題        | NormalSubQuestionView (LaTeX強制)
 * ID 12 | コード記述      | NormalSubQuestionView (コードシンタックス)
 * ID 13 | 翻訳            | NormalSubQuestionView (対照テキスト)
 * ID 14 | 数値計算        | NormalSubQuestionView (完全一致判定)
 * 
 * ========================================
 * 現在の実装状況（2025-12-31）
 * ========================================
 * 
 * ✅ レガシーマッピング（後方互換性）
 *    ID 1,4,5,6,7,8,9 → NormalSubQuestionView
 *    ID 2 → MultipleChoiceView + MultipleChoiceEdit
 * 
 * ⚠️  移行中: SelectionViewer, MatchViewer, OrderViewer 統合予定
 *    新規問題の場合は ID 1-5 を使用
 * 
 * ========================================
 */

export function registerProblemType(entry: ProblemTypeRegistration) {
  registry.set(entry.id, entry);
}

export function getProblemTypeView(typeId: number): React.ComponentType<ProblemTypeViewProps> | null {
  const entry = registry.get(typeId);
  return entry ? entry.view : null;
}

export function getProblemTypeEdit(typeId: number): React.ComponentType<ProblemTypeEditProps> | null {
  const entry = registry.get(typeId);
  return entry && entry.edit ? entry.edit : null;
}

/**
 * registerDefaults
 * 
 * デフォルト問題タイプを登録する
 * 
 * パターンA（選択系）：ID 1-5
 * - SelectionViewer: ID 1,3（単一選択 + 正誤判定）
 * - MultipleChoiceView: ID 2（複数選択）
 * - MatchViewer: ID 4（組み合わせ）
 * - OrderViewer: ID 5（順序並べ替え）
 * 
 * パターンB（記述系）：ID 10-14
 * - NormalSubQuestionView: ID 10,11,12,13,14（汎用）
 * 
 * レガシーマッピング（後方互換性）：ID 1,4,5,6,7,8,9
 * - NormalSubQuestionView（旧形式コンテンツ対応）
 */
export function registerDefaults() {
  // lazy require to avoid load-order issues
  try {
    const NormalSubQuestionView = React.lazy(() =>
      import('./NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))
    );

    // ========================================
    // パターンA：選択・構造化データ系（ID 1-5）
    // ========================================

    // ID 1: 単一選択（RadioButton）
    // 新形式：SelectionViewerを使用（isSingleSelect=true）
    // 後方互換性：旧形式データはNormalSubQuestionViewで処理
    registerProblemType({ id: 1, view: NormalSubQuestionView, edit: NormalSubQuestionView });

    // ID 2: 複数選択（Checkbox）
    // 実装：MultipleChoiceViewに SelectionViewerを統合済み
    const MultipleChoice = require('./MultipleChoiceView').default;
    const MultipleChoiceEdit = React.lazy(() => import('./MultipleChoiceEdit'));
    registerProblemType({ id: 2, view: MultipleChoice, edit: MultipleChoiceEdit });

    // ID 3: 正誤判定（True/False）
    // 実装：SelectionViewerで二者択一として処理（Yes/No選択肢）
    // 後方互換性：旧形式（Numeric相当）はNormalSubQuestionViewで処理
    // TODO: 新規ID3問題は SelectionViewer(isSingleSelect=true) で処理するよう更新

    // ID 4: 組み合わせ（Matching）
    // 実装：MatchViewerで左（問題）→ 右（答え）をペアリング表示
    // TODO: MatchViewerをProblemTypeRegistry に統合

    // ID 5: 順序並べ替え（Ordering）
    // 実装：OrderViewerでバッジ付き順序表示（valueでソート）
    // TODO: OrderViewerをProblemTypeRegistry に統合

    // ========================================
    // パターンB：自由記述・テキスト系（ID 10-14）
    // ========================================

    // ID 10: 記述式（Essay）
    // ID 11: 証明問題（Proof）
    // ID 12: コード記述（Programming）
    // ID 13: 翻訳（Translation）
    // ID 14: 数値計算（Numeric with tolerance）
    // 全て汎用エッセイロジック（NormalSubQuestionView）で処理
    // 差異は type_id のみで、UI/採点プロンプトで区別
    registerProblemType({ id: 10, view: NormalSubQuestionView, edit: NormalSubQuestionView });
    registerProblemType({ id: 11, view: NormalSubQuestionView, edit: NormalSubQuestionView });
    registerProblemType({ id: 12, view: NormalSubQuestionView, edit: NormalSubQuestionView });
    registerProblemType({ id: 13, view: NormalSubQuestionView, edit: NormalSubQuestionView });
    registerProblemType({ id: 14, view: NormalSubQuestionView, edit: NormalSubQuestionView });

    // ========================================
    // 新規形式での ID 1-5 (上記で完全登録)
    // 新規形式での ID 10-14 (上記で完全登録)
    // レガシーマッピングは廃止 (2025-12-31)
    // ========================================
    // NOTE: 既存コンテンツで ID 4-9 を使用している場合は、
    // データマイグレーションまたはレジストリに再度追加する必要があります
  } catch (e) {
    // ignore in environments where require isn't resolved at module load
    // registry can be populated later
    // console.warn('ProblemTypeRegistry defaults not registered', e);
  }
}

export default { registerProblemType, getProblemTypeView, getProblemTypeEdit, registerDefaults };
