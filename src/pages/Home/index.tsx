import { useEffect, useState } from 'react';
import { useApiServices } from '@/services/api';
import PopularDestinations from '@/components/Home/PopularDestinations';
import CityExpertSection from '@/pages/Home/CityExpert';
import NewsletterSection from '@/pages/Home/NewsLetter';
import PopularAccommodations from '@/components/Home/PopularAccomadations';
import FirstHome from '@/components/Home/FirstHome';
import { accommodations } from '@/data/mockData';
import TrendingTours from '@/components/Home/TrendingTours';
import { useDestinationsCache } from '@/hooks/api/useDestinationCache';
import { TopDestination, TourPropsResponse } from '@/services/api/tours';

export default function HomePage() {
    const [tours, setTours] = useState<TourPropsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);

    const { tours: toursService } = useApiServices();
    const { cachedData, fetchTopDestinations } = useDestinationsCache();

    useEffect(() => {
        const fetchTrendingTours = async () => {
            try {
                setLoading(true);
                const response = await toursService.getTrendingTours();

                if (response.data) {
                    const transformedTours: TourPropsResponse[] = response.data.map((tour: TourPropsResponse) => ({
                        id: tour.id,
                        title: tour.title,
                        shortDescription: tour.shortDescription || '',
                        tourType: {
                            id: tour.tourType?.id || 0,
                            name: tour.tourType?.name || 'General',
                        },
                        currency: tour.currency || 'USD',
                        isLiked: tour.isLiked || false,
                        uuid: tour.uuid || undefined,
                        price: tour.price || 0,
                        mainImage: tour.mainImage || null,
                        country: tour.country || 'Unknown',
                        variant: 'link',
                        buttonText: 'Book Now',
                    }));
                    setTours(transformedTours.slice(0, 8));
                }
            } catch (error) {
                console.error('Failed to fetch trending tours:', error);
                setTours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingTours();
    }, []);

    useEffect(() => {
        const loadDestinations = async () => {
            setDestinationsLoading(true);
            try {
                const data = await fetchTopDestinations(toursService);

                const transformedDestinations = data.flatMap((country: TopDestination) =>
                    country.destinationSet.map((city) => ({
                        id: `${country.name.toLowerCase()}-${city.name.toLowerCase()}`,
                        name: city.name,
                        image: `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400`,
                        toursCount: city.tourCount,
                        country: country.name,
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
    }, []);

    return (
        <>
            <FirstHome />
            <PopularDestinations
                destinations={destinations}
                loading={destinationsLoading}
                countries={cachedData || []}
            />
            <TrendingTours tours={tours} loading={loading} />
            <CityExpertSection />
            <PopularAccommodations accommodations={accommodations} />
            <NewsletterSection />
        </>
    );
}
