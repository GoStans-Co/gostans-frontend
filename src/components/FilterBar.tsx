import { useState } from 'react';
import styled from 'styled-components';
import {
    FaStar,
    FaWifi,
    FaParking,
    FaSwimmingPool,
    FaDumbbell,
    FaUtensils,
    FaChevronDown,
    FaChevronUp,
    FaDollarSign,
    FaBuilding,
    FaUsers,
    FaMapMarkerAlt,
} from 'react-icons/fa';
import { Checkbox } from 'antd';
import { SearchFilters } from '@/types/common/search';

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
    padding: 16px 20px;
`;

const SectionTitle = styled.h4`
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const SectionTitleContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    .section-icon {
        opacity: 0.7;
        font-size: 14px;
    }
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

const StarRatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 0;
`;

const InteractiveStar = styled(FaStar)<{ isSelected: boolean; isHovered: boolean }>`
    cursor: pointer;
    transition: all 0.2s;
    color: ${({ isSelected, isHovered }) => (isSelected || isHovered ? '#ffc107' : '#e0e0e0')};

    &:hover {
        transform: scale(1.1);
    }
`;

const RatingText = styled.span`
    margin-left: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.text};
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
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
        price: false,
        starRating: false,
        propertyType: false,
        guestRating: false,
        amenities: false,
        location: false,
    });
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
        if (type === 'min') {
            handlers.handlePriceChange(value, filters.maxPrice);
        } else {
            handlers.handlePriceChange(filters.minPrice, value);
        }
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

    const toggleSection = (section: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleStarClick = (rating: number) => {
        const newRating = filters.selectedRating === rating.toString() ? '' : rating.toString();
        handlers.handleRatingChange(newRating);
    };

    const handleStarHover = (rating: number | null) => {
        setHoveredStar(rating);
    };

    const getRatingText = (rating: number) => {
        const texts: { [key: number]: string } = {
            1: 'Poor',
            2: 'Fair',
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent',
        };
        return texts[rating] || '';
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
                    <SectionTitle onClick={() => toggleSection('price')}>
                        <SectionTitleContent>
                            <FaDollarSign className="section-icon" />
                            Price
                        </SectionTitleContent>
                        {collapsedSections.price ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </SectionTitle>{' '}
                    {!collapsedSections.price && (
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
                    )}
                </FilterContent>
            </FilterSection>

            {/* Star Rating Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle onClick={() => toggleSection('starRating')}>
                        <SectionTitleContent>
                            <FaStar className="section-icon" />
                            Star Rating
                        </SectionTitleContent>
                        {collapsedSections.starRating ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                    </SectionTitle>
                    {!collapsedSections.starRating && (
                        <StarRatingContainer onMouseLeave={() => handleStarHover(null)}>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <InteractiveStar
                                    key={rating}
                                    size={24}
                                    isSelected={parseInt(filters.selectedRating) >= rating}
                                    isHovered={hoveredStar !== null && hoveredStar >= rating}
                                    onClick={() => handleStarClick(rating)}
                                    onMouseEnter={() => handleStarHover(rating)}
                                />
                            ))}
                            <RatingText>
                                {hoveredStar
                                    ? `${hoveredStar} star${hoveredStar > 1 ? 's' : ''} - ${getRatingText(hoveredStar)}`
                                    : filters.selectedRating
                                      ? `${filters.selectedRating} star${parseInt(filters.selectedRating) > 1 ? 's' : ''} & up`
                                      : ''}
                            </RatingText>
                        </StarRatingContainer>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Property Type Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle onClick={() => toggleSection('propertyType')}>
                        <SectionTitleContent>
                            <FaBuilding className="section-icon" />
                            Property Type
                        </SectionTitleContent>{' '}
                        {collapsedSections.propertyType ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}{' '}
                    </SectionTitle>{' '}
                    {!collapsedSections.propertyType && (
                        <div>
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
                        </div>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Guest Rating Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle onClick={() => toggleSection('guestRating')}>
                        <SectionTitleContent>
                            <FaUsers className="section-icon" />
                            Guest Rating
                        </SectionTitleContent>
                        {collapsedSections.guestRating ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}{' '}
                    </SectionTitle>
                    {!collapsedSections.guestRating && (
                        <div>
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
                        </div>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Amenities Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle onClick={() => toggleSection('amenities')}>
                        <SectionTitleContent>
                            <FaWifi className="section-icon" />
                            Amenities
                        </SectionTitleContent>
                        {collapsedSections.amenities ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}{' '}
                    </SectionTitle>{' '}
                    {!collapsedSections.amenities && (
                        <div>
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
                        </div>
                    )}
                </FilterContent>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection>
                <FilterContent>
                    <SectionTitle onClick={() => toggleSection('location')}>
                        <SectionTitleContent>
                            <FaMapMarkerAlt className="section-icon" />
                            Location
                        </SectionTitleContent>
                        {collapsedSections.location ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}{' '}
                    </SectionTitle>{' '}
                    {!collapsedSections.location && (
                        <div>
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
                        </div>
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
