import { useState } from 'react';
import styled from 'styled-components';
import { tours } from '@/data/mockData';
import TourCard from '@/components/Tours/ToursCard';

const PageContainer = styled.div`
    padding: 0;
`;

const PageHeader = styled.div`
    background-color: ${({ theme }) => theme.colors.lightBackground};
    color: white;
    padding: 2rem 1rem;
    margin-bottom: 2rem;
    text-align: center;
`;

const PageTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 2rem;
    }
`;

const ToursGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    width: 100%;
    margin: 0;
    padding: 0;
    padding-bottom: 5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

const FilterTagsContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        gap: 0.5rem;
    }
`;

const FilterTag = styled.button<{ isActive: boolean }>`
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => theme.borderRadius.full || '9999px'};
    border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.border)};
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
    color: ${({ theme, isActive }) => (isActive ? 'white' : theme.colors.text)};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.default};

    &:hover {
        background-color: ${({ theme, isActive }) =>
            isActive ? theme.colors.secondary : theme.colors.lightBackground};
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

export default function ToursPage() {
    const [selectedCountry, setSelectedCountry] = useState('all');

    const filteredTours = tours.filter((tour) => {
        if (selectedCountry === 'all') return true;
        return tour.country.toLowerCase() === selectedCountry.toLowerCase();
    });

    const countries = [
        { value: 'all', label: 'All' },
        { value: 'uzbekistan', label: 'Uzbekistan' },
        { value: 'kazakhstan', label: 'Kazakhstan' },
        { value: 'kyrgyzstan', label: 'Kyrgyzstan' },
        { value: 'tajikistan', label: 'Tajikistan' },
        { value: 'turkmenistan', label: 'Turkmenistan' },
    ];

    const handleCountryFilter = (countryValue: string) => {
        setSelectedCountry(countryValue);
    };

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Explore Tours</PageTitle>
            </PageHeader>

            <FilterTagsContainer>
                {countries.map((country) => (
                    <FilterTag
                        key={country.value}
                        isActive={selectedCountry === country.value}
                        onClick={() => handleCountryFilter(country.value)}
                    >
                        {country.label}
                    </FilterTag>
                ))}
            </FilterTagsContainer>

            <ToursGrid>
                {filteredTours.map((tour) => (
                    <TourCard
                        key={tour.id}
                        id={tour.id}
                        title={tour.title}
                        description={tour.description}
                        price={tour.price}
                        image={tour.image}
                        country={tour.country}
                        status={tour.status}
                    />
                ))}
            </ToursGrid>
            {filteredTours.length === 0 && (
                <PageHeader>
                    <PageTitle>No tours found for this filter</PageTitle>
                </PageHeader>
            )}
        </PageContainer>
    );
}
