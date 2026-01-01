import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '../lib/query-client';
import '../lib/i18n';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AppBarActionProvider } from '@/contexts/AppBarActionContext';
import { NotificationCenter } from '@/components/common/NotificationCenter';
import { AppLayout } from './AppLayout';
import { Router } from './router';
import { ServiceHealthProvider } from '@/contexts/ServiceHealthContext';
import { useTheme } from '@/theme/createTheme';

/**
 * AppProviders - Root application providers
 * Wraps the app with theme, routing, and context providers
 */
export function AppProviders({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationProvider>
            <AppBarActionProvider>
              <ServiceHealthProvider>
                <NotificationCenter />
                <AppLayout>
                  <Router />
                </AppLayout>
              </ServiceHealthProvider>
            </AppBarActionProvider>
          </NotificationProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
