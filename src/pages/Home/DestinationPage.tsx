import { useState } from 'react';
import styled from 'styled-components';
import { destinations } from '@/data/mockData';
import DestinationCard from '@/components/destinations/DestinationCard';

const PageContainer = styled.div`
    padding: 2rem;
`;

const PageHeader = styled.div`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 3rem 2rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const PageTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 2rem;
    }
`;

const PageDescription = styled.p`
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.1rem;
    opacity: 0.9;
`;

const FiltersContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
    }
`;

const FilterLabel = styled.span`
    font-weight: 500;
`;

const FilterSelect = styled.select`
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex: 1;
    }
`;

const SearchInput = styled.input`
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    flex: 1;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
    }
`;

const DestinationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

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

export default function DestinationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');

    const filteredDestinations = destinations.filter((destination) => {
        const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCountry = selectedCountry === 'all' || destination.id.includes(selectedCountry.toLowerCase());
        return matchesSearch && matchesCountry;
    });

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Explore Destinations</PageTitle>
                <PageDescription>
                    Discover beautiful destinations across Central Asia with our curated collection of tours and
                    experiences.
                </PageDescription>
            </PageHeader>

            <FiltersContainer>
                <SearchInput
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <FilterGroup>
                    <FilterLabel>Country:</FilterLabel>
                    <FilterSelect value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                        <option value="all">All Countries</option>
                        <option value="uzbekistan">Uzbekistan</option>
                        <option value="kazakhstan">Kazakhstan</option>
                        <option value="kyrgyzstan">Kyrgyzstan</option>
                        <option value="tajikistan">Tajikistan</option>
                        <option value="turkmenistan">Turkmenistan</option>
                    </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Sort by:</FilterLabel>
                    <FilterSelect>
                        <option value="popular">Popularity</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="tours">Number of Tours</option>
                    </FilterSelect>
                </FilterGroup>
            </FiltersContainer>

            <DestinationsGrid>
                {filteredDestinations.map((destination) => (
                    <DestinationCard
                        shape="rounded"
                        key={destination.id}
                        id={destination.id}
                        name={destination.name}
                        image={destination.image}
                        toursCount={destination.toursCount}
                    />
                ))}
            </DestinationsGrid>
        </PageContainer>
    );
}
