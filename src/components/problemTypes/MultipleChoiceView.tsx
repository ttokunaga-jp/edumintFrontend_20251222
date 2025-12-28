import React from 'react';
import { ProblemTypeViewProps } from '@/types/problemTypes';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';

export default function MultipleChoiceView(props: ProblemTypeViewProps) {
  const { questionContent, questionFormat, options = [], showAnswer = false } = props;

  const renderOptionContent = (text: string) => {
    const looksLikeLatex = /\\\\|\\sum|\\frac|\\binom|\\int|\\lim/.test(text);
    if (looksLikeLatex) {
      return <LatexBlock content={text} displayMode={false} className={undefined} />;
    }
    return <MarkdownBlock content={text} className={undefined} />;
  };

  return (
    <div>
      {questionFormat === 0 ? (
        <MarkdownBlock content={questionContent} />
      ) : (
        <LatexBlock content={questionContent} displayMode={false} />
      )}

      <div className={undefined}>
        {options.map((opt, idx) => (
          <div
            key={opt.id}
            className={`p-3 rounded-lg border ${
              showAnswer && opt.isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div style={{
      display: "flex",
      gap: "0.75rem"
    }}>
              <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
                {String.fromCharCode(65 + idx)}
              </div>
              <div className={undefined}>
                {renderOptionContent(opt.content)}
              </div>
              {showAnswer && opt.isCorrect && (
                <div className={undefined}>正解</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
