import { Navigate } from 'react-router-dom';
import useCookieAuth from '@/services/cookieAuthService';

type ProtectedRouteProps = {
    children: React.ReactNode;
    redirectTo?: string;
};

export default function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
    const { isAuthenticated } = useCookieAuth();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
