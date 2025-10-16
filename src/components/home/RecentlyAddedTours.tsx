import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TourListResponse } from '@/services/api/tours';
import TourCard from '@/components/tours/ToursCard';
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

type RecentlyAddedToursProps = {
    tours: TourListResponse[];
    loading: boolean;
};

const Container = styled.section`
    padding: 4rem 2rem;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;

    ${({ theme }) => theme.responsive.maxMobile} {
        background: none;
        padding: 2rem 1rem;
    }
`;

const ContentWrapper = styled.div`
    max-width: 1280px;
    margin: 0 auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
    }
`;

const ViewAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.875rem;

        svg {
            width: 14px;
            height: 14px;
        }
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    overflow: hidden;
`;

const SkeletonCard = styled.div`
    flex: 0 0 calc(25% - 18px);
    min-width: 280px;
    height: 320px;
    background: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    animation: pulse 1.5s ease-in-out infinite;

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: 0 0 260px;
    }
`;

const ScrollContainer = styled.div`
    position: relative;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin: 0 -${({ theme }) => theme.spacing.md};
        padding: 0 ${({ theme }) => theme.spacing.md};
    }
`;

const ToursGrid = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.lg};
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const TourCardWrapper = styled.div`
    flex: 0 0 calc(25% - 18px);
    min-width: 280px;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: 0 0 calc(75% - 8px);
        min-width: 240px;
    }
`;

const ScrollButton = styled.button<{ direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${({ direction }) => (direction === 'left' ? 'left: -20px;' : 'right: -20px;')}
    z-index: 10;
    background: white;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: all 0.3s ease;

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground};
        transform: translateY(-50%) scale(1.1);
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    gap: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
        margin-bottom: 0.2rem;
        gap: 2rem;
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 1.5rem;
    }
`;

const SectionSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 1200px;
    margin: 0 auto 2rem;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.875rem;
        text-align: left;
    }
`;

/**
 * Recently Added Tours - Organism Component
 * @description Displays a scrollable list of recently added tours with a title, subtitle, and scroll buttons.
 * @param {Array} tours - The list of recently added tours.
 * @param {boolean} loading - Indicates if the tours are still loading.
 */
export default function RecentlyAddedTours({ tours, loading }: RecentlyAddedToursProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            const currentScroll = scrollRef.current.scrollLeft;
            const targetScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

            scrollRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    return (
        <Container>
            <ContentWrapper>
                <SectionHeader>
                    <SectionTitle>Recently Added Tours</SectionTitle>
                    <ViewAllLink to="/searchTrips">
                        Explore All
                        <ArrowRightIcon size={18} />
                    </ViewAllLink>
                </SectionHeader>
                <SectionSubtitle>Discover our newest adventures and experiences</SectionSubtitle>
                <ScrollContainer>
                    {!loading && tours.length > 4 && (
                        <>
                            <ScrollButton
                                direction="left"
                                onClick={() => handleScroll('left')}
                                aria-label="Scroll left"
                            >
                                <ChevronLeft size={20} />
                            </ScrollButton>
                            <ScrollButton
                                direction="right"
                                onClick={() => handleScroll('right')}
                                aria-label="Scroll right"
                            >
                                <ChevronRight size={20} />
                            </ScrollButton>
                        </>
                    )}

                    {loading ? (
                        <LoadingContainer>
                            {[...Array(4)].map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </LoadingContainer>
                    ) : (
                        <ToursGrid ref={scrollRef}>
                            {tours.map((tour) => (
                                <TourCardWrapper key={tour.id}>
                                    <TourCard
                                        buttonText="See Details"
                                        id={tour.id}
                                        uuid={tour.uuid}
                                        title={tour.title}
                                        shortDescription={tour.shortDescription}
                                        price={Number(tour.price)}
                                        mainImage={tour.mainImage}
                                        country={tour.countryName ? tour.countryName : ''}
                                        isLiked={tour.isLiked}
                                        variant="link"
                                        tourType={tour.tourType}
                                        currency={tour.currency}
                                    />
                                </TourCardWrapper>
                            ))}
                        </ToursGrid>
                    )}
                </ScrollContainer>
            </ContentWrapper>
        </Container>
    );
}
