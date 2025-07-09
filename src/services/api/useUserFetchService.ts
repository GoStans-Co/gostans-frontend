import { useRecoilState } from 'recoil';
import { userProfileAtom, userCacheStatusAtom } from '@/atoms/auth';
import { ApiResponse } from '@/types/fetch';
import { useMemo } from 'react';
import { useFetch } from '@/hooks/useFetch';

export const CACHE_DURATION = 5 * 60 * 1000;

export type Wishlist = {
    id: string;
    name: string;
    description?: string;
    itemsCount: number;
    createdAt: string;
    updatedAt: string;
};

export type UserProfile = {
    id: string;
    email: string;
    name: string;
    phone?: string;
    image?: string;
    dateJoined: string;
    updatedAt: string;
    isVerified: boolean;
    wishLists: Wishlist[];
};

export type UpdateUserData = {
    name?: string;
    phone?: string;
    avatar?: string;
};

export type ChangePasswordData = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

/**
 * User Fetch Service - For User Operations
 * @module useUserFetchService
 * @description This module provides functions for user profile operations
 */
export const useUserFetchService = () => {
    const { execute: fetchData } = useFetch();
    const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(userCacheStatusAtom);

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        const currentTime = Date.now();
        return currentTime - lastFetch < CACHE_DURATION;
    };

    const updateUserProfileCache = (userData: UserProfile): void => {
        const now = Date.now();
        setUserProfile(userData);
        setCacheStatus({ loaded: true, lastFetch: now });
        console.log('User profile cached successfully');
    };

    return useMemo(
        () => ({
            getUserProfile: async (): Promise<ApiResponse<UserProfile>> => {
                if (cacheStatus.loaded && isCacheValid(cacheStatus.lastFetch) && userProfile) {
                    console.log('Using cached user profile');
                    return {
                        data: userProfile,
                        statusCode: 200,
                        message: 'success',
                    };
                }

                try {
                    const response = await fetchData({
                        url: '/user/profile/',
                        method: 'GET',
                    });

                    updateUserProfileCache(response);

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: 'success',
                    };
                } catch (error: any) {
                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to fetch user profile',
                    };
                }
            },

            updateUserProfile: async (userData: UpdateUserData): Promise<ApiResponse<UserProfile>> => {
                try {
                    const response = await fetchData({
                        url: '/user/profile/',
                        method: 'PUT',
                        data: userData,
                    });

                    updateUserProfileCache(response);

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: 'success',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            changePassword: async (passwordData: ChangePasswordData): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: '/user/change-password/',
                        method: 'POST',
                        data: passwordData,
                    });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Password changed successfully',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            deleteAccount: async (): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: '/user/profile/',
                        method: 'DELETE',
                    });

                    /* we clear the cache after successful delete */
                    setUserProfile(null);
                    setCacheStatus({ loaded: false, lastFetch: null });
                    console.log('User cache cleared after account deletion');

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Account deleted successfully',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            uploadProfileImage: async (imageFile: File): Promise<ApiResponse<UserProfile>> => {
                try {
                    const formData = new FormData();
                    formData.append('image', imageFile);

                    const response = await fetchData({
                        url: '/user/update-image/',
                        method: 'PATCH',
                        data: formData,
                    });

                    updateUserProfileCache(response);

                    return {
                        data: response,
                        statusCode: 200,
                        message: 'Profile image updated successfully',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: '/auth/verify-otp/',
                        method: 'POST',
                        data: { token },
                    });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Email verified successfully',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            resendEmailVerification: async (): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: '/auth/resend-verification/',
                        method: 'POST',
                    });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Verification email sent successfully',
                    };
                } catch (error: any) {
                    throw error;
                }
            },

            clearCache: () => {
                setUserProfile(null);
                setCacheStatus({ loaded: false, lastFetch: null });
                console.log('User cache cleared');
            },

            forceRefresh: async () => {
                setCacheStatus({ loaded: false, lastFetch: null });
                console.log('User profile force refresh triggered');
            },

            userProfile,
            cacheStatus,
        }),
        [fetchData, userProfile, cacheStatus, setUserProfile, setCacheStatus],
    );
};
