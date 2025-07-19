import { WishlistTour } from '@/services/api/wishlist';
import { atom } from 'recoil';

export const wishlistAtom = atom<WishlistTour[]>({
    key: 'wishlistAtom',
    default: [],
});
