import './App.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '@/styles/GlobalStyles';
import { theme } from '@/styles/theme';
import { RouterProvider } from 'react-router-dom';
import { ModalProvider } from '@/components/Modal';
import { RecoilRoot } from 'recoil';
import { CookiesProvider } from 'react-cookie';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { router } from '@/routes/routes';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
    currency: 'USD',
    intent: 'capture',
};

export default function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <CookiesProvider>
                <RecoilRoot>
                    <ThemeProvider theme={theme}>
                        <ModalProvider>
                            <GlobalStyles />
                            <PayPalScriptProvider options={initialOptions}>
                                <RouterProvider router={router} />
                            </PayPalScriptProvider>
                        </ModalProvider>
                    </ThemeProvider>
                </RecoilRoot>
            </CookiesProvider>
        </GoogleOAuthProvider>
    );
}
