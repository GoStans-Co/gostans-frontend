import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useApiServices } from '@/services/api';
import { TourListResponse } from '@/services/api/tours/types';
import TourCard from '@/components/tours/ToursCard';
import Button from '@/components/common/Button';
import SkeletonLoader from '@/components/common/SkeletonLoader';

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
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
    padding: 0 ${({ theme }) => theme.spacing.lg};
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        text-align: left;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const BackButtonContainer = styled.div`
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
        text-align: center;
    }
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes['2xl']};
        text-align: left;
    }
`;

const PageTitleSpan = styled.span`
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary} 0%,
        ${({ theme }) => theme.colors.secondary} 50%,
        ${({ theme }) => theme.colors.accent || theme.colors.primary} 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.primary} 0%,
            ${({ theme }) => theme.colors.secondary} 100%
        );
        border-radius: 2px;
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.lightText};
    font-weight: 500;
    margin: 0;
    line-height: 1.6;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
    }
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

const ToursList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: ${({ theme }) => theme.spacing.xl};
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
        padding: 0 ${({ theme }) => theme.spacing.lg};
        margin: 0;
        width: 100%;
    }
`;

const TourCardWrapper = styled(motion.div)`
    width: 100%;
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
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 500px;
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

/**
 * TopDestinationsByCity - Page Component
 * @description Displays all tours available in a specific city and country.
 * Fetches tours based on the city and country IDs from the URL parameters.
 * Shows a loading state while fetching data, and handles empty states gracefully.
 */
export default function TopDestinationsByCity() {
    const [tours, setTours] = useState<TourListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cityName, setCityName] = useState('');
    const [countryName, setCountryName] = useState('');

    const hasFetched = useRef(false);
    const currentParams = useRef({ cityId: '', countryId: '' });
    const { cityId, countryId } = useParams<{ cityId: string; countryId: string }>();
    const navigate = useNavigate();

    const { tours: toursService } = useApiServices();

    useEffect(() => {
        const paramsChanged = currentParams.current.cityId !== cityId || currentParams.current.countryId !== countryId;

        if (hasFetched.current && !paramsChanged) return;

        currentParams.current = { cityId: cityId || '', countryId: countryId || '' };
        hasFetched.current = true;

        const fetchToursByDestination = async () => {
            if (!cityId || !countryId) {
                navigate('/destinations');
                return;
            }

            setIsLoading(true);
            try {
                const response = await toursService.getToursByDestination({
                    countryId: parseInt(countryId),
                    cityId: parseInt(cityId),
                    page: 1,
                    pageSize: 20,
                });

                if (response.data?.results) {
                    setTours(response.data.results);

                    if (response.data.results.length > 0) {
                        const firstTour = response.data.results[0];
                        setCityName(firstTour.cityName || 'Unknown City');
                        setCountryName(firstTour.countryName || 'Unknown Country');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch tours by destination:', error);
                setTours([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchToursByDestination();
    }, [cityId, countryId, navigate]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.02 },
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

    const handleBackClick = () => {
        navigate('/top-destinations');
    };

    if (!cityId || !countryId) {
        return null;
    }

    return (
        <PageContainer>
            <HeaderSection>
                <BackButtonContainer>
                    <Button
                        variant="text"
                        size={window.innerWidth <= 768 ? 'xs' : 'sm'}
                        onClick={handleBackClick}
                        startIcon={<FaArrowLeft size={window.innerWidth <= 768 ? 12 : 14} />}
                        style={{
                            padding: window.innerWidth <= 768 ? '6px 12px' : undefined,
                            fontSize: window.innerWidth <= 768 ? '0.875rem' : undefined,
                        }}
                    >
                        {window.innerWidth <= 768 ? 'Back' : 'Back to Destinations'}
                    </Button>
                </BackButtonContainer>

                <PageTitle>
                    All Top Tours in{' '}
                    <PageTitleSpan>
                        {cityName || 'Selected Destination'}
                        {countryName && `, ${countryName}`}
                    </PageTitleSpan>
                </PageTitle>
                <PageSubtitle>Discover amazing tours and experiences in this beautiful destination</PageSubtitle>
            </HeaderSection>

            {!isLoading && tours.length > 0 && (
                <ResultsCount>
                    Found <span>{tours.length}</span> tour{tours.length !== 1 ? 's' : ''} available
                </ResultsCount>
            )}

            <AnimatePresence>
                {isLoading ? (
                    <ToursList>
                        <SkeletonLoader type="tour" count={6} />
                    </ToursList>
                ) : tours.length > 0 ? (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <ToursList>
                            {tours.map((tour, index) => (
                                <Link
                                    to={`/searchTrips/${tour.uuid}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    key={tour.id}
                                >
                                    <TourCardWrapper
                                        key={tour.id}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <TourCard
                                            id={tour.id}
                                            title={tour.title}
                                            shortDescription={tour.shortDescription || ''}
                                            price={Number(tour.price || 0)}
                                            currency={tour.currency || 'USD'}
                                            mainImage={tour.mainImage}
                                            tourType={tour.tourType}
                                            country={tour.countryName || countryName}
                                            isLiked={tour.isLiked || false}
                                            variant="button"
                                            buttonText="View more"
                                            uuid={tour.uuid}
                                        />
                                    </TourCardWrapper>
                                </Link>
                            ))}
                        </ToursList>
                    </motion.div>
                ) : (
                    <EmptyStateContainer>
                        <EmptyStateIcon>🏔️</EmptyStateIcon>
                        <EmptyStateTitle>No tours found</EmptyStateTitle>
                        <EmptyStateDescription>
                            Unfortunately, there are no tours available for this destination at the moment. Please check
                            back later or explore other destinations.
                        </EmptyStateDescription>
                        <Button variant="secondary" size="md" onClick={handleBackClick} startIcon={<FaArrowLeft />}>
                            Explore Other Destinations
                        </Button>
                    </EmptyStateContainer>
                )}
            </AnimatePresence>
        </PageContainer>
    );
}
