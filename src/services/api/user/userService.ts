import { useMemo } from 'react';
import { useFetch } from '@/hooks/api/useFetch';
import { useUserProfileCache } from '@/hooks/api/useProfileCache';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { BecomePartnersData, ChangePasswordData, UpdateUserData, UserProfile } from '@/services/api/user/types';
import { Result } from '@/services/api/auth/types';

export const CACHE_DURATION = 5 * 60 * 1000;

/**
 * User Fetch Service - User Profile Operations
 * @module useUserFetchService
 * @description This module provides functions for user profile operations
 */
export const useUserService = () => {
    const { execute: fetchData } = useFetch();
    const { userProfile, isProfileCached, updateUserProfileCache, clearProfileCache } = useUserProfileCache();
    const { removeAuthCookie } = useCookieAuth();

    const getUserProfile = async (): Promise<Result<UserProfile, string>> => {
        if (isProfileCached()) {
            return {
                success: true,
                data: userProfile!,
            };
        }

        try {
            const response = await fetchData({
                url: '/user/profile/',
                method: 'GET',
            });

            if (response && response.data) {
                updateUserProfileCache(response.data);
                return {
                    success: true,
                    data: response,
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid profile response',
                };
            }
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to fetch user profile',
            };
        }
    };

    const updateUserProfile = async (userData: UpdateUserData): Promise<Result<UserProfile, string>> => {
        try {
            const response = await fetchData({
                url: '/user/profile/',
                method: 'PUT',
                data: userData,
            });

            if (response) {
                updateUserProfileCache(response);
                return {
                    success: true,
                    data: response,
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid update response',
                };
            }
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to update profile',
            };
        }
    };

    const changePassword = async (passwordData: ChangePasswordData): Promise<Result<void, string>> => {
        try {
            await fetchData({
                url: '/user/change-password/',
                method: 'POST',
                data: passwordData,
            });

            return {
                success: true,
                data: undefined,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to change password',
            };
        }
    };

    const deleteAccount = async (): Promise<Result<void, string>> => {
        try {
            await fetchData({
                url: '/user/profile/',
                method: 'DELETE',
            });

            /* we clear everything after successful account deletion */
            clearProfileCache();
            removeAuthCookie();
            localStorage.removeItem('cart-storage');

            return {
                success: true,
                data: undefined,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to delete account',
            };
        }
    };
    const uploadProfileImage = async (imageFile: File): Promise<Result<UserProfile, string>> => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetchData({
                url: '/user/update-image/',
                method: 'PATCH',
                data: formData,
            });

            if (response) {
                updateUserProfileCache(response);
                return {
                    success: true,
                    data: response,
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid image upload response',
                };
            }
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to upload profile image',
            };
        }
    };

    const verifyEmail = async (token: string): Promise<Result<void, string>> => {
        try {
            await fetchData({
                url: '/auth/verify-email/',
                method: 'POST',
                data: { token },
            });

            return {
                success: true,
                data: undefined,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to verify email',
            };
        }
    };

    const resendEmailVerification = async (): Promise<Result<void, string>> => {
        try {
            await fetchData({
                url: '/auth/resend-verification/',
                method: 'POST',
            });

            return {
                success: true,
                data: undefined,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to resend verification email',
            };
        }
    };

    const registerPartner = async (data: BecomePartnersData): Promise<Result<void, string>> => {
        try {
            await fetchData({
                url: '/user/register-partner/',
                method: 'POST',
                data,
            });

            return {
                success: true,
                data: undefined,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                success: false,
                error: errorResponse.message || 'Failed to become partner',
            };
        }
    };

    return useMemo(
        () => ({
            getUserProfile,
            updateUserProfile,
            changePassword,
            deleteAccount,
            uploadProfileImage,
            verifyEmail,
            resendEmailVerification,
            registerPartner,
            userProfile,
        }),
        [fetchData, userProfile, updateUserProfileCache, clearProfileCache, removeAuthCookie],
    );
};
