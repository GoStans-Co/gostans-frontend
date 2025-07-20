import { TopDestination } from '@/services/api/tours';
import { useState, useEffect } from 'react';

const CACHE_KEY = 'topDestinations';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

type CacheData = {
    data: TopDestination[];
    timestamp: number;
};

export const useDestinationsCache = () => {
    const [cachedData, setCachedData] = useState<TopDestination[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isCacheValid = (timestamp: number): boolean => {
        return Date.now() - timestamp < CACHE_DURATION;
    };

    const getCachedData = (): TopDestination[] | null => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsedCache: CacheData = JSON.parse(cached);
                if (isCacheValid(parsedCache.timestamp)) {
                    return parsedCache.data;
                } else {
                    localStorage.removeItem(CACHE_KEY);
                }
            }
        } catch (error) {
            console.error('Error reading cache:', error);
            localStorage.removeItem(CACHE_KEY);
        }
        return null;
    };

    const setCacheData = (data: TopDestination[]): void => {
        try {
            const cacheData: CacheData = {
                data,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            setCachedData(data);
        } catch (error) {
            console.error('Error setting cache:', error);
        }
    };

    const fetchTopDestinations = async (toursService: any, force = false): Promise<TopDestination[]> => {
        /* we check cache first if not forcing refresh  */
        if (!force) {
            const cached = getCachedData();
            if (cached) {
                setCachedData(cached);
                return cached;
            }
        }

        setIsLoading(true);
        try {
            const response = await toursService.getTopDestinations();
            if (response.data) {
                setCacheData(response.data);
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to fetch top destinations:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        /* then load cached data on mount */
        const cached = getCachedData();
        if (cached) {
            setCachedData(cached);
        }
    }, []);

    return {
        cachedData,
        isLoading,
        fetchTopDestinations,
        clearCache: () => {
            localStorage.removeItem(CACHE_KEY);
            setCachedData(null);
        },
    };
};
