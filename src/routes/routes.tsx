import { createBrowserRouter, RouteObject } from 'react-router-dom';
import React, { Suspense } from 'react';
import NotFoundPage from '@/pages/NotFound';
import ProtectedRoute from '@/routes/protectedRoute';
import MainLayout from '@/components/Layout/Layout';

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
                element: withSuspense(React.lazy(() => import('@/pages/Home'))),
            },
            {
                path: 'destinations',
                element: withSuspense(React.lazy(() => import('@/pages/Home/DestinationPage'))),
            },
            {
                path: 'tours',
                element: withSuspense(React.lazy(() => import('@/pages/Home/ToursPage'))),
            },
            {
                path: 'mypage',
                element: withProtection(React.lazy(() => import('@/pages/MyPage'))),
            },
            {
                path: '/searchTrips',
                element: withSuspense(React.lazy(() => import('@/pages/Search/SearchPackageList'))),
            },
            {
                path: 'searchTrips/package/:packageId',
                element: withSuspense(React.lazy(() => import('@/pages/Search/SearchPackageDetails'))),
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);
