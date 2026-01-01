import { http, HttpResponse } from 'msw';
import { mockExams, mockQuestions, mockSubQuestions } from '../mockData/content';

const apiBase =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    "",
  ) ?? "http://localhost:3000/api";
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
      return HttpResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    const questions = mockQuestions
      .filter((q) => q.examId === exam.id)
      .map((q) => ({
        ...q,
        subQuestions: mockSubQuestions
          .filter((sq) => sq.questionId === q.id)
          .map((sq) => ({
            ...sq,
          })),
      }));

    const responseBody = Object.assign({}, exam, {
      questions,
    });

    return HttpResponse.json(responseBody);
  }),

  http.get(withBase('/exams/template'), () => {
    const exam = mockExams[0];
    const questions = mockQuestions
      .filter((q) => q.examId === exam.id)
      .map((q) => ({
        ...q,
        subQuestions: mockSubQuestions.filter((sq) => sq.questionId === q.id),
      }));
    return HttpResponse.json({ ...exam, questions });
  }),

  http.patch(withBase('/exams/:id'), async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Record<string, unknown>;
    console.log(`Updating exam ${id}:`, updates);
    return HttpResponse.json({ success: true, id, ...updates });
  }),

  http.put(withBase('/exams/:id'), async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json()) as Record<string, unknown>;
    const normalizedId = typeof id === 'string' ? id : '';
    const fallbackId = normalizedId.startsWith('exam-') ? normalizedId.replace('exam-', '') : `exam-${normalizedId}`;
    const existing = mockExams.find((e) => e.id === normalizedId) || mockExams.find((e) => e.id === fallbackId) || {};
    const merged = Object.assign({}, existing, updates);
    return HttpResponse.json(merged, { status: 200 });
  }),
];
