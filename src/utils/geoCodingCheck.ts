type GeocodingResult = {
    latitude: number;
    longitude: number;
    placeName: string;
};

type MapboxGeocodingResponse = {
    features: Array<{
        center: [number, number];
        place_name: string;
        geometry: {
            coordinates: [number, number];
        };
    }>;
};

export type ItineraryItem = {
    dayNumber: number;
    dayTitle: string;
    description: string;
    locationName: string;
    latitude: number | null | undefined;
    longitude: number | null | undefined;
    accommodation?: string;
    includedMeals?: string;
};

/**
 * Mapbox - Geocoding Service
 * @description Service for interacting with the Mapbox Geocoding API.
 * This service provides methods to geocode a location name to latitude and longitude,
 * as well as reverse geocoding to get location names from coordinates.
 */
export class MapboxGeocodingService {
    private accessToken: string;
    private baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    /**
     * geocode a location name to get latitude and longitude
     */
    async geocodeLocation(locationName: string): Promise<GeocodingResult | null> {
        if (!locationName || !this.accessToken) {
            return null;
        }

        try {
            const encodedLocation = encodeURIComponent(locationName);
            const url = `${this.baseUrl}/${encodedLocation}.json?access_token=${this.accessToken}&limit=1`;

            const response = await fetch(url);

            if (!response.ok) {
                return null;
            }

            const data: MapboxGeocodingResponse = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const [longitude, latitude] = feature.center;

                return {
                    latitude,
                    longitude,
                    placeName: feature.place_name,
                };
            }

            return null;
        } catch (error) {
            console.error('Error geocoding location:', error);
            return null;
        }
    }

    /**
     * batch geocode multiple locations
     */
    async geocodeMultipleLocations(locations: string[]): Promise<Array<GeocodingResult | null>> {
        const results = await Promise.allSettled(locations.map((location) => this.geocodeLocation(location)));

        return results.map((result) => (result.status === 'fulfilled' ? result.value : null));
    }
}

export const useMapboxGeocoding = () => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const geocodingService = new MapboxGeocodingService(accessToken);

    return {
        geocodeLocation: geocodingService.geocodeLocation.bind(geocodingService),
        geocodeMultipleLocations: geocodingService.geocodeMultipleLocations.bind(geocodingService),
    };
};

export const isValidCoordinate = (lat: number | null | undefined, lng: number | null | undefined): boolean => {
    if (lat === null || lat === undefined || lng === null || lng === undefined) return false;
    if (isNaN(lat) || isNaN(lng)) return false;
    if (lat === 0 && lng === 0) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const needsGeocoding = (itinerary: ItineraryItem): boolean => {
    const hasLocationName = Boolean(
        itinerary.locationName &&
            typeof itinerary.locationName === 'string' &&
            itinerary.locationName.trim().length > 0,
    );

    const hasValidCoordinates = isValidCoordinate(itinerary.latitude, itinerary.longitude);

    return hasLocationName && !hasValidCoordinates;
};

export const filterItinerariesNeedingGeocoding = (itineraries: ItineraryItem[]): ItineraryItem[] => {
    return itineraries.filter(needsGeocoding);
};
