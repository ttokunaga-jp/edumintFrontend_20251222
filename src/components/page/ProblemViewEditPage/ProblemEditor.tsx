import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { QuestionBlock } from './QuestionBlock';
import { SubQuestionBlock } from './SubQuestionBlock';

export interface ProblemEditorProps {
  exam: any;
  onChange: (exam: any) => void;
}

export function ProblemEditor({ exam, onChange }: ProblemEditorProps) {
  const safeExam = exam ?? { questions: [] };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      question_number: (safeExam.questions?.length || 0) + 1,
      question_content: '',
      question_format: 0,
      difficulty: 0,
      keywords: [],
      sub_questions: [],
    };
    const newQuestions = [...(safeExam.questions || []), newQuestion];
    onChange({ ...safeExam, questions: newQuestions });
  };

  const handleQuestionChange = (qIndex: number, updates: any) => {
    const newQuestions = [...safeExam.questions];
    newQuestions[qIndex] = { ...newQuestions[qIndex], ...updates };
    onChange({ ...safeExam, questions: newQuestions });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    const newQuestions = safeExam.questions.filter((_: any, i: number) => i !== qIndex);
    onChange({ ...safeExam, questions: newQuestions });
  };

  const handleAddSubQuestion = (qIndex: number) => {
    const newQuestions = [...safeExam.questions];
    const question = newQuestions[qIndex];
    const newSubQuestion = {
      id: crypto.randomUUID(),
      sub_question_number: (question.sub_questions?.length || 0) + 1,
      question_type_id: 1, // Default to descriptive
      question_content: '',
      question_format: 0,
      answer_content: '',
      answer_format: 0,
    };
    newQuestions[qIndex] = {
      ...question,
      sub_questions: [...(question.sub_questions || []), newSubQuestion],
    };
    onChange({ ...safeExam, questions: newQuestions });
  };

  const handleSubQuestionChange = (qIndex: number, sqIndex: number, updates: any) => {
    const newQuestions = [...safeExam.questions];
    const question = newQuestions[qIndex];
    const newSubQuestions = [...question.sub_questions];
    newSubQuestions[sqIndex] = { ...newSubQuestions[sqIndex], ...updates };
    newQuestions[qIndex] = { ...question, sub_questions: newSubQuestions };
    onChange({ ...safeExam, questions: newQuestions });
  };

  const handleDeleteSubQuestion = (qIndex: number, sqIndex: number) => {
    const newQuestions = [...safeExam.questions];
    const question = newQuestions[qIndex];
    const newSubQuestions = question.sub_questions.filter((_: any, i: number) => i !== sqIndex);
    newQuestions[qIndex] = { ...question, sub_questions: newSubQuestions };
    onChange({ ...safeExam, questions: newQuestions });
  };

  return (
    <Stack spacing={4} sx={{ pb: 10 }}>
      {safeExam.questions?.map((question: any, qIndex: number) => (
        <QuestionBlock
          key={question.id || qIndex}
          questionNumber={question.question_number}
          content={question.question_content}
          format={question.question_format}
          difficulty={question.difficulty}
          keywords={question.keywords}
          canEdit={true}
          canSwitchFormat={true}
          onContentChange={(content) => handleQuestionChange(qIndex, { question_content: content })}
          onFormatChange={(format) => handleQuestionChange(qIndex, { question_format: format })}
          onDifficultyChange={(diff) => handleQuestionChange(qIndex, { difficulty: diff })}
          onDelete={() => handleDeleteQuestion(qIndex)}
        >
          <Stack spacing={2}>
            {question.sub_questions?.map((subQ: any, sqIndex: number) => (
              <SubQuestionBlock
                key={subQ.id || sqIndex}
                id={subQ.id || `sq-${qIndex}-${sqIndex}`}
                subQuestionNumber={subQ.sub_question_number}
                questionTypeId={subQ.question_type_id}
                questionContent={subQ.question_content}
                questionFormat={subQ.question_format}
                answerContent={subQ.answer_content}
                answerFormat={subQ.answer_format}
                keywords={subQ.keywords}
                options={subQ.options}
                canEdit={true}
                canSwitchFormat={true}
                showAnswer={true}
                onQuestionChange={(content) => handleSubQuestionChange(qIndex, sqIndex, { question_content: content })}
                onAnswerChange={(content) => handleSubQuestionChange(qIndex, sqIndex, { answer_content: content })}
                onFormatChange={(type, format) => {
                  if (type === 'question') handleSubQuestionChange(qIndex, sqIndex, { question_format: format });
                  else handleSubQuestionChange(qIndex, sqIndex, { answer_format: format });
                }}
                onTypeChange={(typeId) => handleSubQuestionChange(qIndex, sqIndex, { question_type_id: typeId })}
                onDelete={() => handleDeleteSubQuestion(qIndex, sqIndex)}
              />
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddSubQuestion(qIndex)}
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            >
              小問を追加
            </Button>
          </Stack>
        </QuestionBlock>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
          size="large"
        >
          大問を追加
        </Button>
      </Box>
    </Stack>
  );
}
