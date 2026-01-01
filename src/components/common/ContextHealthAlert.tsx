import React from 'react';
import { Alert, Stack } from '@mui/material';
import { useServiceHealthContext } from '@/contexts/ServiceHealthContext';

// Assuming HealthStatus type is string union
type HealthStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

export const ContextHealthAlert = () => {
  const { health } = useServiceHealthContext();
  
  const services = [
    { key: 'content', label: 'コンテンツサービス' },
    { key: 'community', label: 'コミュニティ機能' },
    { key: 'notifications', label: '通知サービス' },
    { key: 'search', label: '検索機能' },
    { key: 'wallet', label: 'ウォレット機能' },
  ] as const;

  const alerts = services.filter(service => {
    const status = health[service.key as keyof typeof health] as HealthStatus;
    return status && status !== 'operational';
  });

  if (alerts.length === 0) return null;

  return (
    <Stack spacing={1}>
      {alerts.map(service => {
        const status = health[service.key as keyof typeof health] as HealthStatus;
        let severity: 'warning' | 'error' | 'info' = 'info';
        let message = '';

        switch (status) {
          case 'degraded':
            severity = 'warning';
            message = `${service.label}のパフォーマンスが低下しています。`;
            break;
          case 'outage':
            severity = 'error';
            message = `${service.label}が停止しています。`;
            break;
          case 'maintenance':
            severity = 'info';
            message = `${service.label}はメンテナンス中です。`;
            break;
          default:
            return null;
        }

        return (
          <Alert key={service.key} severity={severity}>
            {message}
          </Alert>
        );
      })}
    </Stack>
  );
};
