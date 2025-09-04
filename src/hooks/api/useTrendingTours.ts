import { useRecoilState, useRecoilValue } from 'recoil';
import { useCallback } from 'react';
import {
    homepageToursSelector,
    tourTypesSelector,
    trendingToursErrorState,
    trendingToursLoadingState,
    trendingToursState,
} from '@/atoms/trendingTours';
import { useApiServices } from '@/services/api';
import { transformToursArray } from '@/utils/general/tourChangeTypes';

/**
 * useTrendingTours - Custom Hook
 * @description This hook manages the state and fetching of trending tours.
 * It provides the current tours, loading state, error state, and functions to fetch and refetch tours.
 * @returns {Object} - Contains tours, loading state, error state, and functions to fetch and refetch tours.
 * @property {TourPropsResponse[]} tours - The list of trending tours.
 */
export default function useTrendingTours() {
    const [tours, setTours] = useRecoilState(trendingToursState);
    const [loading, setLoading] = useRecoilState(trendingToursLoadingState);
    const [error, setError] = useRecoilState(trendingToursErrorState);

    const homepageTours = useRecoilValue(homepageToursSelector);
    const tourTypes = useRecoilValue(tourTypesSelector);

    const { tours: toursService } = useApiServices();

    const fetchTrendingTours = useCallback(async () => {
        /* here we dont fetch if we already have data and no error */
        if (tours.length > 0 && !error) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await toursService.getTrendingTours();

            if (response.data?.results && Array.isArray(response.data.results)) {
                const transformedTours = transformToursArray(response.data.results);
                setTours(transformedTours);
            } else {
                setTours([]);
            }
        } catch (err) {
            console.error('Failed to fetch trending tours:', err);
            setError('Failed to load trending tours');
            setTours([]);
        } finally {
            setLoading(false);
        }
    }, [tours.length, error, setTours, setLoading, setError]);

    const refetchTours = useCallback(async () => {
        setTours([]);
        setError(null);
        await fetchTrendingTours();
    }, [fetchTrendingTours, setTours, setError]);

    return {
        tours,
        homepageTours,
        tourTypes,
        loading,
        error,
        fetchTrendingTours,
        refetchTours,
    };
}
