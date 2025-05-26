import { useAuthenticateUser } from '@/services/api/authenticateUser';
import { useFetchUserInfo } from '@/services/api/fetchUserInfo';

/**
 * API Service - Centralized API Service
 * This file contains functions to interact with the API for authentication and user management.
 * @module apiService
 * It includes functions for user authentication, profile management, and user details retrieval.
 */
export default function useApiService() {
    const authService = useAuthenticateUser();
    const userInfoService = useFetchUserInfo();

    return {
        ...authService,
        ...userInfoService,
    };
}
