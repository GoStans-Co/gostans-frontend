import { TourCardVariant } from '@/types';

type DurationTypes = '1 day' | '2 day' | '3 day' | '4 day' | '5 day' | '6 day' | '7 day';
type CurrencyTypes = 'USD' | 'EUR' | 'KRW';
type LanguageTypes = 'en' | 'ru' | 'uz' | 'ko';

export type TourPropsResponse = {
    id: number;
    uuid?: string;
    title: string;
    shortDescription: string;
    tourType: {
        id: number;
        name: string;
    };
    price?: number;
    currency?: 'USD' | 'EUR' | 'KRW';
    country: string;
    mainImage: string | null;
    isLiked?: boolean;
    variant?: TourCardVariant;
    buttonText?: string;
};

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
    cityName?: string;
    countryName?: string;
};

export type ToursListApiResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: TourListResponse[];
    totalPages: number;
};

export type ItineraryLocation = {
    name: string;
    latitude: number | null;
    longitude: number | null;
};

export type ItinerarySlot = {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    locationNames?: ItineraryLocation[];
};

export type Itinerary = {
    id?: number;
    dayNumber: number;
    dayTitle: string;
    description: string;
    accommodation: string;
    includedMeals: string;
    locationNames: ItineraryLocation[];
    slots: ItinerarySlot[];
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
    itineraries: Itinerary[];
    agePricing: Array<{
        ageCategory: string;
        price: string;
    }>;
    includedItem: Array<{ text: string }> | Array<Array<{ text: string }>>;
    excludedItem: Array<{ text: string }> | Array<Array<{ text: string }>>;
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

export type TopDestinationCity = {
    id: number;
    name: string;
    tourCount: number;
    city: {
        id: number;
        name: string;
        imageUrl: string;
    };
};

export type TopDestination = {
    id: number;
    name: string;
    destinationSet: TopDestinationCity[];
};

export type TopDestinationsResponse = {
    statusCode: number;
    message: string;
    data: TopDestination[];
};

/* location data for a tour slot */
export type TourLocationSlot = {
    id: number;
    latitude: string;
    longitude: string;
};

export type TourLocationDay = {
    id: number;
    latitude: string;
    longitude: string;
    slots: TourLocationSlot[];
};

export type TourLocationUpdateRequest = {
    tourUuid: string;
    days: TourLocationDay[];
};

export type TourLocationUpdateResponseData = {
    success: boolean;
    updated_days: string[];
    tour_uuid: string;
    message?: string;
};
