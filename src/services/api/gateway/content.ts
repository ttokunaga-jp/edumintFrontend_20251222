import api from '@/lib/axios';
import { Exam } from '@/features/content/models';

export const getExam = async (id: string): Promise<Exam> => {
  const response = await api.get<Exam>(`/exams/${id}`);
  return response.data;
};

export const updateExam = async (id: string, updates: Partial<Exam>): Promise<Exam> => {
  const response = await api.put<Exam>(`/exams/${id}`, updates);
  return response.data;
};