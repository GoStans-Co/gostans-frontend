import { atom } from 'recoil';

export type TourListResponse = {
    id: number;
    uuid: string;
    title: string;
    short_description: string;
    tour_type: {
        id: number;
        name: string;
    };
    price: string;
    currency: 'USD' | 'EUR' | 'KRW';
    main_image: string | null;
};

export type ToursListApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourListResponse[];
};

export type TourDetailsResponse = {
    id: number;
    uuid: string;
    title: string;
    description: string;
    price: string;
    currency: 'USD' | 'EUR' | 'KRW';
    main_image: string | null;
    tour_type: {
        id: number;
        name: string;
    };
    location: string;
    duration: string;
    max_participants: number;
    includes: string[];
    excludes: string[];
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
    }>;
};

export type CacheStatus = {
    loaded: boolean;
    lastFetch: number | null;
};

export type TourDetailsCache = {
    [tourId: string]: {
        data: TourDetailsResponse;
        lastFetch: number;
    };
};

export const toursAtom = atom<TourListResponse[]>({
    key: 'toursAtom',
    default: [],
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
