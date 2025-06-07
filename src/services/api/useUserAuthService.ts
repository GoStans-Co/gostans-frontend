import { useRecoilState } from 'recoil';
import { userProfileAtom, userCacheStatusAtom } from '@/atoms/auth';
import { ApiResponse } from '@/types/fetch';
import { useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';
import useCookieAuth from '@/services/cookieAuthService';
import { AuthResponse, LoginCredentials, SignUpData, SocialLoginData, SocialLoginResponse } from '@/types/auth';

export const CACHE_DURATION = 5 * 60 * 1000;

/**
 * User Authentication Service - For Auth Operations
 * @module useUserAuthService
 * @description This module provides functions for user authentication operations
 */
export const useUserAuthService = () => {
    const { execute: fetchData } = useFetch();
    const { setAuthCookie, removeAuthCookie } = useCookieAuth();
    const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(userCacheStatusAtom);

    const updateUserProfileCache = (userData: any): void => {
        const now = Date.now();
        setUserProfile(userData);
        setCacheStatus({ loaded: true, lastFetch: now });
        console.log('User profile cached successfully after auth');
    };

    return useMemo(
        () => ({
            login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
                console.log('Starting login process...');

                try {
                    const response = await fetchData({
                        url: '/auth/login/',
                        method: 'POST',
                        data: credentials,
                    });

                    console.log('Login API response received:', {
                        hasResponse: !!response,
                        hasToken: !!response?.token,
                        hasUser: !!response?.user,
                        tokenLength: response?.token?.length,
                        userKeys: response?.user ? Object.keys(response.user) : [],
                        userEmail: response?.user?.email,
                    });

                    if (response?.token && response?.user) {
                        setAuthCookie(response.token, response.user);
                        updateUserProfileCache(response.user);
                    } else {
                        console.error('Login response structure invalid:', response);
                        throw new Error('Invalid login response structure');
                    }

                    return {
                        data: response,
                        statusCode: 200,
                        message: 'Login successful',
                    };
                } catch (error: any) {
                    console.error('Login error details:', error);
                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Login failed',
                    };
                }
            },

            signUp: async (userData: SignUpData): Promise<ApiResponse<AuthResponse>> => {
                try {
                    const response = await fetchData({
                        url: '/auth/sign-up/',
                        method: 'POST',
                        data: userData,
                    });

                    if (response?.token && response?.user) {
                        setAuthCookie(response.token, response.user);
                        updateUserProfileCache(response.user);
                    }

                    return {
                        data: response,
                        statusCode: 200,
                        message: 'Sign up successful',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            socialLogin: async (socialData: SocialLoginData): Promise<ApiResponse<AuthResponse>> => {
                try {
                    const url = socialData.provider === 'google' ? '/auth/google/' : `/auth/${socialData.provider}/`;

                    const response = await fetchData({
                        url: url,
                        method: 'POST',
                        data: { id_token: socialData.id_token },
                    });

                    console.log('Full social login response:', response);
                    const apiResponse = response as unknown as SocialLoginResponse;
                    const authData = apiResponse.data;

                    if (authData && authData.access_token && authData.id) {
                        const userForCookie = {
                            id: authData.id,
                            email: authData.email,
                            name: authData.name,
                            phone: authData.phone,
                            avatar: authData.imageURL,
                        };

                        setAuthCookie(authData.access_token, userForCookie);
                        updateUserProfileCache(userForCookie);

                        return {
                            data: {
                                token: authData.access_token,
                                refresh: authData.refresh,
                                user: userForCookie,
                            },
                            statusCode: 200,
                            message: 'Social login successful',
                        };
                    } else {
                        throw new Error('Invalid response structure');
                    }
                } catch (error: any) {
                    console.error('Social login error:', error);
                    throw error;
                }
            },

            logout: async (): Promise<ApiResponse<void>> => {
                console.log('Starting logout process...');

                try {
                    await fetchData({
                        url: '/auth/logout/',
                        method: 'POST',
                    });
                    console.log('Logout API call successful');
                } catch (error) {
                    console.error('Logout API error:', error);
                } finally {
                    removeAuthCookie();
                    setUserProfile(null);
                    setCacheStatus({ loaded: false, lastFetch: null });
                    console.log('Logout process completed');
                }

                return {
                    data: undefined as any,
                    statusCode: 200,
                    message: 'Logout successful',
                };
            },

            forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: '/auth/forgot-password/',
                        method: 'POST',
                        data: { email },
                    });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Password reset email sent',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            clearCache: () => {
                setUserProfile(null);
                setCacheStatus({ loaded: false, lastFetch: null });
                removeAuthCookie();
                console.log('Auth cache cleared');
            },

            forceRefresh: async () => {
                setCacheStatus({ loaded: false, lastFetch: null });
                console.log('Auth force refresh triggered');
            },

            userProfile,
            cacheStatus,
        }),
        [fetchData, setAuthCookie, removeAuthCookie, userProfile, cacheStatus, setUserProfile, setCacheStatus],
    );
};
