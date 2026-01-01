import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';
import { ProblemTypeEditProps } from '@/types/problemTypes';

/**
 * NormalSubQuestionView
 * 
 * 通常の問題・解答編集ビュー（FreeText型）
 * - Cloze, Numeric, Proof, Programming, TrueFalse, CodeReading で使用
 * - Markdown/LaTeX 自動解析（ユーザーは形式を意識せずに入力）
 * - QuestionEditorPreview を2つ使用（問題文・解答）
 * - Preview/Edit モード対応
 * - 未保存状態の追跡
 */
export const NormalSubQuestionView: React.FC<ProblemTypeEditProps> = (props) => {
  const {
    questionContent,
    answerContent,
    onQuestionChange,
    onAnswerChange,
    onQuestionUnsavedChange,
    onAnswerUnsavedChange,
    mode = 'preview',
  } = props;

  const [question, setQuestion] = useState(questionContent);
  const [answer, setAnswer] = useState(answerContent ?? '');

  useEffect(() => {
    setQuestion(questionContent);
  }, [questionContent]);

  useEffect(() => {
    setAnswer(answerContent ?? '');
  }, [answerContent]);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    onQuestionChange?.(value);
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    onAnswerChange?.(value);
  };

  return (
    <Stack spacing={3}>
      {/* 問題文セクション */}
      <Stack spacing={1}>
        <label style={{ fontWeight: 'bold' }}>問題文</label>
        <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <QuestionEditorPreview
            value={question}
            onChange={handleQuestionChange}
            onUnsavedChange={onQuestionUnsavedChange}
            minEditorHeight={150}
            minPreviewHeight={150}
            mode={mode}
          />
        </Box>
      </Stack>

      {/* 解答・メモセクション */}
      <Stack spacing={1}>
        <label style={{ fontWeight: 'bold' }}>解答 / メモ</label>
        <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <QuestionEditorPreview
            value={answer}
            onChange={handleAnswerChange}
            onUnsavedChange={onAnswerUnsavedChange}
            minEditorHeight={150}
            minPreviewHeight={150}
            mode={mode}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
