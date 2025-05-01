import './App.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}
