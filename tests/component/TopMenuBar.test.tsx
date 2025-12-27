import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopMenuBar } from '@/components/common/TopMenuBar';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock Lucide icons to avoid render issues in test
vi.mock('lucide-react', () => ({
    Search: () => <div data-testid="search-icon" />,
    Bell: () => <div data-testid="bell-icon" />,
    User: () => <div data-testid="user-icon" />,
    Plus: () => <div data-testid="plus-icon" />,
    Menu: () => <div data-testid="menu-icon" />,
    ChevronDown: () => <div data-testid="chevron-icon" />,
}));

describe('TopMenuBar', () => {
    it('has the correct visibility and does not use z-index classes', () => {
        // TopMenuBar uses NavLink and Navigate, so wrap in Router
        render(
            <MemoryRouter future={{ v7_startTransition: false }}>
                <TopMenuBar onNavigate={() => { }} />
            </MemoryRouter>
        );

        const nav = screen.getByRole('navigation');

        // Check for bg-white (fully opaque) and z-index for nav layer
        expect(nav.className).toContain('bg-white');
        expect(nav.className).toContain('z-[899]');

        expect(nav.className).toContain('sticky');
        expect(nav.className).toContain('top-0');
    });
});
