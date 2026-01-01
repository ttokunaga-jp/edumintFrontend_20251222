import api from '@/lib/axios';

export interface HealthStatus {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  message?: string;
}

export const getHealthContent = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/content');
  return response.data;
};

export const getHealthCommunity = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/community');
  return response.data;
};

export const getHealthNotifications = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/notifications');
  return response.data;
};

export const getHealthSearch = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/search');
  return response.data;
};

export const getHealthWallet = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/wallet');
  return response.data;
};

export const getHealthSummary = async (): Promise<HealthStatus> => {
  const response = await api.get<HealthStatus>('/health/summary');
  return response.data;
};