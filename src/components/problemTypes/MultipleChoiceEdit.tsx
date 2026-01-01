import React, { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';
import OptionListEditor from '@/components/common/forms/OptionListEditor';
import { ProblemTypeEditProps } from '@/types/problemTypes';

type Option = { id: string; content: string; isCorrect: boolean };

/**
 * MultipleChoiceEdit
 * 
 * 複数選択肢問題の編集ビュー
 * - Markdown/LaTeX 自動解析
 * - QuestionEditorPreview を使用（問題文・解説）
 * - OptionListEditor で選択肢管理
 */
export default function MultipleChoiceEdit(props: ProblemTypeEditProps) {
  const {
    questionContent,
    answerContent,
    options = [],
    onQuestionChange,
    onAnswerChange,
    onOptionsChange,
  } = props;
  
  const [question, setQuestion] = useState(questionContent);
  const [answer, setAnswer] = useState(answerContent ?? '');
  const [localOptions, setLocalOptions] = useState<Option[]>(options);

  useEffect(() => setQuestion(questionContent), [questionContent]);
  useEffect(() => setAnswer(answerContent ?? ''), [answerContent]);
  useEffect(() => setLocalOptions(options), [options]);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    onQuestionChange?.(value);
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    onAnswerChange?.(value);
  };

  const handleOptionsChange = (opts: Option[]) => {
    setLocalOptions(opts);
    onOptionsChange?.(opts);
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
            minEditorHeight={150}
            minPreviewHeight={150}
          />
        </Box>
      </Stack>

      {/* 選択肢セクション */}
      <OptionListEditor
        options={localOptions}
        onChange={handleOptionsChange}
      />

      {/* 解答・解説セクション */}
      <Stack spacing={1}>
        <label style={{ fontWeight: 'bold' }}>解答 / 解説</label>
        <Box sx={{ height: 300, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <QuestionEditorPreview
            value={answer}
            onChange={handleAnswerChange}
            minEditorHeight={150}
            minPreviewHeight={150}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
