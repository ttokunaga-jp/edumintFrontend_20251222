import { http, HttpResponse } from 'msw';
import { mockExams, mockQuestions, mockSubQuestions } from '../mockData/content';
import { mockExams as searchMockExams } from '../mockData/search';

const apiBase =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  ) ?? "";
const withBase = (path: string) => `${apiBase}${path}`;

export const contentHandlers = [
  http.get(withBase('/exams/:id'), ({ params }) => {
    const { id } = params;
    if (typeof id !== 'string') {
      return HttpResponse.json({ message: 'Invalid exam id' }, { status: 400 });
    }

    const normalizedId = id;
    const fallbackId = id.startsWith('exam-') ? id.replace('exam-', '') : `exam-${id}`;
    const exam = mockExams.find((e) => e.id === normalizedId) || mockExams.find((e) => e.id === fallbackId);

    if (!exam) {
      // If search mocks contain the exam, use it to build a detail payload; otherwise synthesize a full-type sample.
      const searchExam = searchMockExams.find((e) => e.id === normalizedId) || searchMockExams.find((e) => e.id === fallbackId);
      const templateSubs = mockSubQuestions.filter((sq) => sq.questionId === 'exam-3-q1');
      const syntheticQuestionId = `${normalizedId}-q1`;
      const syntheticSubs = templateSubs.map((sq, idx) => ({
        ...sq,
        id: `${normalizedId}-sq${idx + 1}`,
        questionId: syntheticQuestionId,
        subQuestionNumber: idx + 1,
      }));

      const base = searchExam ?? {
        id: normalizedId,
        examName: `Mock Exam ${normalizedId}`,
        school: 'Mock University',
        universityName: 'Mock University',
        universityId: 0,
        teacherId: 'mock-teacher',
        teacherName: 'Mock Teacher',
        subjectId: 'mock-subject',
        subjectName: 'Mock Subject',
        examYear: 2024,
        userId: 'mock-user',
        userName: 'mock_user',
        isPublic: true,
        status: 'active',
        commentCount: 0,
        goodCount: 0,
        badCount: 0,
        viewCount: 0,
        adCount: 0,
        bookmarkCount: 0,
        shareCount: 0,
        pdfDownloadCount: 0,
        fieldType: 'science',
        level: 'basic',
        questionCount: 1,
        durationMinutes: 60,
        majorType: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const questions = [
        {
          id: syntheticQuestionId,
          question_number: 1,
          question_content: 'HMR auto mock question (all types preview)',
          question_format: 0,
          sub_questions: syntheticSubs.map((sq) => ({
            ...sq,
            sub_question_number: sq.subQuestionNumber ?? sq.sub_question_number ?? 1,
            question_type_id: sq.questionTypeId ?? sq.sub_question_type_id ?? 1,
            question_content: sq.questionContent ?? sq.sub_question_content ?? '',
            question_format: sq.questionFormat ?? 0,
            answer_content: sq.answerContent ?? '',
            answer_format: sq.answerFormat ?? 0,
            options: sq.options,
          })),
        },
      ];

      return HttpResponse.json({ ...base, questions });
    }

    const questions = mockQuestions
      .filter((q) => q.examId === exam.id)
      .map((q) => ({
        ...q,
        question_number: q.questionNumber,
        question_content: q.questionContent,
        question_format: q.questionFormat,
        sub_questions: mockSubQuestions
          .filter((sq) => sq.questionId === q.id)
          .map((sq) => ({
            ...sq,
            sub_question_number: sq.subQuestionNumber,
            question_type_id: sq.questionTypeId,
            question_content: sq.questionContent,
            question_format: sq.questionFormat,
            answer_content: sq.answerContent,
            answer_format: sq.answerFormat,
            keywords: sq.keywords ?? [],
          })),
      }));

    const responseBody = Object.assign({}, exam, {
      questions,
    });

    return HttpResponse.json(responseBody);
  }),

  http.patch(withBase('/exams/:id'), async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Record<string, unknown>;
    console.log(`Updating exam ${id}:`, updates);
    return HttpResponse.json({ success: true, id, ...updates });
  }),
];
