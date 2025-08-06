import styled from 'styled-components';
import { useState, useEffect, useMemo } from 'react';
import { useApiServices } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaPlane } from 'react-icons/fa';
import { TopDestination } from '@/services/api/tours';
import { useDestinationsCache } from '@/hooks/api/useDestinationCache';
import { Link } from 'react-router-dom';
import Tabs, { TabItem } from '@/components/Common/Tabs';
import Input from '@/components/Common/Input';
import SkeletonLoader from '@/components/Common/SkeletonLoader';
import Button from '@/components/Common/Button';

type DestinationData = {
    id: string;
    name: string;
    country: string;
    countryId: number;
    cityId?: number;
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
    padding-bottom: ${({ theme }) => theme.spacing['5xl']};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md} 0;
    }
`;

const HeaderSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding: 0 ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const PageTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: 700;
    text-align: left;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary} 0%,
        ${({ theme }) => theme.colors.secondary} 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    font-weight: 500;
    text-align: left;
    margin: 0;
    line-height: 1.6;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;
const FilterSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding: 0 ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.lg};
        align-items: stretch;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const SearchContainer = styled.div`
    position: relative;
    width: 300px;
    min-width: 250px;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        min-width: auto;
    }

    & > div {
        width: 100%;
    }
`;

const SearchWrapper = styled.div`
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        order: 1;
        width: 100%;
    }
`;

const TabsContainer = styled.div`
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: none;
        width: 100%;
        order: 2;
    }
`;

const DestinationCard = styled(motion.div)`
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        transform: translateY(-2px);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};
    text-align: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const ImageContainer = styled.div`
    width: 100%;
    height: 140px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    ${({ theme }) => theme.responsive.maxMobile} {
        height: 120px;
    }
`;

const DestinationImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
`;

const DestinationsList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const InfoSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        text-align: center;
    }
`;

const DestinationName = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 8px;
    min-width: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const LocationText = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
    text-align: left;
`;

const LocationIcon = styled(FaMapMarkerAlt)`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TourCount = styled.div`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary}20,
        ${({ theme }) => theme.colors.secondary}20
    );
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: 16px;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: 500;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
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
`;

const EmptyStateTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 500px;
    line-height: 1.6;
`;

const ResultsCount = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: 0 ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};

    span {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary};
    }
`;

/**
 * TopDestinationsList - Page Component
 * @description This component displays a list of top travel destinations, allowing users to filter
 * by country and search by name. It fetches data from an API service and caches it for performance.
 */
export default function TopDestinationsList() {
    const [destinations, setDestinations] = useState<DestinationData[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<DestinationData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCountry, setActiveCountry] = useState('all');
    const [countries, setCountries] = useState<TopDestination[]>([]);

    const { tours: toursService } = useApiServices();
    const { cachedData, isLoading, fetchTopDestinations } = useDestinationsCache();

    const transformedDestinations = useMemo(() => {
        const dataSource = cachedData && cachedData.length > 0 ? cachedData : countries;
        return dataSource.flatMap((country: TopDestination) =>
            country.destinationSet.map((city) => ({
                id: `${country.name.toLowerCase()}-${city.name.toLowerCase()}`,
                name: city.name,
                country: country.name,
                countryId: country.id,
                cityId: city.city?.id || city.id,
                tourCount: city.tourCount,
                image:
                    city.city?.imageUrl ||
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop',
            })),
        );
    }, [cachedData, countries]);

    useEffect(() => {
        const loadDestinations = async () => {
            if (!cachedData || cachedData.length === 0) {
                try {
                    const data = await fetchTopDestinations(toursService);
                    setCountries(data);
                } catch (error) {
                    console.error('Failed to load destinations:', error);
                    setCountries([]);
                }
            } else {
                setCountries(cachedData);
            }
        };

        loadDestinations();
    }, [cachedData, fetchTopDestinations, toursService]);

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
        hover: { scale: 1.01 },
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
                        tabs={countryTabs.slice(0, 6)}
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

            {filteredDestinations.length > 0 && (
                <ResultsCount>
                    Showing <span>{filteredDestinations.length}</span> destination
                    {filteredDestinations.length !== 1 ? 's' : ''}
                    {searchTerm && ` for "${searchTerm}"`}
                </ResultsCount>
            )}

            <AnimatePresence>
                {filteredDestinations.length > 0 ? (
                    <DestinationsList>
                        {filteredDestinations.map((destination, index) => (
                            <Link
                                to={`/top-destinations/${destination.cityId}/${destination.countryId}`}
                                style={{ textDecoration: 'none' }}
                            >
                                {' '}
                                <DestinationCard
                                    key={destination.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <CardContent>
                                        <ImageContainer>
                                            <DestinationImage
                                                src={destination.image}
                                                alt={`${destination.name}, ${destination.country}`}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src =
                                                        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&auto=format&fit=crop';
                                                }}
                                            />
                                        </ImageContainer>

                                        <InfoSection>
                                            <DestinationName>
                                                <LocationIcon />
                                                <LocationText>{destination.name}</LocationText>
                                            </DestinationName>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    gap: '8px',
                                                    marginTop: '8px',
                                                }}
                                            >
                                                <TourCount>
                                                    <FaPlane />
                                                    {destination.tourCount}+ tours
                                                </TourCount>

                                                <Button
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    variant="primary"
                                                    size="mini"
                                                    startIcon={<FaPlane />}
                                                >
                                                    Explore
                                                </Button>
                                            </div>
                                        </InfoSection>
                                    </CardContent>
                                </DestinationCard>
                            </Link>
                        ))}
                    </DestinationsList>
                ) : (
                    <EmptyStateContainer>
                        <EmptyStateIcon>🏔️</EmptyStateIcon>
                        <EmptyStateTitle>No destinations found</EmptyStateTitle>
                        <EmptyStateDescription>
                            We couldn't find any destinations matching your search criteria. Try adjusting your search
                            or browse all destinations.
                        </EmptyStateDescription>
                    </EmptyStateContainer>
                )}
            </AnimatePresence>
        </PageContainer>
    );
}
