import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DestinationCard, { DestinationProps } from '@/components/Destinations/DestinationCard';
import { useState } from 'react';

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
    padding: 0;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.lightBackground};
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 3px;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 1rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
            display: none;
        }

        scrollbar-width: none;
    }
`;

const MobileDestinationItem = styled.div`
    flex: 0 0 auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex: 0 0 20%;
        scroll-snap-align: start;
    }
`;

const TabsContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    overflow-x: auto;
    align-items: center;
    justify-content: flex-start;
    padding: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.5rem;
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

    &:active {
        outline: none;
        border: none;
    }
`;

type PopularDestinationsProps = {
    destinations: DestinationProps[];
};

export default function PopularDestinations({ destinations }: PopularDestinationsProps) {
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        {
            id: 'all',
            label: 'All',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        },
        {
            id: 'uzbekistan',
            label: 'Uzbekistan',
            image: 'https://images.unsplash.com/photo-1564812567112-59082de362c5',
        },
        {
            id: 'kazakhstan',
            label: 'Kazakhstan',
            image: 'https://images.unsplash.com/photo-1504613856066-2cfec1eb1a0f',
        },
        {
            id: 'kyrgyzstan',
            label: 'Kyrgyzstan',
            image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        },
        {
            id: 'tajikistan',
            label: 'Tajikistan',
            image: 'https://images.unsplash.com/photo-1634403665481-74029274bcd1',
        },
        {
            id: 'turkmenistan',
            label: 'Turkmenistan',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        },
    ];

    const filteredDestinations =
        activeTab === 'all' ? destinations : destinations.filter((dest) => dest.id.includes(activeTab));

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

            <TabsContainer>
                {tabs.map((tab) => (
                    <Tab key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </Tab>
                ))}
            </TabsContainer>

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
