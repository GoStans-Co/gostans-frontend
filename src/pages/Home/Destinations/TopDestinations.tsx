import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { useApiServices } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { TopDestination } from '@/services/api/tours';
import { useDestinationsCache } from '@/hooks/api/useDestinationCache';
import TourCard from '@/components/Tours/ToursCard';
import { Link } from 'react-router-dom';
import Tabs, { TabItem } from '@/components/Common/Tabs';
import Input from '@/components/Common/Input';
import SkeletonLoader from '@/components/Common/SkeletonLoader';

type DestinationData = {
    id: string;
    name: string;
    country: string;
    countryId: number;
    tourCount: number;
    image: string;
};

const PageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.lightBackground} 0%,
        ${({ theme }) => theme.colors.grayBackground} 100%
    );
    padding: ${({ theme }) => theme.spacing['2xl']} 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md} 0;
    }
`;

const HeaderSection = styled.div`
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const PageTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary} 0%,
        ${({ theme }) => theme.colors.secondary} 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes['3xl']};
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    font-weight: 500;
    text-align: left;
    margin: 0 auto;
    line-height: 1.6;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        padding: 0;
        white-space: normal;
    }
`;

const FilterSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding: 0 ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.lg};
        align-items: stretch;
    }
`;

const SearchContainer = styled.div`
    position: relative;
    max-width: 400px;
    width: 100%;
    min-width: 250px;

    ${({ theme }) => theme.responsive.maxMobile} {
        max-width: 100%;
        min-width: auto;
    }

    & > div {
        width: 100%;
    }
`;

const TabsContainer = styled.div`
    flex: 1;
    min-width: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: none;
        width: 100%;
        order: 2;
    }
`;

const SearchWrapper = styled.div`
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        order: 1;
        width: 100%;
    }
`;

const DestinationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: ${({ theme }) => theme.spacing.xl};
        padding: 0 ${({ theme }) => theme.spacing.lg};
    }
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${({ theme }) => theme.spacing['5xl']} ${({ theme }) => theme.spacing['2xl']};
    min-height: 400px;
`;

const EmptyStateIcon = styled.div`
    font-size: ${({ theme }) => theme.fontSizes['7xl']};
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
    opacity: 0.7;
    line-height: 1;
`;

const EmptyStateTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 500px;
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const EmptyStateSuggestions = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};

    ${({ theme }) => theme.responsive.minTablet} {
        flex-direction: row;
        gap: ${({ theme }) => theme.spacing['2xl']};
    }
`;

const EmptyStateSuggestion = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    &:before {
        content: '💡';
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

export default function TopDestinations() {
    const [destinations, setDestinations] = useState<DestinationData[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<DestinationData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCountry, setActiveCountry] = useState('all');
    const [countries, setCountries] = useState<TopDestination[]>([]);

    const { tours: toursService } = useApiServices();
    const { cachedData, isLoading, fetchTopDestinations } = useDestinationsCache();

    /* we transform the cached data into a flat list of destinations */
    const transformedDestinations = useMemo(() => {
        const dataSource = cachedData && cachedData.length > 0 ? cachedData : countries;
        return dataSource.flatMap((country: TopDestination) =>
            country.destinationSet.map((city) => ({
                id: `${country.name.toLowerCase()}-${city.name.toLowerCase()}`,
                name: city.name,
                country: country.name,
                countryId: country.id,
                tourCount: city.tourCount,
                image:
                    city.image ||
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop',
            })),
        );
    }, [cachedData, countries]);

    /* here we fist fetch destinations with cache-first strategy */
    useEffect(() => {
        const loadDestinations = async () => {
            if (!cachedData || cachedData.length === 0) {
                try {
                    console.log('Fetching destinations from API');
                    const data = await fetchTopDestinations(toursService);
                    setCountries(data);
                } catch (error) {
                    console.error('Failed to load destinations:', error);
                    setCountries([]);
                }
            } else {
                console.log('Using cached destinations data');
                setCountries(cachedData);
            }
        };

        loadDestinations();
    }, [cachedData, fetchTopDestinations, toursService]);

    /* then we update destinations when transformedDestinations changes */
    useEffect(() => {
        setDestinations(transformedDestinations);
        setFilteredDestinations(transformedDestinations);
    }, [transformedDestinations]);

    useEffect(() => {
        let filtered = destinations;

        if (activeCountry !== 'all') {
            filtered = filtered.filter((dest) => dest.country.toLowerCase() === activeCountry);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (dest) =>
                    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dest.country.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        setFilteredDestinations(filtered);
    }, [destinations, activeCountry, searchTerm]);

    const countryTabs: TabItem[] = useMemo(() => {
        const dataSource = cachedData && cachedData.length > 0 ? cachedData : countries;
        return [
            { id: 'all', label: 'All Countries' },
            ...dataSource.map((country) => ({
                id: country.name.toLowerCase(),
                label: country.name,
            })),
        ];
    }, [cachedData, countries]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02, y: -5 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    if (isLoading) {
        return (
            <PageContainer>
                <HeaderSection>
                    <PageTitle>Top Destinations</PageTitle>
                    <PageSubtitle>Discover amazing places around Central Asia</PageSubtitle>
                </HeaderSection>

                <SkeletonLoader type="destination" count={6} />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <HeaderSection>
                <PageTitle>Top Destinations</PageTitle>
                <PageSubtitle>Discover the most beautiful and popular destinations across Central Asia</PageSubtitle>
            </HeaderSection>

            <FilterSection>
                <TabsContainer>
                    <Tabs
                        tabs={countryTabs}
                        activeTab={activeCountry}
                        onTabChange={setActiveCountry}
                        variant="compact"
                    />
                </TabsContainer>

                <SearchWrapper>
                    <SearchContainer>
                        <Input
                            endIcon={<FaSearch />}
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            inputConfig={{
                                size: 'sm',
                                variant: 'outlined',
                                fullWidth: true,
                                noBorder: true,
                            }}
                        />
                    </SearchContainer>
                </SearchWrapper>
            </FilterSection>

            <AnimatePresence>
                {filteredDestinations.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <DestinationsGrid>
                            {filteredDestinations.map((destination, index) => (
                                <motion.div
                                    key={destination.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        to={`/searchTrips/${destination.id}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <TourCard
                                            id={parseInt(destination.id) || 0}
                                            title={destination.name}
                                            shortDescription={`Explore ${destination.name}, ${destination.country} with ${destination.tourCount}+ available tours. Discover breathtaking landscapes and rich cultural heritage.`}
                                            price={120}
                                            mainImage={destination.image}
                                            variant="button"
                                            buttonText="Explore Tours"
                                            tourType={{
                                                id: destination.countryId,
                                                name: destination.country,
                                            }}
                                            country={destination.country}
                                        />
                                    </Link>
                                </motion.div>
                            ))}
                        </DestinationsGrid>
                    </motion.div>
                ) : (
                    <EmptyStateContainer>
                        <EmptyStateIcon>🏔️</EmptyStateIcon>
                        <EmptyStateTitle>No destinations found</EmptyStateTitle>
                        <EmptyStateDescription>
                            We couldn't find any destinations matching your search criteria. Don't worry, there are
                            still amazing places waiting to be discovered!
                        </EmptyStateDescription>
                        <EmptyStateSuggestions>
                            <EmptyStateSuggestion>Try a different search term</EmptyStateSuggestion>
                            <EmptyStateSuggestion>Check your spelling</EmptyStateSuggestion>
                            <EmptyStateSuggestion>Browse all countries</EmptyStateSuggestion>
                        </EmptyStateSuggestions>
                    </EmptyStateContainer>
                )}
            </AnimatePresence>
        </PageContainer>
    );
}
