import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedSelector } from '@/atoms/auth';
import React from 'react';

type PublicRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

/**
 * PublicRoute - Component to restrict access to public routes for authenticated users
 * This component checks if the user is authenticated.
 * If authenticated, it redirects the user to the specified page (default is /mypage).
 * @param {PublicRouteProps} props - Props for the PublicRoute component
 */
export default function PublicRoute({ children, redirectTo = '/mypage' }: PublicRouteProps) {
    const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
    const location = useLocation();

    if (isAuthenticated) {
        console.info('Already authenticated, redirecting from login to:', redirectTo);
        const from = (location.state as { from: string })?.from || redirectTo;
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
}
