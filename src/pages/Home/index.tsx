import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useApiServices } from '@/services/api';
import PopularDestinations from '@/components/home/PopularDestinations';
import CityExpertSection from '@/pages/Home/CityExpert';
import NewsletterSection from '@/pages/Home/NewsLetter';
import PopularAccommodations from '@/components/home/PopularAccomadations';
import FirstHome from '@/components/home/FirstHome';
import RecentlyAddedTours from '@/components/home/RecentlyAddedTours';
import { accommodations } from '@/data/mockData';
import TrendingTours from '@/components/home/TrendingTours';
import { useDestinationsCache } from '@/hooks/api/useDestinationCache';
import { TopDestination, TourListResponse } from '@/services/api/tours';
import useTrendingTours from '@/hooks/api/useTrendingTours';
import { toursDataAtom } from '@/atoms/tours';

export type Destinations = {
    id: string;
    name: string;
    image: string;
    toursCount: number;
    country: string;
    cityId: number;
    countryId: number;
};

/**
 * Home Page Component
 * @description Renders the main sections of the home page
 * including popular destinations, trending tours, and more.
 * @param {Object} props - Component props
 * @param {Array} props.destinations - List of popular destinations
 * @param {Array} props.tours - List of trending tours
 * @param {boolean} props.loading - Loading state for tours
 * @returns {JSX.Element} The rendered HomePage component
 */
export default function HomePage() {
    const { tours: toursService } = useApiServices();
    const { cachedData, fetchTopDestinations } = useDestinationsCache();
    const { homepageTours, loading: toursLoading, fetchTrendingTours } = useTrendingTours();

    const toursData = useRecoilValue(toursDataAtom);

    const hasFetchedDestinations = useRef(false);
    const hasFetchedRecentTours = useRef(false);

    const [destinations, setDestinations] = useState<Destinations[]>([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);

    const [recentTours, setRecentTours] = useState<TourListResponse[]>([]);
    const [recentToursLoading, setRecentToursLoading] = useState(true);

    useEffect(() => {
        fetchTrendingTours();
    }, [fetchTrendingTours]);

    useEffect(() => {
        if (hasFetchedDestinations.current) return;
        hasFetchedDestinations.current = true;

        const loadDestinations = async () => {
            setDestinationsLoading(true);
            try {
                const data = await fetchTopDestinations(toursService);

                const transformedDestinations = data.flatMap((country: TopDestination) =>
                    country.destinationSet.map((city) => ({
                        id: `${country.name.toLowerCase()}-${city.name.toLowerCase()}`,
                        name: city.name,
                        image: city.city.imageUrl || `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400`,
                        toursCount: city.tourCount,
                        country: country.name,
                        cityId: city.city.id,
                        countryId: country.id,
                    })),
                );

                setDestinations(transformedDestinations);
            } catch (error) {
                console.error('Failed to load destinations:', error);
                setDestinations([]);
            } finally {
                setDestinationsLoading(false);
            }
        };

        loadDestinations();
    }, [fetchTopDestinations]);

    useEffect(() => {
        if (hasFetchedRecentTours.current) return;
        hasFetchedRecentTours.current = true;

        const loadRecentTours = async () => {
            setRecentToursLoading(true);
            try {
                let toursList: TourListResponse[] = [];

                if (toursData?.results && toursData.results.length > 0) {
                    toursList = toursData.results;
                } else {
                    const response = await toursService.getTours({
                        page: 1,
                        pageSize: 20,
                    });

                    if (response.data?.results) {
                        toursList = response.data.results;
                    }
                }

                const sortedTours = [...toursList].sort((a, b) => b.id - a.id);
                const recentlyAddedTours = sortedTours.slice(0, 10);

                setRecentTours(recentlyAddedTours);
            } catch (error) {
                console.info('Failed to load recent tours:', error);
                setRecentTours([]);
            } finally {
                setRecentToursLoading(false);
            }
        };

        loadRecentTours();
    }, [toursData]);

    return (
        <>
            <FirstHome />
            <PopularDestinations
                destinations={destinations}
                loading={destinationsLoading}
                countries={cachedData || []}
            />
            <TrendingTours tours={homepageTours} loading={toursLoading} />
            <CityExpertSection />
            <RecentlyAddedTours tours={recentTours} loading={recentToursLoading} />
            <PopularAccommodations accommodations={accommodations} />
            <NewsletterSection />
        </>
    );
}
