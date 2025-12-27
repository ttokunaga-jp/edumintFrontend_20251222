import React from 'react';
import Type6 from '../Type6_MathCalculation';

export default {
  title: 'ViewerEditor/Type6_MathCalculation',
  component: Type6,
};

export const Default = () => (
  <Type6 questionContent="計算問題：\n\\(\int_0^1 x^2 dx\\)" answerContent="1/3" questionFormat={1} answerFormat={1} />
);
