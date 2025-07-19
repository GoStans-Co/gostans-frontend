import { TourDetailsCache, ToursListApiResponse } from '@/services/api/tours';
import { atom } from 'recoil';
import { CacheStatus } from '@/services/api/tours/types';

export const toursDataAtom = atom<ToursListApiResponse | null>({
    key: 'toursDataAtom',
    default: null,
});

export const toursCacheStatusAtom = atom<CacheStatus>({
    key: 'toursCacheStatusAtom',
    default: {
        loaded: false,
        lastFetch: null,
    },
});

export const tourDetailsAtom = atom<TourDetailsCache>({
    key: 'tourDetailsAtom',
    default: {},
});
