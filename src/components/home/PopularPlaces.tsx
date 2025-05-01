import styled from 'styled-components';
import { Link } from 'react-router-dom';
import DestinationCard, { DestinationProps } from '@/components/destinations/DestinationCard';
import { useState } from 'react';

const SectionContainer = styled.section`
    padding: 4rem 2rem;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.75rem;
    }
`;

const ViewAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        text-decoration: underline;
    }
`;

const DestinationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
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
    padding-bottom: 0.5rem;

    &::-webkit-scrollbar {
        height: 4px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.lightBackground};
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 10px;
    }
`;

const Tab = styled.button<{ active: boolean }>`
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    font-weight: 500;
    white-space: nowrap;
    background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.lightBackground)};
    color: ${({ active }) => (active ? 'white' : 'inherit')};
    transition: all ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.border)};
    }

    &:focus {
        outline: none; /* Remove outline on focus state */
        box-shadow: none; /* Remove any box shadow on focus */
    }

    &:active {
        outline: none; /* Remove outline on active state */
        border: none; /* Ensure no border on active state */
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
                    <DestinationCard
                        shape="oval"
                        key={destination.id}
                        id={destination.id}
                        name={destination.name}
                        image={destination.image}
                        toursCount={destination.toursCount}
                    />
                ))}
            </DestinationsGrid>
        </SectionContainer>
    );
}
