import {
    tourDetailsAtom,
    TourDetailsResponse,
    TourListResponse,
    toursCacheStatusAtom,
    toursDataAtom,
    ToursListApiResponse,
} from '@/atoms/tours';
import { useFetch } from '@/hooks/useFetch';
import { ApiResponse } from '@/types/fetch';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { CACHE_DURATION } from '@/services/api/useUserAuthService';

export const isCacheValid = (lastFetch: number | null): boolean => {
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
};

export const useToursFetchService = () => {
    const { execute: fetchData } = useFetch();
    const [toursData, setToursData] = useRecoilState(toursDataAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(toursCacheStatusAtom);
    const [tourDetailsCache, setTourDetailsCache] = useRecoilState(tourDetailsAtom);

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
                    console.log('Using cached tours with correct count:', toursData.count);
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
                        console.log('Cached tours data with count:', apiResponse.data.count);
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
                    console.log(`Using cached tour data for ID: ${tourId}`);
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
                    console.log(`Using cached tour details for ID: ${id}`);
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
                    console.log(`Tour details cached for ID: ${id}`);
                }

                return response;
            },

            clearCache: () => {
                setToursData(null);
                setTourDetailsCache({});
                setCacheStatus({ loaded: false, lastFetch: null });
                console.log('Tours cache cleared');
            },

            forceRefresh: async () => {
                setCacheStatus({ loaded: false, lastFetch: null });
                setTourDetailsCache({});
                console.log('Tours force refresh triggered');
            },

            getCachedTours: () => toursData?.results || [],
            getCachedCount: () => toursData?.count || 0,
        }),
        [fetchData, toursData, cacheStatus, tourDetailsCache, setToursData, setCacheStatus, setTourDetailsCache],
    );
};
