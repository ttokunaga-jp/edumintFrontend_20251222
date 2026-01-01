# ProblemViewEditPage Related Scripts

This document contains the full source code of scripts related to the `ProblemViewEditPage`.

## File: `src/pages/ProblemViewEditPage.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useExamDetail, useExamEditor } from '@/features/content';
import { PreviewEditToggle } from '../components/page/ProblemViewEditPage/PreviewEditToggle';
import { ProblemMetaBlock } from '../components/page/ProblemViewEditPage/ProblemMetaBlock';
import { QuestionBlock } from '../components/page/ProblemViewEditPage/QuestionBlock';
import { SubQuestionBlock } from '../components/page/ProblemViewEditPage/SubQuestionBlock';
import { ActionBar } from '../components/page/ProblemViewEditPage/ActionBar';
import { ProblemEditor } from '../components/page/ProblemViewEditPage/ProblemEditor';
import { useServiceHealthContext } from '../contexts/ServiceHealthContext';
import { ContextHealthAlert } from '../components/common/ContextHealthAlert';

export interface ProblemViewEditPageProps {
  user: any;
  problemId: string;
  onNavigate: (page: any, problemId?: string) => void;
  onLogout: () => void;
  shouldStartInEditMode?: boolean;
  initialViewMode?: string;
  hasViewedAnswerAd?: boolean;
  onAnswerAdViewed?: () => void;
  hasViewedQuestionAd?: boolean;
  onQuestionAdViewed?: () => void;
}

export default function ProblemViewEditPage(props: ProblemViewEditPageProps) {
  const { id: paramId } = useParams<{ id: string }>();
  const id = props.problemId || paramId;
  const { exam, loading, error } = useExamDetail(id!);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExam, setEditedExam] = useState<any>(null);
  const { updateExam, isSaving } = useExamEditor();

  const { health, shouldDisableCTA } = useServiceHealthContext();
  const isCommunityDisabled = shouldDisableCTA(['community']);
  const isShareDisabled = shouldDisableCTA(['notifications']);

  useEffect(() => {
    if (exam) {
      setEditedExam(JSON.parse(JSON.stringify(exam)));
    }
  }, [exam]);

  if (loading) return <div>Loading...</div>;
  if (error || !exam) return <div>Error loading exam.</div>;

  const handleSave = async () => {
    await updateExam(id!, editedExam);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedExam(JSON.parse(JSON.stringify(exam)));
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <PreviewEditToggle
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isEditMode ? (
              <ProblemEditor
                exam={editedExam}
                onChange={setEditedExam}
              />
            ) : (
              <div className="space-y-8">
                {exam.questions.map((q: any) => (
                  <div key={q.id} className="space-y-6">
                    <QuestionBlock
                      questionNumber={q.question_number}
                      content={q.question_content}
                      format={q.question_format as 0 | 1}
                    />
                    <div className="pl-8 space-y-4">
                      {q.sub_questions.map((sq: any) => (
                        <SubQuestionBlock
                          key={sq.id}
                          subQuestionNumber={sq.sub_question_number}
                          questionTypeId={sq.question_type_id}
                          questionContent={sq.question_content}
                          questionFormat={sq.question_format as 0 | 1}
                          answerContent={sq.answer_content}
                          answerFormat={sq.answer_format as 0 | 1}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-4">
            {(health.community === 'degraded' || health.community === 'outage' || health.community === 'maintenance') && (
              <ContextHealthAlert
                category="コミュニティ機能"
                status={health.community}
                message={
                  health.community === 'degraded'
                    ? '現在、いいね・コメント機能に遅延が発生しています。'
                    : health.community === 'maintenance'
                      ? 'コミュニティ機能のメンテナンスを実施しています。'
                      : 'コミュニティ機能に障害が発生しています。'
                }
                disableCTA={true}
              />
            )}

            <ProblemMetaBlock
              exam={editedExam || exam}
              isOwner={true}
              onLike={() => { }}
              onDislike={() => { }}
              onBookmark={() => { }}
              onShare={() => { }}
              onReport={() => { }}
              onExportPDF={() => { }}
              disableCommunityActions={isCommunityDisabled}
              disableShareAction={isShareDisabled}
            />

            {(health.notifications === 'outage' || health.notifications === 'maintenance') && (
              <ContextHealthAlert
                category="通知・お知らせ"
                status={health.notifications}
                message={
                  health.notifications === 'outage'
                    ? '通知機能が停止しているため、通知が送信されません。'
                    : '通知機能のメンテナンスを実施しています。'
                }
              />
            )}
          </div>
        </div>
      </div>

      <ActionBar
        isEditing={isEditMode}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </div>
  );
}
```

## File: `src/stories/ProblemViewEditPage.stories.tsx`

```tsx
// @ts-nocheck
import type { Meta, StoryObj } from '@storybook/react';
import { ProblemViewEditPage } from '@/pages/ProblemViewEditPage';
import { ServiceHealthProvider } from '@/contexts/ServiceHealthContext';

const mockExam = {
  id: '1',
  examName: '微分積分学の基礎問題',
  subjectName: '数学',
  universityName: '東京大学',
  facultyName: '理学部',
  viewCount: 1234,
  goodCount: 567,
  badCount: 12,
  commentCount: 89,
  bookmarkCount: 123,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  userName: '田中太郎',
  questions: [],
};

const meta: Meta<typeof ProblemViewEditPage> = {
  title: 'Pages/ProblemViewEditPage',
  component: ProblemViewEditPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ServiceHealthProvider>
        <Story />
      </ServiceHealthProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ProblemViewEditPage>;

export const Default: Story = {
  args: {
    problemId: '1',
    onNavigate: () => { },
    onLogout: () => { },
  },
};
```

## File: `src/components/page/ProblemViewEditPage/ActionBar.tsx`

```tsx
import React from 'react';
import { Button } from '@/components/primitives/button';
import { Save, X, RotateCcw } from 'lucide-react';

export interface ActionBarProps {
    isEditing: boolean;
    onSave: () => void;
    onCancel: () => void;
    onReset?: () => void;
    isSaving?: boolean;
}

export function ActionBar({
    isEditing,
    onSave,
    onCancel,
    onReset,
    isSaving = false,
}: ActionBarProps) {
    if (!isEditing) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    編集モード：変更内容は「保存」するまで反映されません。
                </div>
                <div className="flex gap-3">
                    {onReset && (
                        <Button variant="outline" onClick={onReset} disabled={isSaving}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            元に戻す
                        </Button>
                    )}
                    <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        キャンセル
                    </Button>
                    <Button onClick={onSave} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? '保存中...' : '変更を保存'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
```

## File: `src/components/page/ProblemViewEditPage/AnswerBlock.tsx`

```tsx
// @ts-nocheck
import { useState } from 'react';
import { FileCode, FileText, Edit, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';

export type AnswerBlockProps = {
  subQuestionNumber: number;
  answerContent: string;
  answerFormat: 0 | 1; // 0: markdown, 1: latex
  explanation?: string;
  explanationFormat?: 0 | 1;
  isLocked?: boolean; // 広告視聴前などでロックされているか
  canEdit?: boolean;
  canSwitchFormat?: boolean;
  defaultExpanded?: boolean;
  onAnswerChange?: (content: string) => void;
  onExplanationChange?: (content: string) => void;
  onFormatChange?: (type: 'answer' | 'explanation', format: 0 | 1) => void;
  onUnlock?: () => void;
  className?: string;
};

export function AnswerBlock({
  subQuestionNumber,
  answerContent,
  answerFormat,
  explanation,
  explanationFormat = 0,
  isLocked = false,
  canEdit = false,
  canSwitchFormat = false,
  defaultExpanded = false,
  onAnswerChange,
  onExplanationChange,
  onFormatChange,
  onUnlock,
  className = '',
}: AnswerBlockProps) {
  const [currentAnswerFormat, setCurrentAnswerFormat] = useState<0 | 1>(answerFormat);
  const [currentExplanationFormat, setCurrentExplanationFormat] = useState<0 | 1>(explanationFormat);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [editAnswerContent, setEditAnswerContent] = useState(answerContent);
  const [editExplanationContent, setEditExplanationContent] = useState(explanation || '');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleAnswerFormatToggle = () => {
    const newFormat = currentAnswerFormat === 0 ? 1 : 0;
    setCurrentAnswerFormat(newFormat);
    onFormatChange?.('answer', newFormat);
  };

  const handleExplanationFormatToggle = () => {
    const newFormat = currentExplanationFormat === 0 ? 1 : 0;
    setCurrentExplanationFormat(newFormat);
    onFormatChange?.('explanation', newFormat);
  };

  const handleAnswerSave = () => {
    onAnswerChange?.(editAnswerContent);
    setIsEditingAnswer(false);
  };

  const handleExplanationSave = () => {
    onExplanationChange?.(editExplanationContent);
    setIsEditingExplanation(false);
  };

  if (isLocked) {
    return (
      <div className={`bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200 ${className}`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-amber-900 mb-1">解答を見るには</h4>
            <p className="text-sm text-amber-700">
              30秒の動画広告を視聴してください
            </p>
          </div>
          {onUnlock && (
            <button
              onClick={onUnlock}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              広告を見て解答を表示
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 rounded-lg border border-blue-200 overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-blue-700" />
          ) : (
            <ChevronDown className="w-4 h-4 text-blue-700" />
          )}
          <span className="font-medium text-blue-900">
            ({subQuestionNumber}) の解答を{isExpanded ? '隠す' : '表示'}
          </span>
        </div>
        <span className="text-xs text-blue-600">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {/* 解答コンテンツ */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* 解答 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">解答</span>
              <div className="flex gap-2">
                {canSwitchFormat && (
                  <button
                    onClick={handleAnswerFormatToggle}
                    className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors border border-gray-200"
                  >
                    {currentAnswerFormat === 0 ? (
                      <>
                        <FileText className="w-3 h-3" />
                        <span className="hidden sm:inline">MD</span>
                      </>
                    ) : (
                      <>
                        <FileCode className="w-3 h-3" />
                        <span className="hidden sm:inline">LaTeX</span>
                      </>
                    )}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => setIsEditingAnswer(true)}
                    className="p-1 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                    title="編集"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {isEditingAnswer ? (
              <div className="space-y-3">
                <textarea
                  value={editAnswerContent}
                  onChange={(e) => setEditAnswerContent(e.target.value)}
                  className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={currentAnswerFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAnswerSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditAnswerContent(answerContent);
                      setIsEditingAnswer(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-3">
                {currentAnswerFormat === 0 ? (
                  <MarkdownBlock content={answerContent} className="text-sm" />
                ) : (
                  <LatexBlock content={answerContent} displayMode={false} className="text-sm" />
                )}
              </div>
            )}
          </div>

          {/* 解説 */}
          {explanation && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">解説</span>
                <div className="flex gap-2">
                  {canSwitchFormat && (
                    <button
                      onClick={handleExplanationFormatToggle}
                      className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors border border-gray-200"
                    >
                      {currentExplanationFormat === 0 ? (
                        <>
                          <FileText className="w-3 h-3" />
                          <span className="hidden sm:inline">MD</span>
                        </>
                      ) : (
                        <>
                          <FileCode className="w-3 h-3" />
                          <span className="hidden sm:inline">LaTeX</span>
                        </>
                      )}
                    </button>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => setIsEditingExplanation(true)}
                      className="p-1 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                      title="編集"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {isEditingExplanation ? (
                <div className="space-y-3">
                  <textarea
                    value={editExplanationContent}
                    onChange={(e) => setEditExplanationContent(e.target.value)}
                    className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={currentExplanationFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleExplanationSave}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditExplanationContent(explanation);
                        setIsEditingExplanation(false);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-3">
                  {currentExplanationFormat === 0 ? (
                    <MarkdownBlock content={explanation} className="text-sm" />
                  ) : (
                    <LatexBlock content={explanation} displayMode={false} className="text-sm" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## File: `src/components/page/ProblemViewEditPage/EditHistoryBlock.tsx`

```tsx
// @ts-nocheck
import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Badge } from '@/components/primitives/badge';
import { formatDate } from '@/shared/utils';

export interface EditHistory {
  id: string;
  version: number;
  changedBy: string;
  changedAt: string;
  changes: Record<string, any>;
  description?: string;
}

export interface EditHistoryBlockProps {
  history: EditHistory[];
  currentVersion: number;
  onRollback?: (version: number) => void;
  className?: string;
}

export default function EditHistoryBlock({
  history,
  currentVersion,
  onRollback,
  className = '',
}: EditHistoryBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedHistory = showAll ? history : history.slice(0, 5);

  const getChangeDescription = (changes: Record<string, any>): string => {
    const changeKeys = Object.keys(changes);
    if (changeKeys.length === 0) return '変更なし';
    if (changeKeys.length === 1) return `${changeKeys[0]}を変更`;
    return `${changeKeys.length}箇所を変更`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="size-5 text-gray-500" />
            <CardTitle className="text-lg">編集履歴</CardTitle>
            <Badge variant="outline">v{currentVersion}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1"
          >
            <span>{isExpanded ? '閉じる' : '表示'}</span>
            {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {displayedHistory.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              編集履歴はありません
            </div>
          ) : (
            <>
              {displayedHistory.map((item) => (
                <div
                  key={item.id}
                  className={`border border-gray-200 rounded-lg p-4 ${item.version === currentVersion ? 'bg-indigo-50 border-indigo-300' : 'bg-white'
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={item.version === currentVersion ? 'default' : 'secondary'}>
                        v{item.version}
                      </Badge>
                      {item.version === currentVersion && (
                        <Badge variant="default">現在のバージョン</Badge>
                      )}
                    </div>
                    {onRollback && item.version !== currentVersion && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRollback(item.version)}
                        className="flex items-center space-x-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>復元</span>
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item.description || getChangeDescription(item.changes)}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>編集者: {item.changedBy}</span>
                      <span>•</span>
                      <span>{formatDate(item.changedAt)}</span>
                    </div>
                  </div>

                  {/* 変更の詳細 */}
                  {Object.keys(item.changes).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 space-y-1">
                        {Object.entries(item.changes).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex items-start space-x-2">
                            <span className="font-medium min-w-[80px]">{key}:</span>
                            <span className="flex-1 truncate">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                          </div>
                        ))}
                        {Object.keys(item.changes).length > 3 && (
                          <div className="text-gray-400 italic">
                            他 {Object.keys(item.changes).length - 3} 件の変更...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* もっと見るボタン */}
              {history.length > 5 && (
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? '一部を表示' : `すべて表示 (${history.length}件)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export { EditHistoryBlock };
```

## File: `src/components/page/ProblemViewEditPage/PreviewEditToggle.tsx`

```tsx
import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { Button } from '@/components/primitives/button';

export interface PreviewEditToggleProps {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
}

export function PreviewEditToggle({ isEditMode, setIsEditMode }: PreviewEditToggleProps) {
  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
      <Button
        variant={!isEditMode ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setIsEditMode(false)}
        className="flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        プレビュー
      </Button>
      <Button
        variant={isEditMode ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setIsEditMode(true)}
        className="flex items-center gap-2"
      >
        <Edit className="w-4 h-4" />
        編集モード
      </Button>
    </div>
  );
}
```

## File: `src/components/page/ProblemViewEditPage/ProblemEditor.tsx`

```tsx
import React, { Suspense, useEffect } from 'react';
import { QuestionBlock } from './QuestionBlock';
import { Button } from '@/components/primitives/button';
import { Plus } from 'lucide-react';
import ProblemTypeRegistry from '@/components/problemTypes/ProblemTypeRegistry';
import { ProblemTypeEditProps } from '@/types/problemTypes';

export interface ProblemEditorProps {
    exam: any;
    onChange: (exam: any) => void;
}

const editComponentLoaders: Record<number, React.LazyExoticComponent<React.ComponentType<ProblemTypeEditProps>>> = {
  // Types 1,4,5,6,7,8,9 use the consolidated NormalSubQuestionView
  1: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  2: React.lazy(() => import('@/components/problemTypes/MultipleChoiceEdit')),
  4: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  5: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  6: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  7: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  8: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
  9: React.lazy(() => import('@/components/problemTypes/NormalSubQuestionView').then(m => ({ default: m.NormalSubQuestionView }))),
};

const questionTypeLabels: Record<number, string> = {
    1: '記述式',
    2: '選択式',
    3: '穴埋め',
    4: '穴埋め',
    5: '正誤',
    6: '数値計算',
    7: '証明',
    8: 'プログラミング',
    9: 'コード読解',
};

const FallbackEdit = ({ questionContent, answerContent, onQuestionChange, onAnswerChange }: ProblemTypeEditProps) => (
    <div className="space-y-3 rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm">
        <div className="text-gray-600">専用の編集フォームが未登録です。暫定フォームを使用します。</div>
        <label className="block text-xs font-medium text-gray-700">問題文</label>
        <textarea
            value={questionContent}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="小問の問題文を入力..."
        />
        <label className="block text-xs font-medium text-gray-700">解答</label>
        <textarea
            value={answerContent ?? ''}
            onChange={(e) => onAnswerChange?.(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            placeholder="解答やメモを入力..."
        />
    </div>
);

export function ProblemEditor({ exam, onChange }: ProblemEditorProps) {
    const safeExam = exam ?? { questions: [] };
    const questions = Array.isArray(safeExam.questions) ? safeExam.questions : [];

    useEffect(() => {
        ProblemTypeRegistry.registerDefaults();
    }, []);

    const updateExam = (mutator: (draft: any) => void) => {
        const draft = { ...safeExam, questions: [...questions] };
        mutator(draft);
        onChange(draft);
    };

    const updateQuestion = (qIdx: number, mutator: (question: any) => void) => {
        updateExam((draft) => {
            if (!draft.questions[qIdx]) return;
            const question = { ...draft.questions[qIdx] };
            question.sub_questions = Array.isArray(question.sub_questions) ? [...question.sub_questions] : [];
            mutator(question);
            draft.questions[qIdx] = question;
        });
    };

    const updateSubQuestion = (qIdx: number, sqIdx: number, mutator: (sub: any) => void) => {
        updateQuestion(qIdx, (question) => {
            if (!question.sub_questions[sqIdx]) return;
            const nextSub = { ...question.sub_questions[sqIdx] };
            mutator(nextSub);
            question.sub_questions[sqIdx] = nextSub;
        });
    };

    const handleQuestionChange = (qIdx: number, content: string) => {
        updateQuestion(qIdx, (question) => {
            question.question_content = content;
        });
    };

    const handleSubQuestionContentChange = (qIdx: number, sqIdx: number, content: string) => {
        updateSubQuestion(qIdx, sqIdx, (sub) => {
            sub.question_content = content;
            sub.sub_question_content = content;
        });
    };

    const handleSubQuestionAnswerChange = (qIdx: number, sqIdx: number, content: string) => {
        updateSubQuestion(qIdx, sqIdx, (sub) => {
            sub.answer_content = content;
        });
    };

    const handleSubQuestionFormatChange = (qIdx: number, sqIdx: number, field: 'question' | 'answer', format: 0 | 1) => {
        updateSubQuestion(qIdx, sqIdx, (sub) => {
            if (field === 'question') {
                sub.question_format = format;
                sub.sub_question_format = format;
            } else {
                sub.answer_format = format;
            }
        });
    };

    const handleSubQuestionOptionsChange = (
        qIdx: number,
        sqIdx: number,
        options: Array<{ id: string; content: string; isCorrect: boolean }>,
    ) => {
        updateSubQuestion(qIdx, sqIdx, (sub) => {
            sub.options = options;
        });
    };

    const addQuestion = () => {
        const newQuestion = {
            id: `new-q-${Date.now()}`,
            question_number: questions.length + 1,
            question_content: '新しい大問',
            question_format: 0,
            sub_questions: [] as any[],
        };
        onChange({ ...safeExam, questions: [...questions, newQuestion] });
    };

    const addSubQuestion = (qIdx: number) => {
        updateQuestion(qIdx, (question) => {
            const subQuestions = question.sub_questions as any[];
            const nextNumber = subQuestions.length + 1;
            subQuestions.push({
                id: `new-sq-${Date.now()}`,
                sub_question_number: nextNumber,
                question_type_id: 1,
                sub_question_type_id: 1,
                question_content: '新しい小問',
                sub_question_content: '新しい小問',
                question_format: 0,
                answer_content: '',
                answer_format: 0,
                options: [],
            });
        });
    };

    const renderSubQuestionEditor = (sq: any, qIdx: number, sqIdx: number) => {
        const typeId = sq.sub_question_type_id ?? sq.question_type_id ?? sq.questionTypeId ?? 1;
        const EditComponent = editComponentLoaders[typeId] ?? ProblemTypeRegistry.getProblemTypeEdit(typeId);
        const normalizedProps: ProblemTypeEditProps = {
            subQuestionNumber: sq.sub_question_number ?? sq.subQuestionNumber ?? sqIdx + 1,
            questionContent: sq.sub_question_content ?? sq.question_content ?? '',
            questionFormat: (sq.sub_question_format ?? sq.question_format ?? 0) as 0 | 1,
            answerContent: sq.answer_content ?? '',
            answerFormat: (sq.answer_format ?? 0) as 0 | 1,
            options: sq.options ?? [],
            keywords: sq.keywords ?? [],
            onQuestionChange: (content) => handleSubQuestionContentChange(qIdx, sqIdx, content),
            onAnswerChange: (content) => handleSubQuestionAnswerChange(qIdx, sqIdx, content),
            onOptionsChange: (opts) => handleSubQuestionOptionsChange(qIdx, sqIdx, opts),
            onFormatChange: (field, format) => handleSubQuestionFormatChange(qIdx, sqIdx, field, format),
        };

        const label = questionTypeLabels[typeId] ?? '記述式';
        const content = EditComponent ? <EditComponent {...normalizedProps} /> : <FallbackEdit {...normalizedProps} />;

        return (
            <div key={sq.id || sqIdx} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm">
                        ({normalizedProps.subQuestionNumber})
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{label}</span>
                </div>
                <Suspense fallback={<div className="rounded-md bg-gray-50 p-4 text-sm text-gray-500">編集UIを読み込み中...</div>}>
                    {content}
                </Suspense>
            </div>
        );
    };

    return (
        <div className="space-y-12">
            {questions.map((q: any, qIdx: number) => (
                <div key={q.id || qIdx} className="space-y-6">
                    <QuestionBlock
                        questionNumber={q.question_number ?? q.questionNumber ?? qIdx + 1}
                        content={q.question_content ?? ''}
                        format={(q.question_format ?? 0) as 0 | 1}
                        canEdit={true}
                        onContentChange={(content) => handleQuestionChange(qIdx, content)}
                    />
                    <div className="space-y-4 pl-8">
                        {(q.sub_questions || []).map((sq: any, sqIdx: number) => renderSubQuestionEditor(sq, qIdx, sqIdx))}
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 border-dashed"
                            onClick={() => addSubQuestion(qIdx)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            小問を追加
                        </Button>
                    </div>
                </div>
            ))}

            <Button
                variant="ghost"
                className="w-full rounded-xl border-2 border-dashed border-gray-200 py-8 text-gray-500 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                onClick={addQuestion}
            >
                <Plus className="mr-2 h-6 w-6" />
                大問を追加
            </Button>
        </div>
    );
}
```

## File: `src/components/page/ProblemViewEditPage/ProblemMetaBlock.tsx`

```tsx
// @ts-nocheck
import { useState } from 'react';
import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  Bookmark,
  FileText,
  Flag,
  Calendar,
  School,
  BookOpen,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Card, CardContent } from '@/components/primitives/card';
import { formatNumber, formatDate, getDifficultyLabel, getDifficultyColor } from '@/shared/utils';
import type { Exam } from '@/types';

export interface ProblemMetaBlockProps {
  exam: Exam;
  isOwner: boolean;
  onLike: () => void;
  onDislike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onReport: () => void;
  onExportPDF: () => void;
  isBookmarked?: boolean;
  className?: string;
  disableCommunityActions?: boolean; // Disable like/dislike/bookmark/share
  disableShareAction?: boolean; // Disable only share
}

export default function ProblemMetaBlock({
  exam,
  isOwner,
  onLike,
  onDislike,
  onBookmark,
  onShare,
  onReport,
  onExportPDF,
  isBookmarked = false,
  className = '',
  disableCommunityActions = false,
  disableShareAction = false,
}: ProblemMetaBlockProps) {
  const [isSticky, setIsSticky] = useState(false);

  const metaItems = [
    {
      icon: School,
      label: '大学',
      value: exam.universityName || exam.school,
    },
    {
      icon: BookOpen,
      label: '学部',
      value: exam.facultyName || '-',
    },
    {
      icon: BookOpen,
      label: '科目',
      value: exam.subjectName,
    },
    {
      icon: UserIcon,
      label: '教授',
      value: exam.teacherName || '-',
    },
    {
      icon: Calendar,
      label: '年度',
      value: `${exam.examYear}年`,
    },
  ];

  const stats = [
    {
      icon: Eye,
      label: '閲覧数',
      value: formatNumber(exam.viewCount),
      color: 'text-blue-600',
    },
    {
      icon: ThumbsUp,
      label: 'いいね',
      value: formatNumber(exam.goodCount),
      color: 'text-green-600',
    },
    {
      icon: ThumbsDown,
      label: 'バッド',
      value: formatNumber(exam.badCount),
      color: 'text-red-600',
    },
    {
      icon: MessageCircle,
      label: 'コメント',
      value: formatNumber(exam.commentCount),
      color: 'text-purple-600',
    },
  ];

  return (
    <Card className={`${className} ${isSticky ? 'md:sticky md:top-20' : ''}`}>
      <CardContent className="p-6 space-y-6">
        {/* タイトルとバッジ */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">{exam.examName}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge className={getDifficultyColor(0)}>
              {getDifficultyLabel(0)}
            </Badge>
            <Badge variant="outline">
              {exam.majorType === 0 ? '理系' : '文系'}
            </Badge>
            {exam.isPublic ? (
              <Badge variant="default">公開</Badge>
            ) : (
              <Badge variant="secondary">非公開</Badge>
            )}
            {isOwner && <Badge variant="secondary">自分の投稿</Badge>}
          </div>
        </div>

        {/* メタ情報 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-200">
          {metaItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <item.icon className="size-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-medium text-gray-900 truncate">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-start space-x-2">
            <UserIcon className="size-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">投稿者</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {exam.userName}
              </div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Calendar className="size-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">投稿日</div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(exam.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className={`size-5 mx-auto mb-1 ${stat.color}`} />
              <div className="text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* アクションボタン */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          {/* インタラクションボタン */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={exam.userLiked ? 'default' : 'outline'}
              size="sm"
              onClick={onLike}
              disabled={disableCommunityActions}
              className="flex items-center justify-center space-x-2"
            >
              <ThumbsUp className="size-4" />
              <span>{exam.userLiked ? 'いいね済み' : 'いいね'}</span>
            </Button>
            <Button
              variant={exam.userDisliked ? 'destructive' : 'outline'}
              size="sm"
              onClick={onDislike}
              disabled={disableCommunityActions}
              className="flex items-center justify-center space-x-2"
            >
              <ThumbsDown className="size-4" />
              <span>{exam.userDisliked ? 'バッド済み' : 'バッド'}</span>
            </Button>
          </div>

          {/* ユーティリティボタン */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={isBookmarked ? 'default' : 'outline'}
              size="sm"
              onClick={onBookmark}
              disabled={disableCommunityActions}
              className="flex items-center justify-center space-x-2"
            >
              <Bookmark className="size-4" />
              <span>{isBookmarked ? 'ブックマーク済み' : 'ブックマーク'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              disabled={disableCommunityActions || disableShareAction}
              className="flex items-center justify-center space-x-2"
            >
              <Share2 className="size-4" />
              <span>共有</span>
            </Button>
          </div>

          {/* エクスポート・通報ボタン */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              className="flex items-center justify-center space-x-2"
            >
              <FileText className="size-4" />
              <span>PDF出力</span>
            </Button>
            {!isOwner && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReport}
                className="flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Flag className="size-4" />
                <span>報告</span>
              </Button>
            )}
          </div>
        </div>

        {/* 更新日時 */}
        <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          最終更新: {formatDate(exam.updatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}

export { ProblemMetaBlock };
```

## File: `src/components/page/ProblemViewEditPage/QuestionBlock.tsx`

```tsx
// @ts-nocheck
import { useState } from 'react';
import { FileCode, FileText, Edit, Trash2, Plus } from 'lucide-react';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';

export type QuestionBlockProps = {
  questionNumber: number;
  content: string;
  format: 0 | 1; // 0: markdown, 1: latex
  difficulty?: number; // 1: 基礎, 2: 応用, 3: 発展
  keywords?: Array<{ id: string; keyword: string }>;
  canEdit?: boolean;
  canSwitchFormat?: boolean;
  onContentChange?: (content: string) => void;
  onFormatChange?: (format: 0 | 1) => void;
  onKeywordAdd?: (keyword: string) => void;
  onKeywordRemove?: (keywordId: string) => void;
  onDelete?: () => void;
  className?: string;
};

const difficultyLabels = {
  1: { label: '基礎', color: 'bg-green-100 text-green-700' },
  2: { label: '応用', color: 'bg-yellow-100 text-yellow-700' },
  3: { label: '発展', color: 'bg-red-100 text-red-700' },
};

export function QuestionBlock({
  questionNumber,
  content,
  format,
  difficulty,
  keywords = [],
  canEdit = false,
  canSwitchFormat = false,
  onContentChange,
  onFormatChange,
  onKeywordAdd,
  onKeywordRemove,
  onDelete,
  className = '',
}: QuestionBlockProps) {
  const [currentFormat, setCurrentFormat] = useState<0 | 1>(format);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [newKeyword, setNewKeyword] = useState('');

  const handleFormatToggle = () => {
    const newFormat = currentFormat === 0 ? 1 : 0;
    setCurrentFormat(newFormat);
    onFormatChange?.(newFormat);
  };

  const handleSave = () => {
    onContentChange?.(editContent);
    setIsEditing(false);
  };

  const handleKeywordAdd = () => {
    if (newKeyword.trim() && onKeywordAdd) {
      onKeywordAdd(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* 問題番号 */}
            <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
              {questionNumber}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-gray-900">大問{questionNumber}</h3>
                {difficulty && (
                  <span className={`px-2 py-0.5 rounded text-xs ${difficultyLabels[difficulty as keyof typeof difficultyLabels].color}`}>
                    {difficultyLabels[difficulty as keyof typeof difficultyLabels].label}
                  </span>
                )}
              </div>

              {/* コンテンツ */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={currentFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setEditContent(content);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {canSwitchFormat && (
                    <button
                      onClick={handleFormatToggle}
                      className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors z-10 border border-gray-200"
                    >
                      {currentFormat === 0 ? (
                        <>
                          <FileText className="w-4 h-4" />
                          <span className="hidden sm:inline">Markdown</span>
                        </>
                      ) : (
                        <>
                          <FileCode className="w-4 h-4" />
                          <span className="hidden sm:inline">LaTeX</span>
                        </>
                      )}
                    </button>
                  )}

                  <div className={canSwitchFormat ? 'pt-10' : ''}>
                    {currentFormat === 0 ? (
                      <MarkdownBlock content={content} />
                    ) : (
                      <LatexBlock content={content} displayMode={true} />
                    )}
                  </div>
                </div>
              )}

              {/* キーワード */}
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                    >
                      {keyword.keyword}
                      {canEdit && onKeywordRemove && (
                        <button
                          onClick={() => onKeywordRemove(keyword.id)}
                          className="hover:bg-indigo-200 rounded-full p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* キーワード追加 */}
              {canEdit && onKeywordAdd && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
                    placeholder="キーワードを追加..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={handleKeywordAdd}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 編集/削除ボタン */}
          {canEdit && (
            <div className="flex gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="編集"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## File: `src/components/page/ProblemViewEditPage/SubQuestionBlock.tsx`

```tsx
// @ts-nocheck
import { useState } from 'react';
import { FileCode, FileText, Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';
import ProblemTypeRegistry from '@/components/problemTypes/ProblemTypeRegistry';
import { ProblemTypeViewProps } from '@/types/problemTypes';

export type SubQuestionBlockProps = {
  subQuestionNumber: number;
  questionTypeId: number;
  questionContent: string;
  questionFormat: 0 | 1; // 0: markdown, 1: latex
  answerContent?: string;
  answerFormat?: 0 | 1;
  keywords?: Array<{ id: string; keyword: string }>;
  options?: Array<{ id: string; content: string; isCorrect: boolean }>;
  canEdit?: boolean;
  canSwitchFormat?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onAnswerChange?: (content: string) => void;
  onFormatChange?: (type: 'question' | 'answer', format: 0 | 1) => void;
  onKeywordAdd?: (keyword: string) => void;
  onKeywordRemove?: (keywordId: string) => void;
  onDelete?: () => void;
  className?: string;
};

const questionTypeLabels: Record<number, string> = {
  1: '記述式',
  2: '選択式',
  3: '穴埋め',
  4: '論述式',
  5: '証明問題',
  6: '数値計算式',
};

export function SubQuestionBlock({
  subQuestionNumber,
  questionTypeId,
  questionContent,
  questionFormat,
  answerContent,
  answerFormat = 0,
  keywords = [],
  options = [],
  canEdit = false,
  canSwitchFormat = false,
  showAnswer = false,
  onQuestionChange,
  onAnswerChange,
  onFormatChange,
  onKeywordAdd,
  onKeywordRemove,
  onDelete,
  className = '',
}: SubQuestionBlockProps) {
  const [currentQuestionFormat, setCurrentQuestionFormat] = useState<0 | 1>(questionFormat);
  const [currentAnswerFormat, setCurrentAnswerFormat] = useState<0 | 1>(answerFormat);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [editQuestionContent, setEditQuestionContent] = useState(questionContent);
  const [editAnswerContent, setEditAnswerContent] = useState(answerContent || '');
  const [newKeyword, setNewKeyword] = useState('');
  const [answerExpanded, setAnswerExpanded] = useState(showAnswer);

  const handleQuestionFormatToggle = () => {
    const newFormat = currentQuestionFormat === 0 ? 1 : 0;
    setCurrentQuestionFormat(newFormat);
    onFormatChange?.('question', newFormat);
  };

  const handleAnswerFormatToggle = () => {
    const newFormat = currentAnswerFormat === 0 ? 1 : 0;
    setCurrentAnswerFormat(newFormat);
    onFormatChange?.('answer', newFormat);
  };

  const handleQuestionSave = () => {
    onQuestionChange?.(editQuestionContent);
    setIsEditingQuestion(false);
  };

  const handleAnswerSave = () => {
    onAnswerChange?.(editAnswerContent);
    setIsEditingAnswer(false);
  };

  const handleKeywordAdd = () => {
    if (newKeyword.trim() && onKeywordAdd) {
      onKeywordAdd(newKeyword.trim());
      setNewKeyword('');
    }
  };

  return (
    <div className={`border-b border-gray-100 last:border-b-0 ${className}`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm">
              ({subQuestionNumber})
            </div>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
              {questionTypeLabels[questionTypeId] || '記述式'}
            </span>
          </div>

          {/* 編集/削除ボタン */}
          {canEdit && (
            <div className="flex gap-2">
              {!isEditingQuestion && (
                <button
                  onClick={() => setIsEditingQuestion(true)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="編集"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="削除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* 問題文 */}
        <div className="mb-4">
          {isEditingQuestion ? (
            <div className="space-y-3">
              <textarea
                value={editQuestionContent}
                onChange={(e) => setEditQuestionContent(e.target.value)}
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={currentQuestionFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleQuestionSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  保存
                </button>
                <button
                  onClick={() => {
                    setEditQuestionContent(questionContent);
                    setIsEditingQuestion(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  キャンセル
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {canSwitchFormat && (
                <button
                  onClick={handleQuestionFormatToggle}
                  className="absolute top-0 right-0 flex items-center gap-2 px-2 py-1 bg-white hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors z-10 border border-gray-200"
                >
                  {currentQuestionFormat === 0 ? (
                    <>
                      <FileText className="w-3 h-3" />
                      <span className="hidden sm:inline">MD</span>
                    </>
                  ) : (
                    <>
                      <FileCode className="w-3 h-3" />
                      <span className="hidden sm:inline">LaTeX</span>
                    </>
                  )}
                </button>
              )}

              <div className={canSwitchFormat ? 'pt-8' : ''}>
                {/* Delegate rendering to the problem type view component */}
                {(() => {
                  try {
                    ProblemTypeRegistry.registerDefaults();
                    const Comp = ProblemTypeRegistry.getProblemTypeView
                      ? ProblemTypeRegistry.getProblemTypeView(questionTypeId)
                      : null;
                    if (Comp) {
                      const viewProps: ProblemTypeViewProps = {
                        subQuestionNumber,
                        questionContent: questionContent,
                        questionFormat: currentQuestionFormat,
                        answerContent,
                        answerFormat: currentAnswerFormat,
                        options,
                        keywords,
                      };
                      return <Comp {...viewProps} />;
                    }
                  } catch (e) {
                    // fall back to default rendering
                  }

                  return currentQuestionFormat === 0 ? (
                    <MarkdownBlock content={questionContent} className="text-sm" />
                  ) : (
                    <LatexBlock content={questionContent} displayMode={false} className="text-sm" />
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* 選択肢（選択式の場合） */}
        {questionTypeId === 2 && options.length > 0 && (
          <div className="mb-4 space-y-2">
            {options.map((option, index) => (
              <div
                key={option.id}
                className={`p-3 rounded-lg border ${option.isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white'
                  }`}
              >
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm text-gray-900">{option.content}</span>
                  {option.isCorrect && (
                    <span className="ml-auto px-2 py-0.5 bg-green-600 text-white rounded text-xs">
                      正解
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* キーワード */}
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map((keyword) => (
              <span
                key={keyword.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
              >
                {keyword.keyword}
                {canEdit && onKeywordRemove && (
                  <button
                    onClick={() => onKeywordRemove(keyword.id)}
                    className="hover:bg-indigo-200 rounded-full p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {/* キーワード追加 */}
        {canEdit && onKeywordAdd && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleKeywordAdd()}
              placeholder="キーワードを追加..."
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleKeywordAdd}
              className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 解答セクション */}
        {answerContent && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => setAnswerExpanded(!answerExpanded)}
              className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors mb-3"
            >
              {answerExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>解答を{answerExpanded ? '隠す' : '表示'}</span>
            </button>

            {answerExpanded && (
              <div className="bg-blue-50 rounded-lg p-4">
                {isEditingAnswer ? (
                  <div className="space-y-3">
                    <textarea
                      value={editAnswerContent}
                      onChange={(e) => setEditAnswerContent(e.target.value)}
                      className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder={currentAnswerFormat === 0 ? 'Markdown形式で入力...' : 'LaTeX形式で入力...'}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAnswerSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditAnswerContent(answerContent);
                          setIsEditingAnswer(false);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">解答</span>
                      <div className="flex gap-2">
                        {canSwitchFormat && (
                          <button
                            onClick={handleAnswerFormatToggle}
                            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors border border-gray-200"
                          >
                            {currentAnswerFormat === 0 ? (
                              <>
                                <FileText className="w-3 h-3" />
                                <span className="hidden sm:inline">MD</span>
                              </>
                            ) : (
                              <>
                                <FileCode className="w-3 h-3" />
                                <span className="hidden sm:inline">LaTeX</span>
                              </>
                            )}
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => setIsEditingAnswer(true)}
                            className="p-1 text-blue-700 hover:bg-blue-100 rounded transition-colors"
                            title="編集"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {currentAnswerFormat === 0 ? (
                      <MarkdownBlock content={answerContent} className="text-sm" />
                    ) : (
                      <LatexBlock content={answerContent} displayMode={false} className="text-sm" />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```
