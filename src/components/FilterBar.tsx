import { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronUp, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import { Checkbox } from 'antd';
import { SearchFilters } from '@/types/common/search';
import { TourListResponse } from '@/services/api/tours';
import { COUNTRY_WITH_CITIES } from '@/constants/countryWithCities';

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
    tourData?: TourListResponse[];
};

const FilterContainer = styled.div`
    width: 100%;
    max-width: 100%;
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: 0;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    position: sticky;
    top: 90px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 10;
    align-self: flex-start;

    ${({ theme }) => theme.responsive.laptop} {
        top: 80px;
        max-height: calc(100vh - 90px);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        max-width: 100%;
        margin-bottom: 1rem;
        position: static;
        max-height: none;
        width: 100%;
        box-sizing: border-box;
        overflow-y: visible;
        margin-left: 0;
        margin-right: 0;
        padding: 0;
        top: auto;
        z-index: auto;
        align-self: auto;

        .filter-mobile-toggle {
            display: block;
            width: 100%;
            padding: 1rem;
            background: ${({ theme }) => theme.colors.primary};
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            box-sizing: border-box;

            &:hover {
                background: ${({ theme }) => theme.colors.grayBackground || theme.colors.primary};
            }
        }
    }

    .filter-mobile-toggle {
        display: none;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 20px 1rem 16px;
    }
`;

const FilterTitle = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

const FilterContent = styled.div<{ isMobileFilterOpen?: boolean }>`
    padding: 16px 20px;
    width: 100%;
    box-sizing: border-box;

    .mobile-filter-content {
        display: none;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    @media (min-width: 769px) {
        .mobile-filter-content {
            display: block !important;
        }
    }

    @media (max-width: 768px) {
        padding: 16px 1rem;

        .mobile-filter-content {
            display: ${({ isMobileFilterOpen }) => (isMobileFilterOpen ? 'block' : 'none')};
        }
    }
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
    width: 100%;
    box-sizing: border-box;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.sm};

        input {
            width: 100%;
            max-width: 100%;
        }
    }
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

const CheckboxOption = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm} 0;

        .ant-checkbox-wrapper {
            font-size: ${({ theme }) => theme.fontSizes.sm};
        }
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

const CountrySection = styled.div`
    margin-bottom: 12px;

    &:last-child {
        margin-bottom: 0;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 8px;
    }
`;

const CitiesList = styled.div`
    margin-left: 14px;
    margin-top: 8px;
    padding-left: 10px;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-left: 8px;
        padding-left: 8px;
    }
`;

const CountryHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const CountryAllOption = styled.button.withConfig({
    shouldForwardProp: (prop) => !['isSelected'].includes(prop)
})<{ isSelected?: boolean }>`
    display: flex;
    align-items: center;
    padding: 4px 8px;
    margin-right: 8px;
    border: 1px solid ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : theme.colors.border)};
    background: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : 'transparent')};
    color: ${({ theme, isSelected }) => (isSelected ? 'white' : theme.colors.lightText)};
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary : theme.colors.lightBackground)};
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:focus {
        outline: none;
    }
`;

const CountryHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    width: 100%;

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

export default function FilterBar({ filters, handlers, tourData = [] }: FilterBarProps) {
    const filterRef = useRef<HTMLDivElement>(null);

    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {
            price: false,
            location: false,
        };

        COUNTRY_WITH_CITIES.forEach((country) => {
            initialState[country.key] = true;
        });

        return initialState;
    });

    const locations = useMemo(() => {
        const countries = COUNTRY_WITH_CITIES;

        /* here we first count tours by location if tourData exists
         * and then we map countries to include counts for each city
         * and total count for "All" option in each country
         */
        const locationCounts =
            tourData?.reduce(
                (acc, tour) => {
                    const cityName = tour.cityName || '';
                    const countryName = tour.countryName || '';

                    if (cityName) acc[cityName] = (acc[cityName] || 0) + 1;

                    if (countryName) {
                        const countryKey = `${countryName.toLowerCase()}-all`;
                        acc[countryKey] = (acc[countryKey] || 0) + 1;
                    }

                    return acc;
                },
                {} as Record<string, number>,
            ) || {};

        /* then here return the countries with their cities and counts
         * for "All" option we use the key format "countryName-all"
         */
        return countries.map((country) => ({
            ...country,
            allCount: locationCounts[`${country.key}-all`] || 0,
            cities: country.cities.map((city) => ({
                value: `${country.name.toLowerCase()}-${city.toLowerCase().replace(/\s+/g, '-')}`,
                label: city,
                count: locationCounts[city] || 0,
            })),
        }));
    }, [tourData]);

    const handlePriceInputChange = (type: 'min' | 'max', value: string) => {
        if (type === 'min') {
            handlers.handlePriceChange(value, filters.maxPrice);
        } else {
            handlers.handlePriceChange(filters.minPrice, value);
        }
    };

    const isCountryAllSelected = (countryKey: string) => {
        const country = locations.find((loc) => loc.key === countryKey);
        if (!country) return false;

        const allCountryCities = country.cities.map((city) => city.value);
        return (
            filters.locations.includes(`${countryKey}-all`) &&
            allCountryCities.every((city) => filters.locations.includes(city))
        );
    };

    const toggleSection = (section: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleLocationChange = (location: string, checked: boolean) => {
        let newLocations: string[];

        if (location.includes('-all')) {
            const countryKey = location.replace('-all', '');
            const country = locations.find((loc) => loc.key === countryKey);

            if (checked && country) {
                const countryCities = country.cities.map((city) => city.value);
                newLocations = [
                    ...filters.locations.filter((l) => !l.startsWith(`${countryKey}-`)),
                    location,
                    ...countryCities,
                ];
            } else {
                newLocations = filters.locations.filter((l) => !l.startsWith(`${countryKey}-`) && l !== location);
            }
        } else {
            newLocations = checked ? [...filters.locations, location] : filters.locations.filter((l) => l !== location);
        }

        handlers.handleLocationChange(newLocations);

        /* we will scroll to top after filter value change */
        setTimeout(() => {
            if (filterRef.current) {
                const rect = filterRef.current.getBoundingClientRect();
                const offsetTop = window.pageYOffset + rect.top - 90;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        }, 100);
    };

    return (
        <FilterContainer ref={filterRef}>
            <button className="filter-mobile-toggle" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
                {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
                {isMobileFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            <div className="mobile-filter-content">
                <FilterHeader>
                    <FilterTitle>Filter by:</FilterTitle>
                </FilterHeader>

                {/* price filter */}
                <FilterSection>
                    <FilterContent>
                        <SectionTitle onClick={() => toggleSection('price')}>
                            <SectionTitleContent>
                                <FaDollarSign className="section-icon" />
                                Price
                            </SectionTitleContent>
                            {collapsedSections.price ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                        </SectionTitle>
                        {!collapsedSections.price && (
                            <PriceInputContainer>
                                <PriceInput
                                    type="number"
                                    placeholder="Min price"
                                    value={filters.minPrice}
                                    onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                />
                                <span style={{ color: '#999', fontWeight: 500 }}>-</span>
                                <PriceInput
                                    type="number"
                                    placeholder="Max price"
                                    value={filters.maxPrice}
                                    onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                />
                            </PriceInputContainer>
                        )}
                    </FilterContent>
                </FilterSection>

                {/* location filter */}
                {locations.length > 0 && (
                    <FilterSection>
                        <FilterContent>
                            <SectionTitle onClick={() => toggleSection('location')}>
                                <SectionTitleContent>
                                    <FaMapMarkerAlt className="section-icon" />
                                    Location
                                </SectionTitleContent>
                                {collapsedSections.location ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}
                            </SectionTitle>
                            {!collapsedSections.location && (
                                <div>
                                    {locations.map((country) => (
                                        <CountrySection key={country.key}>
                                            <CountryHeader onClick={() => toggleSection(country.key)}>
                                                <CountryHeaderContainer>
                                                    <span>{country.name}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <CountryAllOption
                                                            type="button"
                                                            isSelected={isCountryAllSelected(country.key)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const isSelected = isCountryAllSelected(country.key);
                                                                handleLocationChange(`${country.key}-all`, !isSelected);
                                                            }}
                                                        >
                                                            {isCountryAllSelected(country.key) ? 'Undo' : 'All'}
                                                        </CountryAllOption>
                                                        {collapsedSections[country.key] ? (
                                                            <FaChevronDown size={10} />
                                                        ) : (
                                                            <FaChevronUp size={10} />
                                                        )}
                                                    </div>
                                                </CountryHeaderContainer>
                                            </CountryHeader>
                                            {!collapsedSections[country.key] && (
                                                <CitiesList>
                                                    {country.cities.map((city) => (
                                                        <CheckboxOption key={city.value}>
                                                            <Checkbox
                                                                checked={filters.locations.includes(city.value)}
                                                                onChange={(e) =>
                                                                    handleLocationChange(city.value, e.target.checked)
                                                                }
                                                            >
                                                                <OptionLabel>{city.label}</OptionLabel>
                                                            </Checkbox>
                                                            <OptionCount>{city.count}</OptionCount>
                                                        </CheckboxOption>
                                                    ))}
                                                </CitiesList>
                                            )}
                                        </CountrySection>
                                    ))}
                                </div>
                            )}
                        </FilterContent>
                    </FilterSection>
                )}

                {/* clear filters */}
                <FilterContent>
                    <ClearButton onClick={handlers.clearAllFilters}>Clear All Filters</ClearButton>
                </FilterContent>
            </div>
        </FilterContainer>
    );
}
