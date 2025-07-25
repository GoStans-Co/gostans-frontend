import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TourCard from '@/components/Tours/ToursCard';
import Button from '@/components/Common/Button';
import defaultImage from '@/assets/default/default_1.jpg';
import { TabItem } from '@/components/Common/Tabs';
import Tabs from '@/components/Common/Tabs';
import { TourPropsResponse } from '@/services/api/tours';
import useTrendingTours from '@/hooks/api/useTrendingTours';

const PageContainer = styled.div`
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
    }
`;

const PageHeader = styled.div`
    // max-width: 1200px;
    margin: 0 auto 2rem auto;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    padding: 2rem 0 2rem 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 2rem;
    }
`;

const PageTitle = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 2rem;
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 600px;
    margin: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
    }
`;

const ToursGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin: 0 auto;
    margin-bottom: 3rem;
    padding-top: 1rem;
    padding-bottom: 3rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    ${({ theme }) => theme.responsive.tablet} {
        grid-template-columns: repeat(2, 1fr);
    }

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: repeat(3, 1fr);
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

    if (filteredTours.length === 0 && !loading) {
        return (
            <PageContainer>
                <PageHeader>
                    <PageTitle>Trending Tours</PageTitle>
                    <PageSubtitle>
                        Discover our most popular tours and experiences. Find your perfect adventure from our curated
                        collection.
                    </PageSubtitle>
                </PageHeader>

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
            <PageHeader>
                <PageTitle>Trending Tours</PageTitle>
                <PageSubtitle>
                    Discover our most popular tours and experiences. Find your perfect adventure from our curated
                    collection.
                </PageSubtitle>
            </PageHeader>

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
        </PageContainer>
    );
}
