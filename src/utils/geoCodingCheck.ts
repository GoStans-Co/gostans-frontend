export type GeocodingResult = {
    latitude: number;
    longitude: number;
    placeName: string;
};

export type LocationNames = {
    name: string;
    latitude: number | null | undefined;
    longitude: number | null | undefined;
};

export type ItineraryItem = {
    dayNumber: number;
    dayTitle: string;
    description: string;
    locationNames?: LocationNames[];
    accommodation?: string;
    includedMeals?: string;
};

/**
 * Mapbox - Geocoding Util Service
 * @description Service for interacting with the Map Box Geocoding API.
 * This service provides methods to geocode a location name to latitude and longitude,
 * as well as reverse geocoding to get location names from coordinates.
 */
export class MapboxGeocodingService {
    private accessToken: string;
    private baseUrl = 'https://api.mapbox.com/search/geocode/v6/forward';

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
            let cleanedLocation = locationName
                .replace(/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,3}\s*,?\s*/, '') // Remove Plus Code from start
                .trim();

            const searchLocation = cleanedLocation || locationName;

            let countryParam = '';
            if (searchLocation.toLowerCase().includes('tajikistan')) {
                countryParam = '&country=tj';
            } else if (searchLocation.toLowerCase().includes('kyrgyzstan')) {
                countryParam = '&country=kg';
            }

            const encodedLocation = encodeURIComponent(searchLocation);
            const url = `${this.baseUrl}?q=${encodedLocation}&access_token=${this.accessToken}&limit=1&types=place,locality,address${countryParam}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (cleanedLocation && cleanedLocation !== searchLocation) {
                    const fallbackUrl = `${this.baseUrl}?q=${encodeURIComponent(cleanedLocation)}&access_token=${this.accessToken}&limit=1&types=place${countryParam}`;
                    const fallbackResponse = await fetch(fallbackUrl);

                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.features && fallbackData.features.length > 0) {
                            const feature = fallbackData.features[0];
                            const [longitude, latitude] = feature.geometry.coordinates;
                            console.log(`Fallback geocoding successful for: ${cleanedLocation}`);
                            return {
                                latitude,
                                longitude,
                                placeName:
                                    feature.properties.full_address ||
                                    feature.properties.place_formatted ||
                                    feature.properties.name,
                            };
                        }
                    }
                }
                return null;
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const feature = data.features[0];
                const [longitude, latitude] = feature.geometry.coordinates;

                console.log(`Geocoding successful: ${searchLocation} -> [${latitude}, ${longitude}]`);

                return {
                    latitude,
                    longitude,
                    placeName:
                        feature.properties.full_address ||
                        feature.properties.place_formatted ||
                        feature.properties.name,
                };
            }

            console.warn(`No results found for: ${searchLocation}`);

            const parts = cleanedLocation.split(',').map((p) => p.trim());
            if (parts.length > 1) {
                const lastPart = parts[parts.length - 1];
                const lastResortUrl = `${this.baseUrl}?q=${encodeURIComponent(lastPart)}&access_token=${this.accessToken}&limit=1&types=place,country${countryParam}`;
                const lastResortResponse = await fetch(lastResortUrl);

                if (lastResortResponse.ok) {
                    const lastResortData = await lastResortResponse.json();
                    if (lastResortData.features && lastResortData.features.length > 0) {
                        const feature = lastResortData.features[0];
                        const [longitude, latitude] = feature.geometry.coordinates;
                        console.log(`Last resort geocoding for "${lastPart}" successful`);
                        return {
                            latitude,
                            longitude,
                            placeName:
                                feature.properties.full_address ||
                                feature.properties.place_formatted ||
                                feature.properties.name,
                        };
                    }
                }
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
        itinerary.locationNames &&
            Array.isArray(itinerary.locationNames) &&
            itinerary.locationNames.length > 0 &&
            typeof itinerary.locationNames[0].name === 'string' &&
            itinerary.locationNames[0].name.trim().length > 0,
    );

    const hasValidCoordinates = isValidCoordinate(
        itinerary.locationNames?.[0]?.latitude,
        itinerary.locationNames?.[0]?.longitude,
    );

    return hasLocationName && !hasValidCoordinates;
};

export const filterItinerariesNeedingGeocoding = (itineraries: ItineraryItem[]): ItineraryItem[] => {
    return itineraries.filter(needsGeocoding);
};
