import React, { createContext, useContext, useEffect, useState } from 'react';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { useCartService } from '@/services/api/cart/useCartService';
import { useApiServices } from '@/services/api';
import { UserProfile } from '@/services/api/user';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any;
};

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { user, auth } = useApiServices();
    const { isAuthenticated: cookieAuth, getUserData, getRefreshToken } = useCookieAuth();
    const { syncCartOnLogin } = useCartService();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [hasInitializedCart, setHasInitializedCart] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            /* we check if user has cookies (tokens) */
            if (cookieAuth()) {
                const refreshTokenValue = getRefreshToken();

                if (refreshTokenValue) {
                    try {
                        /* we try to refresh token to verify it is still valid */
                        await auth.refreshToken();
                        setIsAuthenticated(true);

                        /* then sync cart when user is authenticated - but only once per session */
                        if (!hasInitializedCart) {
                            await syncCartOnLogin();
                            setHasInitializedCart(true);
                        }

                        const profile = await user.getUserProfile();
                        if (profile.success) {
                            setUserProfile(profile.data);
                        }
                    } catch (error) {
                        console.error('Token refresh failed during initialization:', error);
                        setIsAuthenticated(false);
                        setHasInitializedCart(false);
                    }
                } else {
                    setIsAuthenticated(false);
                    setHasInitializedCart(false);
                }
            } else {
                setIsAuthenticated(false);
                setHasInitializedCart(false);
            }

            setIsLoading(false);
        };

        initializeAuth();

        /* automatic token refresh every 50 minutes */
        const interval = setInterval(
            () => {
                if (cookieAuth() && getRefreshToken()) {
                    auth.refreshToken().catch(() => {
                        console.error('Automatic token refresh failed');
                        setIsAuthenticated(false);
                        setHasInitializedCart(false);
                    });
                }
            },
            50 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleAuthChange = async () => {
            /* we only run if auth state changed to true and we haven't synced yet */
            if (isAuthenticated && !hasInitializedCart && !isLoading) {
                try {
                    await syncCartOnLogin();
                    setHasInitializedCart(true);
                } catch (error) {
                    console.error('Cart sync failed after authentication change:', error);
                }
            }
        };

        handleAuthChange();
    }, [isAuthenticated, hasInitializedCart, isLoading]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user: userProfile || getUserData(),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
