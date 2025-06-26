import { useToursFetchService, useUserAuthService, useUserFetchService, useWishlistFetchService } from '@/services/api';

/**
 * Centralized API Services Hook
 * Provides access to all API services from a single point
 */
export default function useApiServices() {
    const userAuthService = useUserAuthService();
    const toursService = useToursFetchService();
    const userService = useUserFetchService();
    const wishListService = useWishlistFetchService();

    return {
        auth: userAuthService,
        tours: toursService,
        user: userService,
        wishlist: wishListService,
    };
}
