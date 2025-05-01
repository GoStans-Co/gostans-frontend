import './App.css';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import HomePage from './pages/Home';
import DestinationsPage from './pages/Home/DestinationPage';
import ToursPage from './pages/Home/ToursPage';
import NotFoundPage from './pages/NotFound';
import { theme } from './styles/theme';
import MainLayout from './components/layout/Layout';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="destinations" element={<DestinationsPage />} />
                        <Route path="tours" element={<ToursPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
