import { atom } from 'recoil';

type DurationTypes = '1 day' | '2 day' | '3 day' | '4 day' | '5 day' | '6 day' | '7 day';
type CurrencyTypes = 'USD' | 'EUR' | 'KRW';
type LanguageTypes = 'en' | 'ru' | 'uz' | 'ko';

export type TourListResponse = {
    id: number;
    uuid: string;
    title: string;
    shortDescription: string;
    tourType: {
        id: number;
        name: string;
    };
    price: string;
    currency: 'USD' | 'EUR' | 'KRW';
    mainImage: string | null;
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
    shortDescription: string;
    tourType: string;
    duration: DurationTypes;
    about: string;
    price: string;
    currency: CurrencyTypes;
    tripStartDate: string | null;
    tripEndDate: string | null;
    country: string;
    city: string;
    groupSize: number;
    language: LanguageTypes;
    ageMin: number;
    ageMax: number;
    partner: number;
    tags: string[];
    mainImage: string | null;
    created_at: string;
    images: Array<{
        id: number;
        image: string;
    }>;
    itineraries: Array<{
        day_number: number;
        day_title: string;
        description: string;
        accommodation: string;
        included_meals: string;
        location_name: string;
        latitude: number;
        longitude: number;
    }>;
    age_pricing: Array<{
        age_category: string;
        price: string;
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
