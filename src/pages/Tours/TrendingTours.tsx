import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useApiServices } from '@/services/api';
import { TourProps } from '@/types/index';
import TourCard from '@/components/Tours/ToursCard';
import Button from '@/components/Common/Button';
import defaultImage from '@/assets/default/default_1.jpg';

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

const TabsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;
    overflow-x: auto;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.5rem;
        padding: 0 1rem;
    }

    &::-webkit-scrollbar {
        display: none;
    }

    scrollbar-width: none;
`;

const Tab = styled.button<{ active: boolean }>`
    padding: 0.375rem 1rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;
    border: none;
    background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightBackground)};
    color: ${({ active }) => (active ? 'white' : 'inherit')};
    transition: all ${({ theme }) => theme.transitions.default};
    cursor: pointer;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0.3rem 0.8rem;
        font-size: 0.8rem;
    }

    &:hover {
        background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }
`;

export default function TrendingToursPage() {
    const { tours: toursService } = useApiServices();

    const [allTours, setAllTours] = useState<TourProps[]>([]);
    const [filteredTours, setFilteredTours] = useState<TourProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [availableTabs, setAvailableTabs] = useState<{ id: string; label: string }[]>([]);

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
                    const uniqueTypes = Array.from(
                        new Set(transformedTours.map((tour) => tour.tourType?.name).filter(Boolean)),
                    );

                    const tabs = [
                        { id: 'all', label: 'All Tours' },
                        ...uniqueTypes.map((type) => ({
                            id: type.toLowerCase().replace(/\s+/g, '-'),
                            label: type,
                        })),
                    ];

                    setAllTours(transformedTours);
                    setFilteredTours(transformedTours);
                    setAvailableTabs(tabs);
                }
            } catch (error) {
                console.error('Failed to fetch trending tours:', error);
                setAllTours([]);
                setFilteredTours([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingTours();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (activeTab === 'all') {
            setFilteredTours(allTours);
        } else {
            const filtered = allTours.filter(
                (tour) => tour.tourType?.name.toLowerCase().replace(/\s+/g, '-') === activeTab,
            );
            setFilteredTours(filtered);
        }
    }, [activeTab, allTours]);

    if (loading) {
        return (
            <PageContainer>
                <LoadingContainer>Loading tours...</LoadingContainer>
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

                <TabsContainer>
                    {availableTabs.map((tab) => (
                        <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </Tab>
                    ))}
                </TabsContainer>

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

            <TabsContainer>
                {availableTabs.map((tab) => (
                    <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </Tab>
                ))}
            </TabsContainer>

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
                            mainImage={defaultImage}
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
