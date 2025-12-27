import React from 'react';
import Type7 from '../Type7_Proof';

export default {
  title: 'ViewerEditor/Type7_Proof',
  component: Type7,
};

export const Default = () => (
  <Type7 questionContent="命題を証明せよ: 任意の偶数は 2 の倍数である。" answerContent="証明の草稿" questionFormat={0} answerFormat={0} />
);
