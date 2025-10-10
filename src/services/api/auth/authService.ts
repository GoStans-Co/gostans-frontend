import { ApiResponse, OtpResponse, VerifyOtpResponse } from '@/types/common/fetch';
import { useMemo } from 'react';
import { useTypedFetch, extractApiData, extractStatusCode, extractMessage } from '@/hooks/api/useTypedFetch';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { useUserProfileCache } from '@/hooks/api/useProfileCache';
import {
    AuthResponse,
    LoginCredentials,
    RefreshTokenResponse,
    Result,
    SignUpData,
    SocialAuthResponse,
    SocialLoginData,
    VerifyTelegramOtpResponse,
} from '@/services/api/auth/types';
import { useStatusHandler } from '@/hooks/api/useStatusHandler';
import { message } from 'antd';

/**
 * User Authentication Service - Authentication Operations
 * @module useUserAuthService
 * @description This module provides functions for user authentication operations
 */
export const useAuthService = () => {
    const { execute: fetchData } = useTypedFetch();
    const { setAuthCookie, removeAuthCookie, getRefreshToken } = useCookieAuth();
    const { userProfile, cacheStatus, updateUserProfileCache, clearProfileCache, forceProfileRefresh } =
        useUserProfileCache();

    const [messageApi] = message.useMessage();
    const { handleAsyncOperation } = useStatusHandler(messageApi);

    /**
     * Authenticates a user with email and password
     * @param {LoginCredentials} credentials - User login credentials containing
     * email and password
     * @returns {Promise<Result<AuthResponse, string>>} Promise resolving
     * to authentication result with user data and tokens, or error message
     */
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

        const authData = extractApiData<AuthResponse>(result.data);

        if (authData?.token && authData?.user) {
            setAuthCookie(authData.token, authData.user, authData.refresh);
            updateUserProfileCache(authData.user);
            return { success: true, data: authData };
        } else {
            return { success: false, error: result.error?.message || 'Login failed' };
        }
    };

    /**
     * Registers a new user account
     * @param {SignUpData} userData - User registration data including email,
     * password, and personal information
     * @returns {Promise<ApiResponse<AuthResponse>>} Promise resolving
     * to authentication response with user data and tokens
     */
    const signUp = async (userData: SignUpData): Promise<ApiResponse<AuthResponse>> => {
        const response = await fetchData({
            url: '/auth/sign-up/',
            method: 'POST',
            data: userData,
        });

        const authData = extractApiData<AuthResponse>(response);

        if (authData?.token && authData?.user) {
            setAuthCookie(authData.token, authData.user, authData.refresh);
            updateUserProfileCache(authData.user);
        }

        return {
            data: authData,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'Sign up successful'),
        };
    };

    /**
     * Authenticates a user using OAuth social login
     * @param {SocialLoginData} data - Social login data including provider,
     * authorization code, and redirect URI
     * @returns {Promise<ApiResponse<SocialAuthResponse>>} Promise resolving to
     * social authentication response with user data and tokens
     */
    const socialLogin = async (data: SocialLoginData): Promise<ApiResponse<SocialAuthResponse>> => {
        const response = await handleAsyncOperation(
            () =>
                fetchData({
                    url: '/auth/oauth/exchange/',
                    method: 'POST',
                    data: {
                        provider: data.provider,
                        authorization_code: data.authorization_code,
                        redirect_uri: data.redirect_uri,
                    },
                }),
            {
                showLoading: false,
                showSuccess: false,
                showError: false,
            },
        );

        const responseData = extractApiData<{ data?: SocialAuthResponse } | SocialAuthResponse>(response);
        const authData = (responseData as { data?: SocialAuthResponse })?.data || (responseData as SocialAuthResponse);

        if (authData?.accessToken && authData?.id) {
            const userForCookie = {
                id: authData.id,
                email: authData.email,
                name: authData.name,
                phone: authData.phone || '',
                avatar: authData.imageURL,
            };

            setAuthCookie(authData.accessToken, userForCookie, authData.refresh);
            updateUserProfileCache(userForCookie);

            return {
                data: authData,
                statusCode: extractStatusCode(response),
                message: extractMessage(response, 'Social login successful'),
            };
        }

        return {
            data: {} as SocialAuthResponse,
            statusCode: 400,
            message: 'Social login failed',
        };
    };

    /**
     * Checks if an email address is already registered in the system
     * @param {string} email - Email address to check
     * @returns {Promise<boolean>} Promise resolving to true if email exists,
     * false otherwise
     */
    const checkEmailExists = async (email: string): Promise<boolean> => {
        const response = await fetchData({
            url: '/auth/check-email/',
            method: 'POST',
            data: { email },
        });

        const data = extractApiData<{ emailExists: boolean }>(response);
        return data?.emailExists === true;
    };

    /**
     * Logs out the current user, clearing authentication state and local data
     * @returns {Promise<ApiResponse<void>>} Promise resolving to logout confirmation
     */
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

    /**
     * Initiates password reset process by sending reset email to user
     * @param {string} email - Email address for password reset
     * @returns {Promise<Result<void, string>>} Promise resolving to
     * success confirmation or error message
     */
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

    /**
     * Sends OTP verification code to user's phone number
     * @param {string} phone - Phone number to send OTP to
     * @returns {Promise<OtpResponse>} Promise resolving to OTP send confirmation
     */
    const sendOtp = async (phone: string): Promise<OtpResponse> => {
        const response = await fetchData({
            url: '/auth/send-otp/',
            method: 'POST',
            data: { phone },
        });

        return {
            data: extractApiData(response),
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'OTP sent successfully'),
        };
    };

    /**
     * Verifies OTP code sent to user's phone number
     * @param {string} phone - Phone number that received the OTP
     * @param {string} otp - OTP verification code to validate
     * @returns {Promise<VerifyOtpResponse>} Promise resolving to verification confirmation
     */
    const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResponse> => {
        const response = await fetchData({
            url: '/auth/verify-otp/',
            method: 'POST',
            data: { phone, otp },
        });

        return {
            data: { success: true },
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'OTP verified successfully'),
        };
    };

    /**
     * Verifies OTP code sent to user's email address
     * @param {string} email - Email address that received the OTP
     * @param {string} otp - OTP verification code to validate
     * @returns {Promise<Result<void, string>>} Promise resolving
     * to verification result or error message
     */
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

    /**
     * Resets user password using verified email and new password
     * @param {string} email - Verified email address for password reset
     * @param {string} newPassword - New password to set for the account
     * @returns {Promise<Result<void, string>>} Promise resolving to
     * reset confirmation or error message
     */
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

    /**
     * Re-sends OTP verification code to user's email address
     * @param {string} email - Email address to resend OTP to
     * @returns {Promise<ApiResponse<void>>}
     * Promise resolving to resend confirmation
     */
    const resendOtp = async (email: string): Promise<ApiResponse<void>> => {
        const response = await fetchData({
            url: '/auth/resend-otp/',
            method: 'POST',
            data: { email },
        });

        return {
            data: undefined as void,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'OTP resent successfully'),
        };
    };

    /**
     * Verifies Telegram OTP for Telegram-based authentication
     * @param {string} payload - Telegram OTP payload to verify
     * @returns {Promise<ApiResponse<VerifyTelegramOtpResponse>>}
     * Promise resolving to Telegram verification response with user data
     */
    const verifyTelegramOtp = async (payload: string): Promise<ApiResponse<VerifyTelegramOtpResponse>> => {
        const response = await fetchData({
            url: '/auth/telegram/verify-otp/',
            method: 'POST',
            data: { otp: payload },
        });

        const telegramData = extractApiData<VerifyTelegramOtpResponse>(response);

        if (telegramData?.accessToken && telegramData?.refresh) {
            const userForCookie = {
                id: telegramData.uuid,
                email: telegramData.email,
                name: telegramData.name,
                phone: '',
                avatar: '',
            };
            setAuthCookie(telegramData.accessToken, userForCookie, telegramData.refresh);
            updateUserProfileCache({
                id: telegramData.uuid,
                email: telegramData.email,
                name: telegramData.name,
                phone: telegramData.phone || '',
                oauthId: telegramData.oauthId,
                oauthProvider: telegramData.oauthProvider,
                imageURL: '',
            });
        }

        return {
            data: telegramData,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'Login successful'),
        };
    };

    /**
     * Refreshes authentication tokens using stored refresh token
     * @returns {Promise<Result<RefreshTokenResponse, string>>}
     * Promise resolving to new tokens or error message
     */
    const refreshToken = async (): Promise<Result<RefreshTokenResponse, string>> => {
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

        const refreshData = extractApiData<RefreshTokenResponse>(response);

        if (refreshData?.token && refreshData?.refresh) {
            const currentUser = userProfile;
            if (currentUser) {
                const userForCookie = {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.name,
                    phone: currentUser.phone || '',
                    avatar: currentUser.image || undefined,
                };
                setAuthCookie(refreshData.token, userForCookie, refreshData.refresh);
            }

            return {
                success: true,
                data: refreshData,
            };
        } else {
            clearCache();

            return {
                success: false,
                error: 'Invalid refresh token response',
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
            checkEmailExists,
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
