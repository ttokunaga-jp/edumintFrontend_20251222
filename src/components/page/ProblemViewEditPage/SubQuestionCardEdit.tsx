import React, { Suspense } from 'react';
import { ProblemTypeEditProps } from '@/types/problemTypes';
import { SubQuestionMetaEdit } from './common/SubQuestionMetaEdit';
import ProblemTypeRegistry from '@/components/problemTypes/ProblemTypeRegistry';

type SubQuestionCardEditProps = {
  subQuestion: any;
  editComponent?: React.LazyExoticComponent<React.ComponentType<ProblemTypeEditProps>> | null;
  fallbackComponent?: React.ComponentType<ProblemTypeEditProps>;
  typeOptions: Array<{ value: number; label: string }>;
  onQuestionChange: (content: string) => void;
  onAnswerChange: (content: string) => void;
  onOptionsChange?: (options: Array<{ id: string; content: string; isCorrect: boolean }>) => void;
  onFormatChange?: (field: 'question' | 'answer', format: 0 | 1) => void;
  onKeywordAdd?: (kw: string) => void;
  onKeywordRemove?: (id: string) => void;
  onTypeChange?: (typeId: number) => void;
};

export const SubQuestionCardEdit: React.FC<SubQuestionCardEditProps> = ({
  subQuestion,
  editComponent,
  fallbackComponent,
  typeOptions,
  onQuestionChange,
  onAnswerChange,
  onOptionsChange,
  onFormatChange,
  onKeywordAdd,
  onKeywordRemove,
  onTypeChange,
}) => {
  const typeId = subQuestion.sub_question_type_id ?? subQuestion.question_type_id ?? subQuestion.questionTypeId ?? 1;
  const number = subQuestion.sub_question_number ?? subQuestion.subQuestionNumber ?? 1;
  const Comp = editComponent ?? ProblemTypeRegistry.getProblemTypeEdit(typeId);
  const Fallback = fallbackComponent;

  const normalizedProps: ProblemTypeEditProps = {
    subQuestionNumber: number,
    questionContent: subQuestion.sub_question_content ?? subQuestion.question_content ?? '',
    questionFormat: (subQuestion.sub_question_format ?? subQuestion.question_format ?? 0) as 0 | 1,
    answerContent: subQuestion.answer_content ?? '',
    answerFormat: (subQuestion.answer_format ?? 0) as 0 | 1,
    options: subQuestion.options ?? [],
    keywords: subQuestion.keywords ?? [],
    onQuestionChange,
    onAnswerChange,
    onOptionsChange,
    onFormatChange,
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-3 sm:gap-4 flex-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm">
          ({number})
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-900 text-sm font-medium">小問{number}</span>
          </div>
          <SubQuestionMetaEdit
            questionTypeId={typeId}
            questionTypeOptions={typeOptions}
            keywords={subQuestion.keywords ?? []}
            onTypeChange={onTypeChange}
            onKeywordAdd={onKeywordAdd}
            onKeywordRemove={onKeywordRemove}
          />
        </div>
      </div>
      <Suspense fallback={<div className="rounded-md bg-gray-50 p-4 text-sm text-gray-500">編集UIを読み込み中...</div>}>
        {Comp ? <Comp {...normalizedProps} /> : Fallback ? <Fallback {...normalizedProps} /> : null}
      </Suspense>
    </div>
  );
};
