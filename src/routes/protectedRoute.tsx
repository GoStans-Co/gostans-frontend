import { Navigate, useLocation } from 'react-router-dom';
import useCookieAuth from '@/services/cookieAuthService';
import React from 'react';

type ProtectedRouteProps = {
    children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useCookieAuth();
    const location = useLocation();
    const authenticated = isAuthenticated();

    console.log('ProtectedRoute check:', {
        authenticated,
        currentPath: location.pathname,
    });

    if (!authenticated) {
        console.log('Not authenticated, redirecting to login from:', location.pathname);
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
