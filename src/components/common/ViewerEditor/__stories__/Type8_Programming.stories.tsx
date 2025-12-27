import React from 'react';
import Type8 from '../Type8_Programming';

export default {
  title: 'ViewerEditor/Type8_Programming',
  component: Type8,
};

export const Default = () => (
  <Type8
    questionContent="次の関数の出力を説明せよ。"
    answerContent={`function add(a, b) {\n  return a + b;\n}`} 
    questionFormat={0}
    answerFormat={0}
  />
);
