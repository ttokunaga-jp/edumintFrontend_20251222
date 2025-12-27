import React from 'react';
import Type4 from '../Type4_FillInBlank';

export default {
  title: 'ViewerEditor/Type4_FillInBlank',
  component: Type4,
};

export const Default = () => (
  <Type4 questionContent="これは空欄問題です。____ を埋めてください。" answerContent="模範解答" questionFormat={0} answerFormat={0} />
);
