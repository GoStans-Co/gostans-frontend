import { createRoot } from 'react-dom/client';

export type ItineraryItem = {
    id?: number;
    dayNumber: number;
    dayTitle: string;
    description: string;
    locationNames?: Array<NamedLocation>;
    locationName?: string;
    latitude?: number | null;
    longitude?: number | null;
    accommodation?: string;
    includedMeals?: string;
    slots?: Array<{
        locationNames?: Array<NamedLocation>;
    }>;
};

export type EnhancedMapComponentProps = {
    itineraries: ItineraryItem[];
    tourUuid: string;
    height?: string;
    zoom?: number;
    showRoute?: boolean;
    onLocationUpdate?: (dayNumber: number, latitude: number, longitude: number) => void;
};

export type MarkerRoot = {
    root: ReturnType<typeof createRoot>;
    container: HTMLElement;
};

export type CityGroup = {
    cityName: string;
    dayRange: string;
    latitude: number;
    longitude: number;
    isFirst: boolean;
    isLast: boolean;
    startDay: number;
    endDay: number;
    isOffset?: boolean;
};

export type NamedLocation = {
    name: string;
    title?: string;
    latitude: number | null;
    longitude: number | null;
};

export type MapboxErrorEvent = {
    error?: {
        message?: string;
    };
};
