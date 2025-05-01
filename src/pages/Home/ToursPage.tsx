import { useState } from 'react';
import styled from 'styled-components';
import { tours } from '@/data/mockData';
import TourCard from '@/components/tours/ToursCard';

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
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: 1.5rem;
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FiltersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const FilterLabel = styled.label`
    font-weight: 500;
    font-size: 0.9rem;
`;

const FilterSelect = styled.select`
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    width: 100%;
    color: white;
`;

const PriceRangeContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: white;
`;

const PriceInput = styled.input`
    width: 100%;
    padding: 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterDivider = styled.span`
    color: ${({ theme }) => theme.colors.lightText};
`;

const ApplyFilterButton = styled.button`
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-weight: 500;
    margin-top: 1rem;
    width: 100%;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondary};
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-column: span 2;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-column: span 1;
    }
`;

const ToursGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

export default function ToursPage() {
    const [selectedCountry, setSelectedCountry] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const filteredTours = tours.filter((tour) => {
        const matchesCountry =
            selectedCountry === 'all' || tour.country.toLowerCase() === selectedCountry.toLowerCase();

        const matchesDuration =
            selectedDuration === 'all' ||
            (selectedDuration === 'short' && tour.days && tour.days <= 7) ||
            (selectedDuration === 'medium' && tour.days && tour.days > 7 && tour.days <= 14) ||
            (selectedDuration === 'long' && tour.days && tour.days > 14);

        const matchesMinPrice = !minPrice || tour.price >= parseInt(minPrice);
        const matchesMaxPrice = !maxPrice || tour.price <= parseInt(maxPrice);

        return matchesCountry && matchesDuration && matchesMinPrice && matchesMaxPrice;
    });

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>Explore Tours</PageTitle>
                <PageDescription>
                    Find your perfect adventure with our curated selection of tours across Central Asia.
                </PageDescription>
            </PageHeader>

            <FiltersContainer>
                <FiltersGrid>
                    <FilterGroup>
                        <FilterLabel htmlFor="country">Destination</FilterLabel>
                        <FilterSelect
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                        >
                            <option value="all">All Countries</option>
                            <option value="uzbekistan">Uzbekistan</option>
                            <option value="kazakhstan">Kazakhstan</option>
                            <option value="kyrgyzstan">Kyrgyzstan</option>
                            <option value="tajikistan">Tajikistan</option>
                            <option value="turkmenistan">Turkmenistan</option>
                        </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                        <FilterLabel htmlFor="duration">Duration</FilterLabel>
                        <FilterSelect
                            id="duration"
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                        >
                            <option value="all">Any Duration</option>
                            <option value="short">Short (1-7 days)</option>
                            <option value="medium">Medium (8-14 days)</option>
                            <option value="long">Long (14+ days)</option>
                        </FilterSelect>
                    </FilterGroup>

                    <FilterGroup>
                        <FilterLabel>Price Range</FilterLabel>
                        <PriceRangeContainer>
                            <PriceInput
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <FilterDivider>-</FilterDivider>
                            <PriceInput
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </PriceRangeContainer>
                    </FilterGroup>

                    <ApplyFilterButton>Apply Filters</ApplyFilterButton>
                </FiltersGrid>
            </FiltersContainer>

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
                    />
                ))}
            </ToursGrid>
        </PageContainer>
    );
}
