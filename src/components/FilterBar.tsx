import { useState } from 'react';
import styled from 'styled-components';
import { FaStar, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaUtensils } from 'react-icons/fa';
import { Checkbox, Radio } from 'antd';
import { SearchFilters } from '@/atoms/search';

export type FilterHandlers = {
    updateFilters: (updates: Partial<SearchFilters>) => void;
    handlePriceChange: (min: string, max: string) => void;
    handleRatingChange: (rating: string) => void;
    handlePropertyTypeChange: (types: string[]) => void;
    handleAmenityChange: (amenities: string[]) => void;
    handleLocationChange: (locations: string[]) => void;
    handleGuestRatingChange: (ratings: string[]) => void;
    clearAllFilters: () => void;
};

export type FilterBarProps = {
    filters: SearchFilters;
    handlers: FilterHandlers;
    totalResults?: number;
};

const FilterContainer = styled.div`
    width: 100%;
    max-width: 300px;
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 0;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};

    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 1px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.lightBackground};
        border-radius: 1px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 3px;

        &:hover {
            background: ${({ theme }) => theme.colors.lightText};
        }
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        max-width: 100%;
        margin-bottom: 1rem;
        position: static;
        max-height: none;
        overflow-y: visible;
    }
`;

const FilterSection = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
        border-bottom: none;
    }
`;

const FilterHeader = styled.div`
    padding: 20px 24px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    justify-content: flex-start;
    align-items: left;
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

const FilterTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

const FilterContent = styled.div`
    padding: 20px 24px;
`;

const SectionTitle = styled.h4`
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
`;

const PriceInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
`;
const PriceInput = styled.input`
    flex: 1;
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 14px;
    min-width: 0;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &::placeholder {
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const PriceSeparator = styled.span`
    color: ${({ theme }) => theme.colors.lightText};
    font-weight: 500;
`;

const RatingOption = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => theme.colors.lightBackground};
        margin: 0 -12px;
        padding: 8px 12px;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
`;

const StarContainer = styled.div`
    display: flex;
    gap: 2px;
`;

const CheckboxOption = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;

    .ant-checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }
`;

const OptionLabel = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
`;

const OptionCount = styled.span`
    font-size: 12px;
    color: ${({ theme }) => theme.colors.lightText};
    background: ${({ theme }) => theme.colors.lightBackground};
    padding: 2px 6px;
    border-radius: 12px;
`;

const ClearButton = styled.button`
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: white;
    }
`;

const ShowAllButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    cursor: pointer;
    padding: 4px 0;
    margin-top: 8px;

    &:hover {
        text-decoration: underline;
    }
`;

const propertyTypes = [
    { value: 'hotel', label: 'Hotels', count: 2847 },
    { value: 'apartment', label: 'Apartments', count: 1205 },
    { value: 'resort', label: 'Resorts', count: 658 },
    { value: 'villa', label: 'Villas', count: 423 },
    { value: 'hostel', label: 'Hostels', count: 315 },
    { value: 'guesthouse', label: 'Guest Houses', count: 289 },
];

const amenities = [
    { value: 'wifi', label: 'Free WiFi', icon: <FaWifi />, count: 4205 },
    { value: 'parking', label: 'Free Parking', icon: <FaParking />, count: 3156 },
    { value: 'pool', label: 'Swimming Pool', icon: <FaSwimmingPool />, count: 1847 },
    { value: 'gym', label: 'Fitness Center', icon: <FaDumbbell />, count: 1234 },
    { value: 'restaurant', label: 'Restaurant', icon: <FaUtensils />, count: 2456 },
];

const locations = [
    { value: 'downtown', label: 'Downtown', count: 1205 },
    { value: 'airport', label: 'Near Airport', count: 856 },
    { value: 'beach', label: 'Beach Area', count: 674 },
    { value: 'shopping', label: 'Shopping District', count: 523 },
    { value: 'business', label: 'Business District', count: 445 },
];

const guestRatings = [
    { value: '9+', label: 'Wonderful: 9+', count: 1245 },
    { value: '8+', label: 'Very Good: 8+', count: 2156 },
    { value: '7+', label: 'Good: 7+', count: 3456 },
    { value: '6+', label: 'Pleasant: 6+', count: 4123 },
];

export default function FilterBar({ filters, handlers }: FilterBarProps) {
    const [showAllPropertyTypes, setShowAllPropertyTypes] = useState(false);
    const [showAllLocations, setShowAllLocations] = useState(false);

    const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
        if (type === 'min') {
            handlers.handlePriceChange(value, filters.maxPrice);
        } else {
            handlers.handlePriceChange(filters.minPrice, value);
        }
    };

    const handleRatingClick = (rating: string) => {
        const newRating = filters.selectedRating === rating ? '' : rating;
        handlers.handleRatingChange(newRating);
    };

    const handlePropertyTypeChange = (type: string, checked: boolean) => {
        const newTypes = checked ? [...filters.propertyTypes, type] : filters.propertyTypes.filter((t) => t !== type);
        handlers.handlePropertyTypeChange(newTypes);
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        const newAmenities = checked ? [...filters.amenities, amenity] : filters.amenities.filter((a) => a !== amenity);
        handlers.handleAmenityChange(newAmenities);
    };

    const handleLocationChange = (location: string, checked: boolean) => {
        const newLocations = checked
            ? [...filters.locations, location]
            : filters.locations.filter((l) => l !== location);
        handlers.handleLocationChange(newLocations);
    };

    const handleGuestRatingChange = (rating: string, checked: boolean) => {
        const newRatings = checked ? [...filters.guestRating, rating] : filters.guestRating.filter((r) => r !== rating);
        handlers.handleGuestRatingChange(newRatings);
    };

    const displayedPropertyTypes = showAllPropertyTypes ? propertyTypes : propertyTypes.slice(0, 5);
    const displayedLocations = showAllLocations ? locations : locations.slice(0, 4);

    return (
        <FilterContainer>
            <FilterHeader>
                <FilterTitle>Filter by:</FilterTitle>
            </FilterHeader>

            {/* Price Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Price</SectionTitle>
                    <PriceInputContainer>
                        <PriceInput
                            type="number"
                            placeholder="0"
                            value={filters.minPrice}
                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                        />
                        <PriceSeparator>-</PriceSeparator>
                        <PriceInput
                            type="number"
                            placeholder="1100"
                            value={filters.maxPrice}
                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                        />
                    </PriceInputContainer>
                </FilterContent>
            </FilterSection>

            {/* Star Rating Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Star Rating</SectionTitle>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <RatingOption key={rating} onClick={() => handleRatingClick(rating.toString())}>
                            <Radio checked={filters.selectedRating === rating.toString()} onChange={() => {}} />
                            <StarContainer>
                                {Array.from({ length: rating }, (_, i) => (
                                    <FaStar key={i} size={14} color="#ffc107" />
                                ))}
                            </StarContainer>
                            <span>{rating}</span>
                        </RatingOption>
                    ))}
                </FilterContent>
            </FilterSection>

            {/* Property Type Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Property Type</SectionTitle>
                    {displayedPropertyTypes.map((type) => (
                        <CheckboxOption key={type.value}>
                            <Checkbox
                                checked={filters.propertyTypes.includes(type.value)}
                                onChange={(e) => handlePropertyTypeChange(type.value, e.target.checked)}
                            >
                                <OptionLabel>{type.label}</OptionLabel>
                            </Checkbox>
                            <OptionCount>{type.count}</OptionCount>
                        </CheckboxOption>
                    ))}
                    {propertyTypes.length > 5 && (
                        <ShowAllButton onClick={() => setShowAllPropertyTypes(!showAllPropertyTypes)}>
                            {showAllPropertyTypes ? 'Show Less' : `Show All ${propertyTypes.length}`}
                        </ShowAllButton>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Guest Rating Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Guest Rating</SectionTitle>
                    {guestRatings.map((rating) => (
                        <CheckboxOption key={rating.value}>
                            <Checkbox
                                checked={filters.guestRating.includes(rating.value)}
                                onChange={(e) => handleGuestRatingChange(rating.value, e.target.checked)}
                            >
                                <OptionLabel>{rating.label}</OptionLabel>
                            </Checkbox>
                            <OptionCount>{rating.count}</OptionCount>
                        </CheckboxOption>
                    ))}
                </FilterContent>
            </FilterSection>

            {/* Amenities Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Amenities</SectionTitle>
                    {amenities.map((amenity) => (
                        <CheckboxOption key={amenity.value}>
                            <Checkbox
                                checked={filters.amenities.includes(amenity.value)}
                                onChange={(e) => handleAmenityChange(amenity.value, e.target.checked)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {amenity.icon}
                                    <OptionLabel>{amenity.label}</OptionLabel>
                                </div>
                            </Checkbox>
                            <OptionCount>{amenity.count}</OptionCount>
                        </CheckboxOption>
                    ))}
                </FilterContent>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle>Location</SectionTitle>
                    {displayedLocations.map((location) => (
                        <CheckboxOption key={location.value}>
                            <Checkbox
                                checked={filters.locations.includes(location.value)}
                                onChange={(e) => handleLocationChange(location.value, e.target.checked)}
                            >
                                <OptionLabel>{location.label}</OptionLabel>
                            </Checkbox>
                            <OptionCount>{location.count}</OptionCount>
                        </CheckboxOption>
                    ))}
                    {locations.length > 4 && (
                        <ShowAllButton onClick={() => setShowAllLocations(!showAllLocations)}>
                            {showAllLocations ? 'Show Less' : `Show All ${locations.length}`}
                        </ShowAllButton>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Clear Filters Button */}
            <FilterContent>
                <ClearButton onClick={handlers.clearAllFilters}>Clear All Filters</ClearButton>
            </FilterContent>
        </FilterContainer>
    );
}
