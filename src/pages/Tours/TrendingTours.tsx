import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TourCard from '@/components/tours/ToursCard';
import Button from '@/components/common/Button';
import defaultImage from '@/assets/default/default_1.jpg';
import { TabItem } from '@/components/common/Tabs';
import Tabs from '@/components/common/Tabs';
import { TourPropsResponse } from '@/services/api/tours';
import useTrendingTours from '@/hooks/api/useTrendingTours';

const PageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.lightBackground} 0%,
        ${({ theme }) => theme.colors.grayBackground} 100%
    );
    padding: ${({ theme }) => theme.spacing['2xl']} 2rem;
    padding-bottom: ${({ theme }) => theme.spacing['5xl']};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const ContentContainer = styled.div`
    padding: 0 ${({ theme }) => theme.spacing.lg};
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    width: 100%;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
        margin: 0;
        gap: ${({ theme }) => theme.spacing.sm};
    }

    ${({ theme }) => theme.responsive.tablet} {
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;

const HeaderSection = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding: 0;
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

const ToursGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
    margin: 0 auto;
    margin-bottom: 3rem;
    padding-top: 1rem;
    padding-bottom: 3rem;
    width: 100%;
    max-width: 100%;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-top: 0.5rem;
        padding-bottom: 1.5rem;
    }

    ${({ theme }) => theme.responsive.tablet} {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
    }

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;
    }

    @media (min-width: 1200px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    color: ${({ theme }) => theme.colors.error};
    text-align: center;
`;

const RetryButton = styled(Button)`
    margin-top: 1rem;
`;

const EmptyStateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: ${({ theme }) => theme.spacing['5xl']} ${({ theme }) => theme.spacing['2xl']};
    min-height: 350px;
`;

const EmptyStateIcon = styled.div`
    font-size: ${({ theme }) => theme.fontSizes['7xl']};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
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

/**
 * TrendingTours - Page Component
 * @description This component displays trending tours with filtering options based on tour types.
 * It fetches data from the API and allows users to navigate to individual tour details.
 */
export default function TrendingTours() {
    const [filteredTours, setFilteredTours] = useState<TourPropsResponse[]>([]);
    const [activeTab, setActiveTab] = useState('all');

    const { tours, tourTypes, loading, error, fetchTrendingTours } = useTrendingTours();

    /* we fetch the tours when component mounts, this will use cached data if available */
    useEffect(() => {
        fetchTrendingTours();
    }, [fetchTrendingTours]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /* filter tours based on active tab */
    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredTours(tours);
        } else {
            const filtered = tours.filter(
                (tour) => tour.tourType?.name.toLowerCase().replace(/\s+/g, '-') === activeTab,
            );
            setFilteredTours(filtered);
        }
    }, [activeTab, tours]);

    const tabs: TabItem[] = tourTypes.map((tab) => ({
        id: tab.id,
        label: tab.label,
    }));

    if (loading) {
        return (
            <PageContainer>
                <LoadingContainer>Loading tours...</LoadingContainer>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ErrorContainer>
                    <p>{error}</p>
                    <RetryButton variant="primary" onClick={() => window.location.reload()}>
                        Retry
                    </RetryButton>
                </ErrorContainer>
            </PageContainer>
        );
    }

    if (error || filteredTours.length === 0) {
        return (
            <PageContainer>
                <HeaderSection>
                    <PageTitle>Trending Tours</PageTitle>
                    <PageSubtitle>
                        Discover our most popular tours and experiences. Find your perfect adventure from our curated
                        collection.
                    </PageSubtitle>
                </HeaderSection>

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="default" />

                <EmptyStateContainer>
                    <EmptyStateIcon>🏔️</EmptyStateIcon>
                    <EmptyStateTitle>No destinations found</EmptyStateTitle>
                    <EmptyStateDescription>
                        {error
                            ? "We couldn't load destinations due to an error. Please try again."
                            : "We couldn't find any destinations matching your search criteria. Try adjusting your search or browse all destinations."}
                    </EmptyStateDescription>
                    <RetryButton variant="primary" onClick={() => setActiveTab('all')}>
                        <Link to="/searchTrips">Search All Tours</Link>
                    </RetryButton>
                </EmptyStateContainer>
            </PageContainer>
        );
    }

    /* if there is data and no error, but filteredTours is empty for the selected tab */
    if (filteredTours.length === 0 && !loading && !error && tours.length > 0) {
        return (
            <PageContainer>
                <HeaderSection>
                    <PageTitle>Trending Tours</PageTitle>
                    <PageSubtitle>
                        Discover our most popular tours and experiences. Find your perfect adventure from our curated
                        collection.
                    </PageSubtitle>
                </HeaderSection>

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="default" />

                <ErrorContainer>
                    <p>No tours available for this category.</p>
                    <RetryButton variant="primary" onClick={() => setActiveTab('all')}>
                        Show All Tours
                    </RetryButton>
                </ErrorContainer>
            </PageContainer>
        );
    }
    return (
        <PageContainer>
            <ContentContainer>
                <HeaderSection>
                    <PageTitle>Trending Tours</PageTitle>
                    <PageSubtitle>
                        Discover our most popular tours and experiences. Find your perfect adventure from our curated
                        collection.
                    </PageSubtitle>
                </HeaderSection>

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="default" />

                <ToursGrid>
                    {filteredTours.map((tour) => (
                        <Link
                            to={`/searchTrips/${tour.uuid}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            key={tour.id}
                        >
                            <TourCard
                                buttonText="See Details"
                                id={tour.id}
                                title={tour.title}
                                shortDescription={tour.shortDescription}
                                price={tour.price}
                                mainImage={tour.mainImage ? tour.mainImage : defaultImage}
                                country={tour.country}
                                isLiked={tour.isLiked}
                                variant="button"
                                tourType={{ id: tour.tourType?.id || 0, name: tour.tourType?.name || 'General' }}
                                currency={tour.currency}
                            />
                        </Link>
                    ))}
                </ToursGrid>
            </ContentContainer>
        </PageContainer>
    );
}
