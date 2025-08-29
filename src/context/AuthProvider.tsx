import React, { createContext, useContext, useEffect, useState } from 'react';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { useCartService } from '@/services/api/cart/useCartService';
import { useApiServices } from '@/services/api';
import { UserProfile } from '@/services/api/user';
import { useQueryClient } from '@tanstack/react-query';
import { USER_PROFILE_KEY } from '@/hooks/queries/userProfileQuery';

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
    const queryClient = useQueryClient();
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

            /* check if user has valid cookies */
            if (cookieAuth()) {
                setIsAuthenticated(true);

                /* prefetch user profile */
                queryClient.prefetchQuery({
                    queryKey: USER_PROFILE_KEY,
                    queryFn: async () => {
                        const response = await user.getUserProfile();
                        return response;
                    },
                });

                /* sync cart only once per session */
                if (!hasInitializedCart) {
                    try {
                        await syncCartOnLogin();
                        setHasInitializedCart(true);
                    } catch (error) {
                        console.error('Cart sync failed:', error);
                    }
                }

                try {
                    // const profile = await user.getUserProfile();
                    // if (profile.success) {
                    //     setUserProfile(profile.data);
                    // }
                } catch (error: unknown) {
                    /* if profile fetch fails with 401, then refresh token */
                    if (
                        typeof error === 'object' &&
                        error !== null &&
                        'response' in error &&
                        (error as { response?: { status?: number } }).response?.status === 401
                    ) {
                        try {
                            await auth.refreshToken();
                            /* try to fetch the profile */
                            const profile = await user.getUserProfile();
                            if (profile.success) {
                                setUserProfile(profile.data);
                            }
                        } catch (refreshError) {
                            setIsAuthenticated(false);
                            setHasInitializedCart(false);
                        }
                    }
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
