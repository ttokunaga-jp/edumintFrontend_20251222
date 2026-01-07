import { useQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/lib/axios';

interface SearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: number;
  subjects?: string[];
  universities?: string[];
  faculties?: string[];
  professor?: string;
  year?: string;
  fieldType?: string;
  level?: string | number;
  questionType?: (string | number)[];
  duration?: string | number;
  period?: string | number;
  isLearned?: boolean;
  isHighRating?: boolean;
  isCommented?: boolean;
  isPosted?: boolean;
  language?: string | number;
}

interface Problem {
  id: string;
  title: string;
  examName?: string;
  subjectName?: string;
  universityName?: string;
  content?: string;
  authorName?: string;
  university?: string;
  level?: string;
  likes?: number;
  views?: number;
  createdAt?: string;
  rating?: number;
  comments?: number;
  tags?: string[];
}

interface SearchResponse {
  data: Problem[];
  total: number;
  hasMore?: boolean;
}

export function useSearch(params: SearchParams) {
  return useQuery<SearchResponse, AxiosError>({
    queryKey: ['search', params],
    queryFn: async () => {
      const response = await api.get<SearchResponse>('/search/problems', {
        params,
      });
      return response.data;
    },
  });
}

export function useProblemDetail(problemId: string) {
  return useQuery<Problem, AxiosError>({
    queryKey: ['problem', problemId],
    queryFn: async () => {
      const response = await api.get<Problem>(`/problems/${problemId}`);
      return response.data;
    },
    enabled: !!problemId,
  });
}

export function useUpdateProblem(problemId: string) {
  return useMutation<Problem, AxiosError, Partial<Problem>>({
    mutationFn: async (data) => {
      const response = await api.put<Problem>(
        `/problems/${problemId}`,
        data
      );
      return response.data;
    },
  });
}
