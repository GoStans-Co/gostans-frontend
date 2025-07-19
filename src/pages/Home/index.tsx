import { tours, destinations, accommodations } from '@/data/mockData';
import PopularDestinations from '@/components/Home/PopularPlaces';
import TrendingTours from '@/components/Home/TrendingTours';
import CityExpertSection from '@/pages/Home/CityExpert';
import NewsletterSection from '@/pages/Home/NewsLetter';
import PopularAccommodations from '@/components/Home/PopularAccomadations';
import FirstHome from '@/components/Home/FirstHome';

export default function HomePage() {
    return (
        <>
            <FirstHome />
            <PopularDestinations destinations={destinations} />
            <TrendingTours tours={tours} />
            <CityExpertSection />
            <PopularAccommodations accommodations={accommodations} />
            <NewsletterSection />
        </>
    );
}
