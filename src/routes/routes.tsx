import { createBrowserRouter, RouteObject } from 'react-router-dom';
import React, { Suspense } from 'react';
import NotFoundPage from '@/components/NotFound';
import ProtectedRoute from '@/routes/protectedRoute';
import MainLayout from '@/components/layout/Layout';
import OAuthRedirect from '@/pages/OAuthRedirect';

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
                path: '/oauth2/redirect',
                element: <OAuthRedirect />,
            },
            {
                path: 'become-partner',
                element: withSuspense(React.lazy(() => import('@/pages/Partner/BecomePartner'))),
            },
            {
                path: 'top-destinations',
                element: withSuspense(React.lazy(() => import('@/pages/Home/Destinations/TopDestinationsList'))),
            },
            {
                path: 'top-destinations/:cityId/:countryId',
                element: withSuspense(React.lazy(() => import('@/pages/Home/Destinations/TopDestinationsByCity'))),
            },
            {
                path: 'contact-us',
                element: withSuspense(React.lazy(() => import('@/pages/Contact/ContactUs'))),
            },
            {
                path: 'mypage',
                element: withProtection(React.lazy(() => import('@/pages/MyPage'))),
            },
            {
                path: '/searchTrips',
                element: withSuspense(React.lazy(() => import('@/pages/SearchPackage/SearchPackageList'))),
            },
            {
                path: '/trendingTours',
                element: withSuspense(React.lazy(() => import('@/pages/Tours/TrendingTours'))),
            },
            {
                path: '/searchTrips/:packageId',
                element: withSuspense(React.lazy(() => import('@/pages/SearchPackage/SearchPackageDetails'))),
            },
            {
                path: 'cart/*',
                element: withProtection(React.lazy(() => import('@/pages/Cart/Cart'))),
            },
            {
                path: 'payment-success/return',
                element: withSuspense(React.lazy(() => import('@/pages/Checkout/Return/PaymentReturn'))),
            },
            {
                path: 'payment-cancel/return',
                element: withSuspense(React.lazy(() => import('@/pages/Checkout/Cancel/PaymentCancel'))),
            },
            {
                path: '/terms-conditions',
                element: withSuspense(React.lazy(() => import('@/pages/Legal/TermsConditions'))),
            },
            {
                path: '/privacy-policy',
                element: withSuspense(React.lazy(() => import('@/pages/Legal/PrivacyPolicy'))),
            },
            {
                path: '/cancellation-policy',
                element: withSuspense(React.lazy(() => import('@/pages/Legal/CancellationPolicy'))),
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
];

export const router = createBrowserRouter(routes);
