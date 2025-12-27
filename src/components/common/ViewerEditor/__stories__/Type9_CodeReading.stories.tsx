import React from 'react';
import Type9 from '../Type9_CodeReading';

export default {
  title: 'ViewerEditor/Type9_CodeReading',
  component: Type9,
};

export const Default = () => (
  <Type9 questionContent="コードを読んで次の設問に答えよ。" answerContent={`console.log('hello world')`} questionFormat={0} answerFormat={0} />
);
