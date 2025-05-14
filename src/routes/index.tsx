import { createBrowserRouter, RouteObject } from 'react-router-dom';
import HomePage from '@/pages/Home';
import DestinationsPage from '@/pages/Home/DestinationPage';
import ToursPage from '@/pages/Home/ToursPage';
import NotFoundPage from '@/pages/NotFound';
import MainLayout from '@/components/Layout/Layout';
import MyPage from '@/pages/MyPage';

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'destinations', element: <DestinationsPage /> },
            { path: 'tours', element: <ToursPage /> },
            { path: 'mypage', element: <MyPage /> },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);
