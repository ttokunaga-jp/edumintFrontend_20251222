import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExam as updateExamApi } from '@/services/api/gateway/content';
import type { Exam } from '../models';

export function useExamEditor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Exam> }) =>
      updateExamApi(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch exam data
      queryClient.invalidateQueries({ queryKey: ['exam', variables.id] });
    },
  });

  return {
    updateExam: (id: string, updates: Partial<Exam>) =>
      mutation.mutateAsync({ id, updates }),
    isSaving: mutation.isPending,
    error: mutation.error,
  };
}
