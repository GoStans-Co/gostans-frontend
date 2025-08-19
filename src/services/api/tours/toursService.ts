import {
    TopDestinationsResponse,
    TourDetailsResponse,
    TourListResponse,
    TourLocationUpdateResponseData,
    ToursListApiResponse,
} from '@/services/api/tours/types';
import { useFetch } from '@/hooks/api/useFetch';
import { ApiResponse } from '@/types/common/fetch';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { CACHE_DURATION } from '@/services/api/auth/authService';
import { tourDetailsAtom, toursCacheStatusAtom, toursDataAtom } from '@/atoms/tours';
import { countriesWithCitiesAtom, CountriesWithCitiesState, CountryWithCities } from '@/atoms/countryWithCities';

export const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
};

/**
 * Tours Fetch Service - Tour Operations
 * @module useToursService
 * @description This module provides functions for fetching tours and tour details
 */
export const useToursService = () => {
    const { execute: fetchData } = useFetch();
    const [toursData, setToursData] = useRecoilState(toursDataAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(toursCacheStatusAtom);
    const [tourDetailsCache, setTourDetailsCache] = useRecoilState(tourDetailsAtom);
    const [countriesWithCities, setCountriesWithCities] =
        useRecoilState<CountriesWithCitiesState>(countriesWithCitiesAtom);

    return useMemo(
        () => ({
            getTours: async ({
                search,
                page = 1,
                pageSize = 10,
                all = false,
            }: {
                search?: string;
                page?: number;
                pageSize?: number;
                all?: boolean;
            } = {}): Promise<ApiResponse<ToursListApiResponse>> => {
                if (cacheStatus.loaded && isCacheValid(cacheStatus.lastFetch) && !search && page === 1 && toursData) {
                    return {
                        data: toursData,
                        statusCode: 200,
                        message: 'success',
                    };
                }

                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('pageSize', pageSize.toString());
                if (all) params.append('all', 'true');
                if (search) params.append('search', search);

                try {
                    const response = await fetchData({
                        url: `/tours/list/?${params.toString()}`,
                        method: 'GET',
                    });

                    const apiResponse: ApiResponse<ToursListApiResponse> = {
                        data: response.data || response,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'success',
                    };

                    /* then we cache data for page 1 without search */
                    if (apiResponse.data?.results && !search && page === 1) {
                        setToursData(apiResponse.data);
                        setCacheStatus({ loaded: true, lastFetch: Date.now() });
                    }

                    return apiResponse;
                } catch (error) {
                    console.error('Tours fetch error:', error);
                    throw error;
                }
            },

            getTourById: async (id: string | number): Promise<ApiResponse<TourListResponse>> => {
                const tourId = id.toString();
                const cachedTour = toursData?.results?.find((tour) => tour.id.toString() === tourId);

                if (cachedTour && cacheStatus.loaded) {
                    return {
                        data: cachedTour,
                        statusCode: 200,
                        message: 'success',
                    };
                }

                return fetchData({
                    url: `/tours/${id}/`,
                    method: 'GET',
                });
            },

            getTourDetails: async (tourId: string | number): Promise<ApiResponse<TourDetailsResponse>> => {
                const id = tourId.toString();
                const cachedDetail = tourDetailsCache[id];

                if (cachedDetail && isCacheValid(cachedDetail.lastFetch)) {
                    return {
                        data: cachedDetail.data,
                        statusCode: 200,
                        message: 'success',
                    };
                }

                const response = await fetchData({
                    url: `/tours/detail/${tourId}/`,
                    method: 'GET',
                });

                /* here we cache the response */
                if (response.statusCode === 200) {
                    setTourDetailsCache((prev) => ({
                        ...prev,
                        [id]: {
                            data: response.data,
                            lastFetch: Date.now(),
                        },
                    }));
                }

                return response;
            },

            getTrendingTours: async (): Promise<ApiResponse<ToursListApiResponse>> => {
                try {
                    const response = await fetchData({
                        url: '/tours/trending-tours/',
                        method: 'GET',
                    });

                    const apiResponse: ApiResponse<ToursListApiResponse> = {
                        data: response.data || response,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'Trending tours retrieved successfully',
                    };

                    return apiResponse;
                } catch (error) {
                    console.error('Trending tours fetch error:', error);
                    throw error;
                }
            },

            updateTourLocationData: async (
                tourUuid: string,
                locations: Record<number, { latitude: number; longitude: number }>,
            ): Promise<ApiResponse<TourLocationUpdateResponseData>> => {
                try {
                    const response = await fetchData({
                        url: `/tours/update-tour-location/`,
                        method: 'POST',
                        data: {
                            tour_uuid: tourUuid,
                            days: locations,
                        },
                    });

                    return {
                        data: response.data || response,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'Location updated successfully',
                    };
                } catch (error) {
                    console.error('Error updating tour location:', error);
                    throw error;
                }
            },

            getTopDestinations: async (countryId?: number): Promise<ApiResponse<TopDestinationsResponse[]>> => {
                try {
                    const url = countryId
                        ? `/tours/top-destinations/?country_id=${countryId}`
                        : '/tours/top-destinations/';

                    const response = await fetchData({
                        url,
                        method: 'GET',
                    });

                    const apiResponse: ApiResponse<TopDestinationsResponse[]> = {
                        data: response.data || response,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'Top destinations retrieved successfully',
                    };

                    return apiResponse;
                } catch (error) {
                    console.error('Top destinations fetch error:', error);
                    throw error;
                }
            },

            getToursByDestination: async ({
                countryId,
                cityId,
                page = 1,
                pageSize = 20,
            }: {
                countryId: number;
                cityId: number;
                page?: number;
                pageSize?: number;
            }): Promise<ApiResponse<ToursListApiResponse>> => {
                try {
                    const params = new URLSearchParams();
                    params.append('country_id', countryId.toString());
                    params.append('city_id', cityId.toString());
                    params.append('page', page.toString());
                    params.append('pageSize', pageSize.toString());

                    const response = await fetchData({
                        url: `/tours/tours-by-destination/?${params.toString()}`,
                        method: 'GET',
                    });

                    const apiResponse: ApiResponse<ToursListApiResponse> = {
                        data: response.data || response,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'Tours by destination retrieved successfully',
                    };

                    return apiResponse;
                } catch (error) {
                    console.error('Tours by destination fetch error:', error);
                    throw error;
                }
            },

            getCountriesWithCities: async (): Promise<ApiResponse<CountryWithCities[]>> => {
                const now = Date.now();
                const FIVE_HOURS = 5 * 60 * 60 * 1000;

                if (
                    countriesWithCities.data &&
                    countriesWithCities.lastFetch &&
                    now - countriesWithCities.lastFetch < FIVE_HOURS
                ) {
                    return {
                        data: countriesWithCities.data,
                        statusCode: 200,
                        message: 'Countries with cities retrieved from cache',
                    };
                }

                try {
                    const response = await fetchData({
                        url: '/location/countries-with-cities/',
                        method: 'GET',
                    });

                    const freshData: CountryWithCities[] = response.data?.countryData || [];

                    setCountriesWithCities({
                        data: freshData,
                        lastFetch: now,
                    });

                    return {
                        data: freshData,
                        statusCode: response.statusCode || 200,
                        message: response.message || 'Countries with cities retrieved successfully',
                    };
                } catch (error) {
                    console.error('Countries with cities fetch error:', error);
                    throw error;
                }
            },

            clearCache: () => {
                setToursData(null);
                setTourDetailsCache({});
                setCacheStatus({ loaded: false, lastFetch: null });
            },

            forceRefresh: () => {
                setCacheStatus({ loaded: false, lastFetch: null });
                setTourDetailsCache({});
            },

            getCachedTours: () => toursData?.results || [],
            getCachedCount: () => toursData?.count || 0,
        }),
        [fetchData, toursData, cacheStatus, tourDetailsCache, setToursData, setCacheStatus, setTourDetailsCache],
    );
};
