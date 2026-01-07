import { http, HttpResponse } from 'msw';

const apiBase = (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000/api';
const withBase = (path: string) => `${apiBase}${path}`;

export const lookupHandlers = [
  http.get(withBase('/lookups/universities'), () => {
    return HttpResponse.json([
      { id: 'u1', name: 'Test University' },
      { id: 'u2', name: 'Another University' }
    ]);
  }),
  
  http.get(withBase('/lookups/faculties'), () => {
    return HttpResponse.json([
      { id: 'f1', name: 'Test Faculty' },
      { id: 'f2', name: 'Engineering' }
    ]);
  }),

  http.get(withBase('/lookups/teachers'), () => {
    return HttpResponse.json([
      { id: 't1', name: 'Test Teacher' },
      { id: 't2', name: 'Professor X' }
    ]);
  }),
  
  // Also support relative paths for tests if needed, though withBase should cover it if configured correctly.
  // But for safety in node environment without env vars:
  http.get('*/lookups/universities', () => {
    return HttpResponse.json([
      { id: 'u1', name: 'Test University' },
      { id: 'u2', name: 'Another University' }
    ]);
  }),
  
  http.get('*/lookups/faculties', () => {
    return HttpResponse.json([
      { id: 'f1', name: 'Test Faculty' },
      { id: 'f2', name: 'Engineering' }
    ]);
  }),

  http.get('*/lookups/teachers', () => {
    return HttpResponse.json([
      { id: 't1', name: 'Test Teacher' },
      { id: 't2', name: 'Professor X' }
    ]);
  }),
];
