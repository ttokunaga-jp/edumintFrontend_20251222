import { useQuery } from '@tanstack/react-query';
import { getExam } from '@/services/api/gateway/content';
import type { Exam } from '../models';

export function useExamDetail(id: string) {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => getExam(id),
    enabled: !!id,
  });
}
