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

export default function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <CookiesProvider>
                <RecoilRoot>
                    <ThemeProvider theme={theme}>
                        <ModalProvider>
                            <GlobalStyles />
                            <RouterProvider router={router} />
                        </ModalProvider>
                    </ThemeProvider>
                </RecoilRoot>
            </CookiesProvider>
        </GoogleOAuthProvider>
    );
}
