import React from 'react';
import Type5 from '../Type5_TrueFalse';

export default {
  title: 'ViewerEditor/Type5_TrueFalse',
  component: Type5,
};

export const Default = () => (
  <Type5 questionContent="次の文は正しいか？ 2+2=4" answerContent="True" questionFormat={0} answerFormat={0} />
);
