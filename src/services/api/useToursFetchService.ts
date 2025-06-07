import {
    tourDetailsAtom,
    TourDetailsResponse,
    TourListResponse,
    toursAtom,
    toursCacheStatusAtom,
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
    const [tours, setTours] = useRecoilState(toursAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(toursCacheStatusAtom);
    const [tourDetailsCache, setTourDetailsCache] = useRecoilState(tourDetailsAtom);

    return useMemo(
        () => ({
            getTours: async ({
                search,
                page = 1,
                page_size = 10,
            }: {
                search?: string;
                page?: number;
                page_size?: number;
            } = {}): Promise<ApiResponse<ToursListApiResponse>> => {
                if (cacheStatus.loaded && isCacheValid(cacheStatus.lastFetch) && !search) {
                    console.log('Using cached tours');
                    return {
                        data: {
                            count: tours.length,
                            next: null,
                            previous: null,
                            results: tours,
                        },
                        statusCode: 200,
                        message: 'success',
                    };
                }

                const params = new URLSearchParams();
                params.append('page', page.toString());
                params.append('page_size', page_size.toString());
                if (search) params.append('search', search);

                try {
                    const response = await fetchData({
                        url: `/tours/?${params.toString()}`,
                        method: 'GET',
                    });

                    const backendResponse = response;
                    const toursData = backendResponse.data;

                    const apiResponse: ApiResponse<ToursListApiResponse> = {
                        data: toursData,
                        statusCode: backendResponse.statuscode,
                        message: backendResponse.message,
                    };

                    // const apiResponse: ApiResponse<ToursListApiResponse> = {
                    //     data: response,
                    //     statusCode: 200,
                    //     message: 'success',
                    // };

                    if (toursData?.results && !search) {
                        setTours(toursData.results);
                        setCacheStatus({ loaded: true, lastFetch: Date.now() });
                    }

                    // if (response?.results && !search) {
                    //     setTours(response.results);
                    //     setCacheStatus({ loaded: true, lastFetch: Date.now() });
                    // }

                    return apiResponse;
                } catch (error: any) {
                    return {
                        data: { count: 0, next: null, previous: null, results: [] },
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to fetch tours',
                    };
                }
            },

            getTourById: async (id: string | number): Promise<ApiResponse<TourListResponse>> => {
                const tourId = id.toString();
                const cachedTour = tours.find((tour) => tour.id.toString() === tourId);

                if (cachedTour && cacheStatus.loaded) {
                    console.log(`Using cached tour data for ID: ${tourId}`);
                    return {
                        data: cachedTour,
                        statusCode: 200,
                        message: 'success',
                    };
                }

                try {
                    const response = await fetchData({
                        url: `/tours/${id}/`,
                        method: 'GET',
                    });

                    return {
                        data: response,
                        statusCode: 200,
                        message: 'success',
                    };
                } catch (error: any) {
                    throw error;
                }
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

                try {
                    const response = await fetchData({
                        url: `/tours/${tourId}/details/`,
                        method: 'GET',
                    });

                    const apiResponse: ApiResponse<TourDetailsResponse> = {
                        data: response,
                        statusCode: 200,
                        message: 'success',
                    };

                    setTourDetailsCache((prev) => ({
                        ...prev,
                        [id]: {
                            data: response,
                            lastFetch: Date.now(),
                        },
                    }));

                    console.log(`Tour details cached for ID: ${id}`);
                    return apiResponse;
                } catch (error: any) {
                    throw error;
                }
            },

            clearCache: () => {
                setTours([]);
                setTourDetailsCache({});
                setCacheStatus({ loaded: false, lastFetch: null });
                console.log('Tours cache cleared');
            },

            forceRefresh: async () => {
                setCacheStatus({ loaded: false, lastFetch: null });
                setTourDetailsCache({});
                console.log('Tours force refresh triggered');
            },
        }),
        [fetchData, tours, cacheStatus, tourDetailsCache, setTours, setCacheStatus, setTourDetailsCache],
    );
};
