import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedSelector } from '@/atoms/auth';
import React from 'react';

type PublicRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

export default function PublicRoute({ children, redirectTo = '/mypage' }: PublicRouteProps) {
    const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
    const location = useLocation();

    if (isAuthenticated) {
        console.info('Already authenticated, redirecting from login to:', redirectTo);
        const from = (location.state as any)?.from || redirectTo;
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
}
