import React from 'react';
import { NormalSubQuestionView } from './NormalSubQuestionView';
import type { Meta, StoryObj } from '@storybook/react';
import type { ProblemTypeEditProps } from '@/types/problemTypes';

const meta: Meta<typeof NormalSubQuestionView> = {
  title: 'ProblemTypes/NormalSubQuestionView',
  component: NormalSubQuestionView,
};

export default meta;
type Story = StoryObj<typeof NormalSubQuestionView>;

export const Default: Story = {
  args: {
    subQuestionNumber: 1,
    questionContent: 'Explain the Pythagorean theorem.',
    questionFormat: 0,
    answerContent: 'a^2 + b^2 = c^2',
    answerFormat: 0,
  } as unknown as ProblemTypeEditProps,
};

export const LatexQuestion: Story = {
  args: {
    subQuestionNumber: 1,
    questionContent: '\\(a^2 + b^2 = c^2\\)',
    questionFormat: 1,
    answerContent: 'Proof sketch...',
    answerFormat: 0,
  } as unknown as ProblemTypeEditProps,
};
