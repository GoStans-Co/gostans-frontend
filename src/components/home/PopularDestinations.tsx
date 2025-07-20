import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DestinationCard, { DestinationProps } from '@/components/Destinations/DestinationCard';
import { useState } from 'react';
import TabContainer, { TabItem } from '@/components/Common/Tabs';
import { TopDestination } from '@/services/api/tours';
import SkeletonLoader from '@/components/Common/SkeletonLoader';

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

const DestinationsGrid = styled.div`
    display: flex;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: visible;
    padding: 0 0 1rem 0;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.5rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
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

export default function PopularDestinations({ destinations, loading = false, countries }: PopularDestinationsProps) {
    const [activeTab, setActiveTab] = useState('all');

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
                    <ViewAllLink to="/destinations">
                        Explore All
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
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
                <ViewAllLink to="/destinations">
                    Explore All
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </ViewAllLink>
            </SectionHeader>

            <TabContainer tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="centered" />

            <DestinationsGrid>
                {filteredDestinations.map((destination) => (
                    <MobileDestinationItem key={destination.id}>
                        <DestinationCard
                            shape="oval"
                            id={destination.id}
                            name={destination.name}
                            image={destination.image}
                            toursCount={destination.toursCount}
                        />
                    </MobileDestinationItem>
                ))}
            </DestinationsGrid>
        </SectionContainer>
    );
}
