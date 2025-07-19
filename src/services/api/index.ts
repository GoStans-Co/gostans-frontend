import { useAuthService } from '@/services/api/auth';
import { useCartService } from '@/services/api/cart';
import { useCheckoutService } from '@/services/api/checkout';
import { useToursService } from '@/services/api/tours';
import { useUserService } from '@/services/api/user';
import { useWishlistService } from '@/services/api/wishlist';

/**
 * Centralized hook to access all API services.
 * This hook provides a convenient way to access all the services
 * without needing to import each one individually.
 * @returns An object containing all the API services.
 */
export const useApiServices = () => {
    const auth = useAuthService();
    const cart = useCartService();
    const checkout = useCheckoutService();
    const tours = useToursService();
    const user = useUserService();
    const wishlist = useWishlistService();

    return {
        auth,
        cart,
        checkout,
        tours,
        user,
        wishlist,
    } as const;
};
