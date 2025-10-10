import { useMemo } from 'react';
import { useTypedFetch, extractApiData } from '@/hooks/api/useTypedFetch';
import { useUserProfileCache } from '@/hooks/api/useProfileCache';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { BecomePartnersData, ChangePasswordData, UpdateUserData, UserProfile } from '@/services/api/user/types';
import { Result } from '@/services/api/auth/types';
import { BookingDetail } from '@/services/api/checkout/types';

export const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * User Fetch Service - User Profile Operations
 * @module useUserFetchService
 * @description This module provides functions for user profile operations
 */
export const useUserService = () => {
    const { execute: fetchData } = useTypedFetch();
    const { userProfile, isProfileCached, updateUserProfileCache, clearProfileCache } = useUserProfileCache();
    const { removeAuthCookie } = useCookieAuth();

    /**
     * Fetches the current user's profile data from server or cache
     * @returns {Promise<Result<UserProfile, string>>}
     * Promise resolving to user profile data or error message
     */
    const getUserProfile = async (): Promise<Result<UserProfile, string>> => {
        if (isProfileCached()) {
            return {
                success: true,
                data: userProfile!,
            };
        }

        const response = await fetchData({
            url: '/user/profile/',
            method: 'GET',
        });

        const userData = extractApiData<UserProfile>(response);

        if (userData) {
            updateUserProfileCache(userData);
            return {
                success: true,
                data: userData,
            };
        } else {
            return {
                success: false,
                error: 'Invalid profile response',
            };
        }
    };

    /**
     * Fetches detailed information for a specific booking
     * @param {string} bookingId - Unique identifier of the booking to retrieve
     * @returns {Promise<Result<BookingDetail, string>>}
     * Promise resolving to booking details or error message
     */
    const getBookingDetail = async (bookingId: string): Promise<Result<BookingDetail, string>> => {
        const response = await fetchData({
            url: '/user/booking-detail/',
            method: 'POST',
            data: { booking_id: bookingId },
        });

        const bookingData = extractApiData<BookingDetail>(response);

        if (bookingData) {
            return {
                success: true,
                data: bookingData,
            };
        } else {
            return {
                success: false,
                error: 'Invalid booking detail response',
            };
        }
    };

    /**
     * Updates the current user's profile information
     * @param {UpdateUserData} userData - Updated user profile data
     * @returns {Promise<Result<UserProfile, string>>}
     * Promise resolving to updated profile or error message
     */
    const updateUserProfile = async (userData: UpdateUserData): Promise<Result<UserProfile, string>> => {
        const response = await fetchData({
            url: '/user/profile/',
            method: 'PUT',
            data: userData,
        });

        const updatedUserData = extractApiData<UserProfile>(response);

        if (updatedUserData) {
            updateUserProfileCache(updatedUserData);
            return {
                success: true,
                data: updatedUserData,
            };
        } else {
            return {
                success: false,
                error: 'Invalid update response',
            };
        }
    };

    /**
     * Changes the user's password
     * @param {ChangePasswordData} passwordData
     * Password change data including current and new passwords
     * @returns {Promise<Result<void, string>>}
     * Promise resolving to success confirmation or error message
     */
    const changePassword = async (passwordData: ChangePasswordData): Promise<Result<void, string>> => {
        await fetchData({
            url: '/user/change-password/',
            method: 'POST',
            data: passwordData,
        });

        return {
            success: true,
            data: undefined,
        };
    };

    /**
     * Permanently deletes the user's account and all associated data
     * @returns {Promise<Result<void, string>>}
     * Promise resolving to deletion confirmation or error message
     */
    const deleteAccount = async (): Promise<Result<void, string>> => {
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
    };

    /**
     * Uploads and updates the user's profile image
     * @param {File} imageFile - Image file to upload as profile picture
     * @returns {Promise<Result<UserProfile, string>>}
     * Promise resolving to updated profile with new image or error message
     */
    const uploadProfileImage = async (imageFile: File): Promise<Result<UserProfile, string>> => {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetchData({
            url: '/user/update-image/',
            method: 'PATCH',
            data: formData,
        });

        const updatedUserData = extractApiData<UserProfile>(response);

        if (updatedUserData) {
            updateUserProfileCache(updatedUserData);
            return {
                success: true,
                data: updatedUserData,
            };
        } else {
            return {
                success: false,
                error: 'Invalid image upload response',
            };
        }
    };

    /**
     * Verifies user's email address using verification token
     * @param {string} token - Email verification token
     * @returns {Promise<Result<void, string>>}
     * Promise resolving to verification confirmation or error message
     */
    const verifyEmail = async (token: string): Promise<Result<void, string>> => {
        await fetchData({
            url: '/auth/verify-email/',
            method: 'POST',
            data: { token },
        });

        return {
            success: true,
            data: undefined,
        };
    };

    /**
     * Re-sends email verification to the user's email address
     * @returns {Promise<Result<void, string>>}
     * Promise resolving to resend confirmation or error message
     */
    const resendEmailVerification = async (): Promise<Result<void, string>> => {
        await fetchData({
            url: '/auth/resend-verification/',
            method: 'POST',
        });

        return {
            success: true,
            data: undefined,
        };
    };

    /**
     * Registers the user as a business partner
     * @param {BecomePartnersData} data
     * Partner registration data including business information
     * @returns {Promise<Result<void, string>>}
     * Promise resolving to registration confirmation or error message
     */
    const registerPartner = async (data: BecomePartnersData): Promise<Result<void, string>> => {
        await fetchData({
            url: '/user/register-partner/',
            method: 'POST',
            data,
        });

        return {
            success: true,
            data: undefined,
        };
    };

    return useMemo(
        () => ({
            getUserProfile,
            getBookingDetail,
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
