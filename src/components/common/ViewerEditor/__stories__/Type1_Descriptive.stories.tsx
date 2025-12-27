import React from 'react';
import Type1 from '../Type1_Descriptive';

export default {
  title: 'ViewerEditor/Type1_Descriptive',
  component: Type1,
};

export const Default = () => (
  <Type1 questionContent="これは問題文です。" answerContent="これは解答です。" questionFormat={0} answerFormat={0} />
);
