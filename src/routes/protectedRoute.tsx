import { Navigate, useLocation } from 'react-router-dom';
import useCookieAuth from '@/services/cache/cookieAuthService';
import React from 'react';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

/**
 * ProtectedRoute - Component to protect routes that require authentication
 * This component checks if the user is authenticated using cookies.
 * If not authenticated, it redirects the user to the login page.
 * @param {ProtectedRouteProps} props - Props for the ProtectedRoute component
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useCookieAuth();
    const location = useLocation();
    const authenticated = isAuthenticated();

    console.info('ProtectedRoute check:', {
        authenticated,
        currentPath: location.pathname,
    });

    if (!authenticated) {
        console.info('Not authenticated, redirecting to login from:', location.pathname);
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
