import { useEffect, useState } from 'react';
import { useApiServices } from '@/services/api';
import { TourProps } from '@/types/index';
import PopularDestinations from '@/components/Home/PopularDestinations';
import CityExpertSection from '@/pages/Home/CityExpert';
import NewsletterSection from '@/pages/Home/NewsLetter';
import PopularAccommodations from '@/components/Home/PopularAccomadations';
import FirstHome from '@/components/Home/FirstHome';
import { destinations, accommodations } from '@/data/mockData';
import TrendingTours from '@/components/Home/TrendingTours';

export default function HomePage() {
    const [tours, setTours] = useState<TourProps[]>([]);
    const [loading, setLoading] = useState(true);
    const { tours: toursService } = useApiServices();

    useEffect(() => {
        const fetchTrendingTours = async () => {
            try {
                setLoading(true);
                const response = await toursService.getTrendingTours();

                if (response.data) {
                    const transformedTours: TourProps[] = response.data.map((tour: TourProps) => ({
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

    return (
        <>
            <FirstHome />
            <PopularDestinations destinations={destinations} />
            <TrendingTours tours={tours} loading={loading} />
            <CityExpertSection />
            <PopularAccommodations accommodations={accommodations} />
            <NewsletterSection />
        </>
    );
}
