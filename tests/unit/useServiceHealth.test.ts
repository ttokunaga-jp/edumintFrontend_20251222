import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useServiceHealth } from '@/hooks/useServiceHealth';

const mockGetHealthContent = vi.fn();
const mockGetHealthCommunity = vi.fn();
const mockGetHealthNotifications = vi.fn();
const mockGetHealthSearch = vi.fn();
const mockGetHealthWallet = vi.fn();
const mockGetHealthSummary = vi.fn();

vi.mock('@/services/api/gateway/health', () => ({
  getHealthContent: () => mockGetHealthContent(),
  getHealthCommunity: () => mockGetHealthCommunity(),
  getHealthNotifications: () => mockGetHealthNotifications(),
  getHealthSearch: () => mockGetHealthSearch(),
  getHealthWallet: () => mockGetHealthWallet(),
  getHealthSummary: () => mockGetHealthSummary(),
}));

describe('useServiceHealth', () => {
  beforeEach(() => {
    mockGetHealthContent.mockResolvedValue({ status: 'operational', message: '', timestamp: '' });
    mockGetHealthCommunity.mockResolvedValue({ status: 'maintenance', message: '', timestamp: '' });
    mockGetHealthNotifications.mockResolvedValue({ status: 'degraded', message: '', timestamp: '' });
    mockGetHealthSearch.mockResolvedValue({ status: 'outage', message: '', timestamp: '' });
    mockGetHealthWallet.mockResolvedValue({ status: 'operational', message: '', timestamp: '' });
    mockGetHealthSummary.mockResolvedValue({
      services: [],
      overallStatus: 'operational',
      timestamp: '',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads health statuses on mount and marks outage services as disabled', async () => {
    const { result } = renderHook(() => useServiceHealth());

    await waitFor(() => {
      expect(result.current.health.search).toBe('outage');
    });
    expect(result.current.health.community).toBe('maintenance');
    expect(result.current.health.notifications).toBe('degraded');

    expect(result.current.shouldDisableCTA(['search'])).toBe(true);
    expect(result.current.shouldDisableCTA(['wallet'])).toBe(false);
  });

  it('refresh re-fetches and updates health state', async () => {
    const { result } = renderHook(() => useServiceHealth());

    await waitFor(() => {
      expect(result.current.health.search).toBe('outage');
    });

    mockGetHealthSearch.mockResolvedValueOnce({ status: 'operational', message: '', timestamp: '' });

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.health.search).toBe('operational');
    });
  });
});
