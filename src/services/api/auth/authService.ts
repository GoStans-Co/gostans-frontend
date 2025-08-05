import { ApiResponse, OtpResponse, VerifyOtpResponse } from '@/types/common/fetch';
import { useMemo } from 'react';
import { useFetch } from '@/hooks/api/useFetch';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { useUserProfileCache } from '@/hooks/api/useProfileCache';
import {
    AuthResponse,
    LoginCredentials,
    RefreshTokenResponse,
    Result,
    SignUpData,
    SocialLoginData,
    SocialLoginResponse,
    VerifyTelegramOtpResponse,
} from '@/services/api/auth/types';
import { useStatusHandler } from '@/hooks/api/useStatusHandler';
import { message } from 'antd';

export const CACHE_DURATION = 5 * 60 * 1000;

/**
 * User Authentication Service - Authentication Operations
 * @module useUserAuthService
 * @description This module provides functions for user authentication operations
 */
export const useAuthService = () => {
    const { execute: fetchData } = useFetch();
    const { setAuthCookie, removeAuthCookie, getRefreshToken } = useCookieAuth();
    const { userProfile, cacheStatus, updateUserProfileCache, clearProfileCache, forceProfileRefresh } =
        useUserProfileCache();

    const [messageApi] = message.useMessage();
    const { handleAsyncOperation } = useStatusHandler(messageApi);

    const login = async (credentials: LoginCredentials): Promise<Result<AuthResponse, string>> => {
        const result = await handleAsyncOperation(
            () =>
                fetchData({
                    url: '/auth/login/',
                    method: 'POST',
                    data: credentials,
                    skipGlobalErrorHandler: true,
                }),
            {
                showLoading: false,
                showSuccess: false,
                showError: false,
            },
        );

        if (result.data?.token && result.data?.user) {
            setAuthCookie(result.data.token, result.data.user, result.data.refresh);
            updateUserProfileCache(result.data.user);
            return { success: true, data: result.data };
        } else {
            return { success: false, error: result.error?.message || 'Login failed' };
        }
    };

    const signUp = async (userData: SignUpData): Promise<ApiResponse<AuthResponse>> => {
        try {
            const response = await fetchData({
                url: '/auth/sign-up/',
                method: 'POST',
                data: userData,
            });

            if (response?.token && response?.user) {
                setAuthCookie(response.token, response.user, response.refresh);
                updateUserProfileCache(response.user);
            }

            return {
                data: response,
                statusCode: 200,
                message: 'Sign up successful',
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw errorResponse;
        }
    };

    const socialLogin = async (socialData: SocialLoginData): Promise<ApiResponse<AuthResponse>> => {
        try {
            const url = socialData.provider === 'google' ? '/auth/google/' : `/auth/${socialData.provider}/`;

            const response = await fetchData({
                url: url,
                method: 'POST',
                data: { id_token: socialData.id_token },
            });

            const apiResponse = response as unknown as SocialLoginResponse;
            const authData = apiResponse.data;

            if (authData && authData.accessToken && authData.id) {
                const userForCookie = {
                    id: authData.id,
                    email: authData.email,
                    name: authData.name,
                    phone: authData.phone,
                    avatar: authData.imageURL,
                };

                setAuthCookie(authData.accessToken, userForCookie, authData.refresh);
                updateUserProfileCache(authData);

                return {
                    data: {
                        token: authData.accessToken,
                        refresh: authData.refresh,
                        user: {
                            id: authData.id,
                            email: authData.email,
                            name: authData.name,
                            phone: authData.phone,
                        },
                    },
                    statusCode: 200,
                    message: '',
                };
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            console.error('Social login error:', errorResponse);
            throw errorResponse;
        }
    };

    const logout = async (): Promise<ApiResponse<void>> => {
        const cartData = localStorage.getItem('cart-storage');
        try {
            await fetchData({
                url: '/auth/logout/',
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            clearCache();
            if (cartData) {
                localStorage.removeItem('cart-storage');
            }
        }

        return {
            data: undefined as void,
            statusCode: 200,
            message: 'Logout successful',
        };
    };

    const forgotPassword = async (email: string): Promise<Result<void, string>> => {
        const result = await handleAsyncOperation(
            () =>
                fetchData({
                    url: '/auth/forgot-password/',
                    method: 'POST',
                    data: { email },
                    skipGlobalErrorHandler: true,
                }),
            {
                showLoading: false,
                showSuccess: false,
                showError: false,
            },
        );

        return result.error ? { success: false, error: result.error.message } : { success: true, data: undefined };
    };

    const sendOtp = async (phone: string): Promise<OtpResponse> => {
        try {
            const response = await fetchData({
                url: '/auth/send-otp/',
                method: 'POST',
                data: { phone },
            });

            return {
                data: response.data,
                statusCode: response.statuscode || 200,
                message: response.message || 'OTP sent successfully',
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw {
                data: null,
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Failed to send OTP',
            };
        }
    };

    const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
        try {
            const response = await fetchData({
                url: '/auth/verify-otp/',
                method: 'POST',
                data: { phone, otp },
            });

            return {
                data: { success: true },
                statusCode: response.statuscode || 200,
                message: response.message || 'OTP verified successfully',
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                data: { success: false },
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'OTP verification failed',
            };
        }
    };

    const verifyOtpEmail = async (email: string, otp: string): Promise<Result<void, string>> => {
        const result = await handleAsyncOperation(
            () =>
                fetchData({
                    url: '/auth/verify-otp-email/',
                    method: 'POST',
                    data: { email, otp },
                    skipGlobalErrorHandler: true,
                }),
            {
                showLoading: false,
                showSuccess: false,
                showError: false,
            },
        );

        return result.error ? { success: false, error: result.error.message } : { success: true, data: undefined };
    };

    const resetPassword = async (email: string, newPassword: string): Promise<Result<void, string>> => {
        const result = await handleAsyncOperation(
            () =>
                fetchData({
                    url: '/auth/reset-password/',
                    method: 'POST',
                    data: { email, new_password: newPassword },
                    skipGlobalErrorHandler: true,
                }),
            {
                showLoading: false,
                showSuccess: false,
                showError: false,
            },
        );

        return result.error ? { success: false, error: result.error.message } : { success: true, data: undefined };
    };

    const resendOtp = async (email: string): Promise<ApiResponse<void>> => {
        try {
            await fetchData({
                url: '/auth/resend-otp/',
                method: 'POST',
                data: { email },
            });

            return {
                data: undefined as void,
                statusCode: 200,
                message: 'OTP resent successfully',
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw errorResponse;
        }
    };

    const verifyTelegramOtp = async (payload: string): Promise<ApiResponse<VerifyTelegramOtpResponse>> => {
        try {
            const response = await fetchData({
                url: '/auth/telegram/verify-otp/',
                method: 'POST',
                data: { otp: payload },
            });

            if (response.data?.accessToken && response.data?.refresh) {
                const userForCookie = {
                    id: response.data.uuid,
                    email: response.data.email,
                    name: response.data.name,
                    phone: '',
                    avatar: '',
                };
                setAuthCookie(response.data.accessToken, userForCookie, response.data.refresh);
                updateUserProfileCache({
                    id: response.data.uuid,
                    email: response.data.email,
                    name: response.data.name,
                    phone: response.data.phone || '',
                    oauthId: response.data.oauthId,
                    oauthProvider: response.data.oauthProvider,
                    imageURL: '',
                });
            }

            return {
                data: response.data,
                statusCode: response.statusCode || 200,
                message: response.message || 'Login successful',
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw {
                data: null,
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Telegram OTP verification failed',
            };
        }
    };

    const refreshToken = async (): Promise<Result<RefreshTokenResponse, string>> => {
        try {
            const refreshTokenValue = getRefreshToken();

            if (!refreshTokenValue) {
                return {
                    success: false,
                    error: 'No refresh token available',
                };
            }

            const response = await fetchData({
                url: '/auth/refresh-token/',
                method: 'POST',
                data: { refresh: refreshTokenValue },
            });

            if (response?.data?.token && response?.data?.refresh) {
                const currentUser = userProfile;
                if (currentUser) {
                    const userForCookie = {
                        id: currentUser.data.id,
                        email: currentUser.data.email,
                        name: currentUser.data.name,
                        phone: currentUser.data.phone || '',
                        avatar: currentUser.data.image || undefined,
                    };
                    setAuthCookie(response.data.token, userForCookie, response.data.refresh);
                }

                return {
                    success: true,
                    data: response.data,
                };
            } else {
                clearCache();

                return {
                    success: false,
                    error: 'Invalid refresh token response',
                };
            }
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };

            clearCache();

            return {
                success: false,
                error: errorResponse.message || 'Token refresh failed',
            };
        }
    };

    const clearCache = () => {
        clearProfileCache();
        removeAuthCookie();
    };

    const forceRefresh = async () => {
        forceProfileRefresh();
    };

    return useMemo(
        () => ({
            login,
            signUp,
            socialLogin,
            logout,
            forgotPassword,
            sendOtp,
            verifyOtp,
            verifyOtpEmail,
            resetPassword,
            resendOtp,
            verifyTelegramOtp,
            refreshToken,
            clearCache,
            forceRefresh,
            userProfile,
            cacheStatus,
        }),
        [
            fetchData,
            setAuthCookie,
            removeAuthCookie,
            userProfile,
            cacheStatus,
            updateUserProfileCache,
            clearProfileCache,
            forceProfileRefresh,
        ],
    );
};
