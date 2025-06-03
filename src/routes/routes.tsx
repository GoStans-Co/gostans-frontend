import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { Suspense } from 'react';
import HomePage from '@/pages/Home';
import DestinationsPage from '@/pages/Home/DestinationPage';
import ToursPage from '@/pages/Home/ToursPage';
import NotFoundPage from '@/pages/NotFound';
import MainLayout from '@/components/Layout/Layout';
import MyPage from '@/pages/MyPage';
import ProtectedRoute from '@/routes/protectedRoute';

const ComponentLoading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Loading...</h2>
    </div>
);

const withSuspense = (Component: React.ComponentType) => (
    <Suspense fallback={<ComponentLoading />}>
        <Component />
    </Suspense>
);

const withProtection = (Component: React.ComponentType) => (
    <ProtectedRoute>
        <Suspense fallback={<ComponentLoading />}>
            <Component />
        </Suspense>
    </ProtectedRoute>
);

const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: withSuspense(HomePage),
            },
            {
                path: 'destinations',
                element: withSuspense(DestinationsPage),
            },
            {
                path: 'tours',
                element: withSuspense(ToursPage),
            },
            {
                path: 'mypage',
                element: withProtection(MyPage),
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);
