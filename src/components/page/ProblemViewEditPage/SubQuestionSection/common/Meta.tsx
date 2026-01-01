import React from 'react';
import { SubQuestionMetaEdit } from '../../common/SubQuestionMetaEdit';
import { SubQuestionMetaView } from '../../common/SubQuestionMetaView';

export interface SubQuestionMetaProps {
  questionTypeId: number;
  questionTypeLabel: string;
  questionTypeOptions: Array<{ value: number; label: string }>;
  keywords: Array<{ id: string; keyword: string }>;
  canEdit?: boolean;
  onTypeChange?: (typeId: number) => void;
  onKeywordAdd?: (keyword: string) => void;
  onKeywordRemove?: (keywordId: string) => void;
}

/**
 * SubQuestionSection のメタ情報コンポーネント
 * 
 * 問題タイプ + キーワード管理
 */
export const SubQuestionMeta: React.FC<SubQuestionMetaProps> = ({
  questionTypeId,
  questionTypeLabel,
  questionTypeOptions,
  keywords,
  canEdit = false,
  onTypeChange,
  onKeywordAdd,
  onKeywordRemove,
}) => {
  if (canEdit) {
    return (
      <SubQuestionMetaEdit
        questionTypeId={questionTypeId}
        questionTypeOptions={questionTypeOptions}
        keywords={keywords}
        onTypeChange={onTypeChange}
        onKeywordAdd={onKeywordAdd}
        onKeywordRemove={onKeywordRemove}
      />
    );
  }

  return (
    <SubQuestionMetaView
      questionTypeLabel={questionTypeLabel}
      keywords={keywords}
    />
  );
};

export default SubQuestionMeta;
