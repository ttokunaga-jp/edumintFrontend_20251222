import React from 'react';
import Type2 from '../Type2_Selection';

export default {
  title: 'ViewerEditor/Type2_Selection',
  component: Type2,
};

export const Default = () => (
  <Type2
    questionContent="次のうち正しいものを選べ。"
    options={[{ id: 'a', content: '選択肢A', isCorrect: false }, { id: 'b', content: '選択肢B', isCorrect: true }]}
    answerContent="B が正しいです。"
    questionFormat={0}
    answerFormat={0}
  />
);
