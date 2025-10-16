import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';

// Basic theme for testing
const testTheme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        text: '#333',
        background: '#fff',
        error: '#dc3545',
        success: '#28a745',
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
    },
    transitions: {
        default: '0.3s ease',
    },
    responsive: {
        maxMobile: '@media (max-width: 768px)',
    },
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

interface AllTheProvidersProps {
    children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
            </QueryClientProvider>
        </RecoilRoot>
    );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };