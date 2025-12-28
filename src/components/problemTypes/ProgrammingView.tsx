import React from 'react';
import { ProblemTypeViewProps } from '@/types/problemTypes';

export default function ProgrammingView(props: ProblemTypeViewProps) {
  const { questionContent } = props;
  return (
    <div>
      <div className={undefined}>プログラミング問題</div>
      <pre className={undefined}>{questionContent}</pre>
    </div>
  );
}
