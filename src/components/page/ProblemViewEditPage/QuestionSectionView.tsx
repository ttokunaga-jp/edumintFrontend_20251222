import React from 'react';
import { QuestionCardView } from './QuestionCardView';
import { SubQuestionCardView } from './SubQuestionCardView';

type QuestionSectionViewProps = {
  question: any;
};

export const QuestionSectionView: React.FC<QuestionSectionViewProps> = ({ question }) => {
  return (
    <div className={undefined}>
      <QuestionCardView question={question} />
      <div className={undefined}>
        {(question.sub_questions || []).map((sq: any, idx: number) => (
          <SubQuestionCardView key={sq.id || idx} subQuestion={sq} />
        ))}
      </div>
    </div>
  );
};
