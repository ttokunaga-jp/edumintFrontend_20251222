import { http, HttpResponse } from 'msw';
import { mockExams, mockQuestions, mockSubQuestions } from '../mockData/content';
import { mockExams as searchMockExams } from '../mockData/search';
const apiBase = (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
const withBase = (path: string) => `${apiBase}${path}`;

export const contentHandlers = [
  http.get(withBase('/exams/:id'), ({ params }) => {
    const { id } = params;
    const idStr = String(id);
    const exam = mockExams.find((e) => e.id === idStr) || searchMockExams.find((e) => e.id === idStr);
    if (!exam) {
      return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    }
    const questions: any[] = [];
    return HttpResponse.json({ ...exam, questions });
  }),

  http.patch(withBase('/exams/:id'), async ({ params, request }) => {
    const { id } = params;
    const updates = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    return HttpResponse.json({ success: true, id, ...updates });
  }),
];
