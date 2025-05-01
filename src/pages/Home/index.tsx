import Hero from '@/components/home/Hero';
import { tours, destinations, accommodations } from '../../data/mockData';
import PopularDestinations from '@/components/home/PopularPlaces';
import TrendingTours from '@/components/home/TrendingTours';
import PopularAccommodations from '@/components/home/PopularAccomadations';
import CityExpertSection from './CityExpert';
import NewsletterSection from './NewsLetter';

export default function HomePage() {
    return (
        <>
            <Hero />
            <PopularDestinations destinations={destinations} />
            <TrendingTours tours={tours} />
            <CityExpertSection />
            <PopularAccommodations accommodations={accommodations} />
            <NewsletterSection />
        </>
    );
}
