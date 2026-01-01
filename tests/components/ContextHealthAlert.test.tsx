import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceHealthProvider } from '@/contexts/ServiceHealthContext';
import { ContextHealthAlert } from '@/components/common/ContextHealthAlert';

test('ContextHealthAlert does not throw and renders nothing when all services are operational', async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <ServiceHealthProvider>
        <ContextHealthAlert />
      </ServiceHealthProvider>
    </QueryClientProvider>
  );

  await waitFor(() => {
    // No alert should be present when all services are operational
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeNull();
  });
});
