import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock environment variables
process.env.VITE_API_URL = 'https://api.gostans.com/api/v1';
process.env.REACT_APP_API_BASE_URL = 'https://api.gostans.com';