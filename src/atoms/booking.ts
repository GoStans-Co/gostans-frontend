import { BookingDetails } from '@/services/api/useCheckoutService';
import { atom } from 'recoil';

export const activeBookingsAtom = atom<BookingDetails[]>({
    key: 'activeBookings',
    default: [],
});

export const bookingCacheAtom = atom<{
    loaded: boolean;
    lastFetch: number | null;
}>({
    key: 'bookingCache',
    default: {
        loaded: false,
        lastFetch: null,
    },
});
