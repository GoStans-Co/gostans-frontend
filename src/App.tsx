import './App.css';
import './index.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { RouterProvider } from 'react-router-dom';
import { ModalProvider } from '@/components/Modal';
import { RecoilRoot } from 'recoil';
import { CookiesProvider } from 'react-cookie';
import { router } from '@/routes/routes';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import AuthProvider from '@/context/AuthProvider';
import { QueryProvider } from '@/providers/QueryProviders';
import { PostHogProvider } from 'posthog-js/react';

const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
};

const postHogOptions = {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    persistence: 'localStorage' as const,
};

export default function App() {
    return (
        <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={postHogOptions}>
            <CookiesProvider>
                <RecoilRoot>
                    <QueryProvider>
                        <AuthProvider>
                            <ThemeProvider theme={theme}>
                                <ModalProvider>
                                    <GlobalStyles />
                                    <PayPalScriptProvider options={initialOptions}>
                                        <RouterProvider router={router} />
                                    </PayPalScriptProvider>
                                </ModalProvider>
                            </ThemeProvider>
                        </AuthProvider>
                    </QueryProvider>
                </RecoilRoot>
            </CookiesProvider>
        </PostHogProvider>
    );
}
