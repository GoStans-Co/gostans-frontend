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
    isLiked: boolean;
};

export type ToursListApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourListResponse[];
    totalPages: number;
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
    isLiked: boolean;
    images: Array<{
        id: number;
        image: string;
    }>;
    itineraries: Array<{
        dayNumber: number;
        dayTitle: string;
        description: string;
        accommodation: string;
        includedMeals: string;
        locationName: string;
        latitude: number;
        longitude: number;
    }>;
    agePricing: Array<{
        ageCategory: string;
        price: string;
    }>;
    includedItem: Array<{
        text: string;
    }>;
    excludedItem: Array<{
        text: string;
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
