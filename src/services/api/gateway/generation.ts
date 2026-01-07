import { axiosInstance } from '@/lib/axios';

export interface GenerationStatusResponse {
  jobId: string;
  phase: number;
  data?: any;
  updatedAt: string;
}

import { ENDPOINTS } from '../endpoints';

export const startStructureGeneration = async (payload: any) => {
  const { data } = await axiosInstance.post(ENDPOINTS.generation.startStructure, payload);
  return data;
};

export const getGenerationStatus = async (jobId: string): Promise<GenerationStatusResponse> => {
  const { data } = await axiosInstance.get(ENDPOINTS.generation.getStatus(jobId));
  return data;
};

export const confirmStructure = async (jobId: string, structureData?: any) => {
  const { data } = await axiosInstance.post(ENDPOINTS.generation.confirmStructure(jobId), { structureData });
  return data;
};
