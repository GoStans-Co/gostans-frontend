import { useToursFetchService, useUserAuthService, useUserFetchService } from '@/services/api';

/**
 * Centralized API Services Hook
 * Provides access to all API services from a single point
 */
export default function useApiServices() {
    const userAuthService = useUserAuthService();
    const toursService = useToursFetchService();
    const userService = useUserFetchService();

    return {
        auth: userAuthService,
        tours: toursService,
        user: userService,
    };
}
