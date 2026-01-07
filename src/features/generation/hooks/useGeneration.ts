import { useQuery, useMutation } from '@tanstack/react-query';
import { getGenerationStatus, startStructureGeneration, confirmStructure } from '@/services/api/gateway/generation';

export const useJobStatusQuery = (jobId: string | null, enabled: boolean) => {
  return useQuery({
    queryKey: ['generation', 'status', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('No Job ID');
      return await getGenerationStatus(jobId);
    },
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      // If no data yet, poll
      if (!data) return 1000;
      
      // Stop polling if waiting for user (3, 13) or completed (21)
      // 3: structure_confirmed
      // 13: generation_confirmed
      // 21: publication_publishing (done)
      if (data.phase === 3 || data.phase === 13 || data.phase >= 21) return false;
      
      return 1000;
    }
  });
};

export const useStartGenerationMutation = () => {
  return useMutation({
    mutationFn: startStructureGeneration,
  });
};

export const useConfirmJobMutation = () => {
  return useMutation({
    mutationFn: ({ jobId, structureData }: { jobId: string; structureData?: any }) => 
      confirmStructure(jobId, structureData),
  });
};
