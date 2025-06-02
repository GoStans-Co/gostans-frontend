import { useFetch } from '@/hooks/useFetch';

export type UserProfile = {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
    is_verified: boolean;
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
 * Custom hook for user information operations
 * @returns Object containing user info functions and states
 */
export function useFetchUserInfo() {
    const {
        data: userProfile,
        loading: profileLoading,
        error: profileError,
        execute: executeGetProfile,
        reset: resetProfile,
    } = useFetch<UserProfile>();

    const {
        data: updateData,
        loading: updateLoading,
        error: updateError,
        execute: executeUpdate,
        reset: resetUpdate,
    } = useFetch<UserProfile>();

    const {
        loading: passwordChangeLoading,
        error: passwordChangeError,
        execute: executePasswordChange,
        reset: resetPasswordChange,
    } = useFetch();

    const { loading: uploadLoading, error: uploadError, execute: executeUploadImage, reset: resetUpload } = useFetch();

    const { loading: deleteLoading, error: deleteError, execute: executeDelete, reset: resetDelete } = useFetch();

    /**
     * Get user profile information
     * @returns Promise<UserProfile>
     */
    const getUserProfile = async (): Promise<UserProfile> => {
        try {
            const response = await executeGetProfile({
                url: '/auth/profile/',
                method: 'GET',
            });

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Update user profile information
     * @param userData - User data to update
     * @returns Promise<UserProfile>
     */
    const updateUserProfile = async (userData: UpdateUserData): Promise<UserProfile> => {
        try {
            const response = await executeUpdate({
                url: '/auth/profile/',
                method: 'PUT',
                data: userData,
            });

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Change user password
     * @param passwordData - Password change data
     * @returns Promise<void>
     */
    const changePassword = async (passwordData: ChangePasswordData): Promise<void> => {
        try {
            await executePasswordChange({
                url: '/auth/change-password/',
                method: 'POST',
                data: passwordData,
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Delete user account
     * @returns Promise<void>
     */
    const deleteAccount = async (): Promise<void> => {
        try {
            await executeDelete({
                url: '/auth/profile/',
                method: 'DELETE',
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Upload user avatar
     * @param file - Avatar image file
     * @returns Promise<UserProfile>
     */
    const uploadProfileImage = async (imageFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await executeUploadImage({
                url: '/auth/updateimage/',
                method: 'PATCH',
                data: formData,
            });

            return response;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Verify user email
     * @param token - Email verification token
     * @returns Promise<void>
     */
    const verifyEmail = async (token: string): Promise<void> => {
        try {
            await executePasswordChange({
                url: '/auth/verify-email/',
                method: 'POST',
                data: { token },
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Resend email verification
     * @returns Promise<void>
     */
    const resendEmailVerification = async (): Promise<void> => {
        try {
            await executePasswordChange({
                url: '/auth/resend-verification/',
                method: 'POST',
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Reset all user info states
     */
    const resetAll = () => {
        resetProfile();
        resetUpdate();
        resetPasswordChange();
        resetDelete();
    };

    return {
        getUserProfile,
        userProfile,
        profileLoading,
        profileError,
        resetProfile,

        updateUserProfile,
        updateData,
        updateLoading,
        updateError,
        resetUpdate,

        changePassword,
        passwordChangeLoading,
        passwordChangeError,
        resetPasswordChange,

        deleteAccount,
        deleteLoading,
        deleteError,
        resetDelete,

        uploadProfileImage,
        uploadLoading,
        uploadError,
        resetUpload,

        verifyEmail,
        resendEmailVerification,
        resetAll,
    };
}
