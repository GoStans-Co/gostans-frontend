import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock environment variables
vi.mock('import.meta', () => ({
    env: {
        VITE_API_URL: 'https://api.gostans.com/api/v1',
    },
}));

// Mock process.env for compatibility
global.process = {
    ...global.process,
    env: {
        REACT_APP_API_BASE_URL: 'https://api.gostans.com',
    },
};