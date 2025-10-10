import {
    TopDestinationsResponse,
    TourDetailsResponse,
    TourListResponse,
    TourLocationUpdateRequest,
    TourLocationUpdateResponseData,
    ToursListApiResponse,
} from '@/services/api/tours/types';
import { useFetch } from '@/hooks/api/useFetch';
import { ApiResponse } from '@/types/common/fetch';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { tourDetailsAtom, toursCacheStatusAtom, toursDataAtom } from '@/atoms/tours';
import { countriesWithCitiesAtom, CountriesWithCitiesState, CountryWithCities } from '@/atoms/countryWithCities';
import { CACHE_DURATION } from '@/services/api/user/userService';

/**
 * Checks if cached data is still valid based on timestamp.
 * @param {number | null} lastFetch - Timestamp of last cache update
 * @returns {boolean} True if cache is still valid, false otherwise
 */
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
    const { execute: fetchData } = useFetch<ApiResponse<unknown>>();
    const [toursData, setToursData] = useRecoilState(toursDataAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(toursCacheStatusAtom);
    const [tourDetailsCache, setTourDetailsCache] = useRecoilState(tourDetailsAtom);
    const [countriesWithCities, setCountriesWithCities] =
        useRecoilState<CountriesWithCitiesState>(countriesWithCitiesAtom);

    return useMemo(
        () => ({
            /**
             * Fetches tours list with optional filtering and pagination.
             * Uses cache when possible to avoid unnecessary API calls.
             * @param {Object} params - Query parameters
             * @param {string} [params.search] - Search term for filtering tours
             * @param {number} [params.page=1] - Page number for pagination
             * @param {number} [params.pageSize=10] - Number of items per page
             * @param {boolean} [params.all=false] - Whether to fetch all tours
             * @returns {Promise<ApiResponse<ToursListApiResponse>>} Promise resolving to tours list
             */
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

                const response = await fetchData({
                    url: `/tours/list/?${params.toString()}`,
                    method: 'GET',
                });

                const typedResponse = response as ApiResponse<ToursListApiResponse>;

                const apiResponse: ApiResponse<ToursListApiResponse> = {
                    data: typedResponse.data,
                    statusCode: typedResponse.statusCode || 200,
                    message: typedResponse.message || 'success',
                };

                /* then we cache data for page 1 without search */
                if (apiResponse.data?.results && !search && page === 1) {
                    setToursData(apiResponse.data);
                    setCacheStatus({ loaded: true, lastFetch: Date.now() });
                }

                return apiResponse;
            },

            /**
             * Fetches a single tour by ID with caching support.
             * @param {string | number} id - Tour ID to fetch
             * @returns {Promise<ApiResponse<TourListResponse>>}
             * Promise resolving to tour data
             */
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

                const response = await fetchData({
                    url: `/tours/${id}/`,
                    method: 'GET',
                });

                return response as ApiResponse<TourListResponse>;
            },

            /**
             * Fetches detailed tour information with comprehensive caching.
             * @param {string | number} tourId - Tour ID to get details for
             * @returns {Promise<ApiResponse<TourDetailsResponse>>} Promise resolving to detailed tour data
             */
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

                const typedResponse = response as ApiResponse<TourDetailsResponse>;

                /* here we cache the response */
                if (typedResponse.statusCode === 200) {
                    setTourDetailsCache((prev) => ({
                        ...prev,
                        [id]: {
                            data: typedResponse.data,
                            lastFetch: Date.now(),
                        },
                    }));
                }

                return typedResponse;
            },

            /**
             * Fetches currently trending tours from the API.
             * @returns {Promise<ApiResponse<ToursListApiResponse>>}
             * Promise resolving to trending tours
             */
            getTrendingTours: async (): Promise<ApiResponse<ToursListApiResponse>> => {
                const response = await fetchData({
                    url: '/tours/trending-tours/',
                    method: 'GET',
                });

                const typedResponse = response as ApiResponse<ToursListApiResponse>;

                const apiResponse: ApiResponse<ToursListApiResponse> = {
                    data: typedResponse.data,
                    statusCode: typedResponse.statusCode || 200,
                    message: typedResponse.message || 'Trending tours retrieved successfully',
                };

                return apiResponse;
            },

            /**
             * Updates tour location data with new coordinates.
             * @param {TourLocationUpdateRequest} updateRequest
             * Request containing tour UUID and day location data
             * @returns {Promise<ApiResponse<TourLocationUpdateResponseData>>}
             * Promise resolving to update response
             */
            updateTourLocationData: async (
                updateRequest: TourLocationUpdateRequest,
            ): Promise<ApiResponse<TourLocationUpdateResponseData>> => {
                const response = await fetchData({
                    url: `/tours/update-tour-location/`,
                    method: 'POST',
                    data: updateRequest,
                });

                return response as ApiResponse<TourLocationUpdateResponseData>;
            },

            /**
             * Fetches top destinations, optionally filtered by country.
             * @param {number} [countryId] - Optional country ID to filter destinations
             * @returns {Promise<ApiResponse<TopDestinationsResponse[]>>}
             * Promise resolving to top destinations
             */
            getTopDestinations: async (countryId?: number): Promise<ApiResponse<TopDestinationsResponse['data']>> => {
                const url = countryId ? `/tours/top-destinations/?country_id=${countryId}` : '/tours/top-destinations/';

                const response = await fetchData({
                    url,
                    method: 'GET',
                });

                return response as ApiResponse<TopDestinationsResponse['data']>;
            },

            /**
             * Fetches tours filtered by specific destination (country and city).
             * @param {Object} params - Destination filter parameters
             * @param {number} params.countryId - Country ID to filter by
             * @param {number} params.cityId - City ID to filter by
             * @param {number} [params.page=1] - Page number for pagination
             * @param {number} [params.pageSize=20] - Number of items per page
             * @returns {Promise<ApiResponse<ToursListApiResponse>>} Promise resolving to filtered tours
             */
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
                const params = new URLSearchParams();
                params.append('country_id', countryId.toString());
                params.append('city_id', cityId.toString());
                params.append('page', page.toString());
                params.append('pageSize', pageSize.toString());

                const response = await fetchData({
                    url: `/tours/tours-by-destination/?${params.toString()}`,
                    method: 'GET',
                });

                return response as ApiResponse<ToursListApiResponse>;
            },

            /**
             * Fetches countries with their associated cities, with 5-hour caching.
             * @returns {Promise<ApiResponse<CountryWithCities[]>>}
             * Promise resolving to countries and cities data
             */
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

                const response = await fetchData({
                    url: '/location/countries-with-cities/',
                    method: 'GET',
                });

                const responseData = response as ApiResponse<{ countryData: CountryWithCities[] }>;
                const freshData: CountryWithCities[] = responseData.data?.countryData || [];

                setCountriesWithCities({
                    data: freshData,
                    lastFetch: now,
                });

                return {
                    data: freshData,
                    statusCode: response.statusCode || 200,
                    message: response.message || 'Countries with cities retrieved successfully',
                };
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

            /**
             * Gets cached tours without making API call.
             * @returns {TourListResponse[]} Array of cached tour results
             */
            getCachedTours: () => toursData?.results || [],

            /**
             * Gets cached tour count without making API call.
             * @returns {number} Total count of cached tours
             */
            getCachedCount: () => toursData?.count || 0,
        }),
        [fetchData, toursData, cacheStatus, tourDetailsCache, setToursData, setCacheStatus, setTourDetailsCache],
    );
};
