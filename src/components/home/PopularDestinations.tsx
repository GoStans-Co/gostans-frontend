import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DestinationCard, { DestinationProps } from '@/components/destinations/DestinationCard';
import { useState, useRef } from 'react';
import TabContainer, { TabItem } from '@/components/common/Tabs';
import { TopDestination } from '@/services/api/tours';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react';

type PopularDestinationsProps = {
    destinations: DestinationProps[];
    loading?: boolean;
    countries: TopDestination[];
};

const SectionContainer = styled.section`
    padding-top: 2rem;
    padding-bottom: 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding-left: 1rem;
        padding-right: 1rem;
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

    ${({ theme }) => theme.responsive.minDesktop} {
        margin-bottom: 2rem;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
        margin-bottom: 2rem;
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

const DestinationsContainer = styled.div`
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
`;

const DestinationsGrid = styled.div`
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    overflow-y: visible;
    padding: 0 0 1rem 0;
    scroll-behavior: smooth;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.8rem;
        scroll-snap-type: x mandatory;
        padding: 0 0 1rem 0;

        scrollbar-width: none;
        -ms-overflow-style: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const MobileDestinationItem = styled.div`
    flex: 0 0 auto;
    width: 170px;
    min-width: 170px;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: 0 0 90px;
        width: 90px;
        min-width: 90px;
        scroll-snap-align: start;
    }
`;

const ScrollButton = styled.button<{ $direction: 'left' | 'right' }>`
    position: absolute;
    top: 40%;
    transform: translateY(-50%);
    ${({ $direction }) => ($direction === 'left' ? 'left: -20px;' : 'right: -20px;')}
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.lightBackground};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: ${({ theme }) => theme.transitions.fast};
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
        transform: translateY(-50%) scale(1.05);
    }

    &:active {
        transform: translateY(-50%) scale(0.95);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        display: none;
    }
`;

export default function PopularDestinations({ destinations, loading = false, countries }: PopularDestinationsProps) {
    const [activeTab, setActiveTab] = useState('all');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleScroll = ($direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = $direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth',
            });
        }
    };

    const tabs: TabItem[] = [
        { id: 'all', label: 'All' },
        ...countries.map((country) => ({
            id: country.name.toLowerCase(),
            label: country.name,
        })),
    ];

    const filteredDestinations =
        activeTab === 'all'
            ? destinations.slice(0, 12)
            : destinations.filter((dest) => dest.country?.toLowerCase() === activeTab);

    if (loading) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Top destinations</SectionTitle>
                    <ViewAllLink to="/top-destinations">
                        Explore All
                        <ArrowRightIcon size={18} />
                    </ViewAllLink>
                </SectionHeader>

                <SkeletonLoader type="destination" count={6} />
            </SectionContainer>
        );
    }

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>Top destinations</SectionTitle>
                <ViewAllLink to="/top-destinations">
                    Explore All
                    <ArrowRightIcon size={18} />
                </ViewAllLink>
            </SectionHeader>

            <TabContainer tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="centered" />

            <DestinationsContainer>
                {!loading && filteredDestinations.length > 4 && (
                    <>
                        <ScrollButton $direction="left" onClick={() => handleScroll('left')} aria-label="Scroll left">
                            <ChevronLeft size={20} />
                        </ScrollButton>
                        <ScrollButton
                            $direction="right"
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={20} />
                        </ScrollButton>
                    </>
                )}
                <DestinationsGrid ref={scrollContainerRef}>
                    {filteredDestinations.map((destination) => (
                        <MobileDestinationItem key={destination.id}>
                            <Link
                                to={`/top-destinations/${destination.cityId}/${destination.countryId}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <DestinationCard
                                    shape="oval"
                                    id={destination.id}
                                    name={destination.name}
                                    image={destination.image}
                                    toursCount={destination.toursCount}
                                />
                            </Link>
                        </MobileDestinationItem>
                    ))}
                </DestinationsGrid>
            </DestinationsContainer>
        </SectionContainer>
    );
}
