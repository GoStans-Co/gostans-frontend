import './App.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import { ModalProvider } from './components/Modal';
import { RecoilRoot } from 'recoil';
import { CookiesProvider } from 'react-cookie';

export default function App() {
    return (
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
    );
}
