import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaHeart, FaStar } from 'react-icons/fa';
import Button from '@/components/Common/Button';
import Card from '@/components/Common/Card';
import { tours } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';
import {
    useFilterActions,
    useSearchActions,
    useSearchCache,
    useSearchData,
    useSearchFilters,
    useSearchUIState,
} from '@/hooks/useSearchActions';
import FilterBar from '@/components/FilterBar';
import NoDataFound from '@/components/Common/NoDataFound';

const PageContainer = styled.div`
    min-height: 100vh;
    padding-top: 20px;
`;

const SearchContainer = styled.div`
    background: white;
    padding: 2rem;
    padding-left: 10rem;
    padding-right: 10rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: ${({ theme }) => theme.colors.grayBackground};
`;

const ContentContainer = styled.div`
    max-width: 1200px;
    margin: 0;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    padding-bottom: 4rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 250px 1fr;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
`;

const RatingStars = styled.div`
    display: flex;
    gap: 0.25rem;
    color: #ffc107;
`;

const ResultsContainer = styled.div`
    padding-bottom: 3rem;
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        order: 1;
    }
`;

const ResultsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
`;

const ResultsCount = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ToursList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const TourCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const TourImage = styled.div`
    width: 200px;
    height: 150px;
    flex-shrink: 0;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow: hidden;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        width: 100%;
        height: 200px;
    }
`;

const FavoriteButton = styled.button`
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    color: ${({ theme }) => theme.colors.lightText};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        background: white;
        color: #ff4757;
    }
`;

const TourContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const TourHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: 0.5rem;
    }
`;

const TourTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

const TourPrice = styled.div`
    text-align: right;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        text-align: left;
    }
`;

const Price = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
`;

const TourDescription = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: 1.5;
    margin-bottom: 1rem;
`;

const TourLocation = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: 0.75rem;
`;

const TourMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const MetaLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const RatingValue = styled.span`
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
`;

const BookedInfo = styled.span`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export default function SearchPackageList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchData = useSearchData();
    const uiState = useSearchUIState();
    const searchActions = useSearchActions();
    const searchFilters = useSearchFilters();
    const filterActions = useFilterActions();

    const { getCachedResults, isCacheValid } = useSearchCache();

    const [filteredTours, setFilteredTours] = useState<any[]>([]);

    useEffect(() => {
        const urlDestination = searchParams.get('destination');
        const urlDates = searchParams.get('dates');
        const urlTravelers = searchParams.get('travelers');

        const updates: any = {};
        if (urlDestination) updates.destination = urlDestination;
        if (urlDates) updates.dates = urlDates;
        if (urlTravelers) updates.travelers = urlTravelers;

        if (Object.keys(updates).length > 0) {
            searchActions.updateSearchData(updates);
        }
    }, [searchParams]);

    useEffect(() => {
        const searchKey = `${searchData.destination}-${searchData.dates}-${searchFilters.minPrice}-${searchFilters.maxPrice}-${searchFilters.selectedRating}`;

        if (isCacheValid(searchKey)) {
            const cached = getCachedResults(searchKey);
            if (cached) {
                setFilteredTours(cached.data);
                return;
            }
        }

        let filtered = tours;

        if (searchData.destination) {
            filtered = filtered.filter(
                (tour) =>
                    tour.title.toLowerCase().includes(searchData.destination.toLowerCase()) ||
                    tour.country.toLowerCase().includes(searchData.destination.toLowerCase()),
            );
        }

        if (searchFilters.minPrice) {
            filtered = filtered.filter((tour) => tour.price >= parseInt(searchFilters.minPrice));
        }
        if (searchFilters.maxPrice) {
            filtered = filtered.filter((tour) => tour.price <= parseInt(searchFilters.maxPrice));
        }
        if (searchFilters.selectedRating) {
            filtered = filtered.filter((tour) => (tour.rating ?? 0) >= parseFloat(searchFilters.selectedRating));
        }

        setFilteredTours(filtered);

        searchActions.cacheSearchResults(searchKey, filtered, { ...searchData, ...searchFilters });
    }, [searchData, searchFilters]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        searchActions.setIsSearching(true);

        try {
            const params = new URLSearchParams();
            if (searchData.destination) params.set('destination', searchData.destination);
            if (searchData.dates) params.set('dates', searchData.dates);
            if (searchData.travelers) params.set('travelers', searchData.travelers);

            navigate(`/searchPackage?${params.toString()}`, { replace: true });

            // const results = await searchToursAPI({ ...searchData, ...searchFilters });
            // setFilteredTours(results);
        } finally {
            searchActions.setIsSearching(false);
        }
    };

    return (
        <PageContainer>
            <SearchContainer>
                <SearchBar
                    data={searchData}
                    handlers={{
                        onDestinationChange: searchActions.handleDestinationChange,
                        onDatesChange: searchActions.handleDatesChange,
                        onTravelersChange: searchActions.handleTravelersChange,
                        onTravelerCountChange: searchActions.handleTravelerCountChange,
                        onSubmit: handleSearch,
                    }}
                    showTravelersDropdown={uiState.showTravelersDropdown}
                    onTravelersDropdownToggle={searchActions.handleTravelersDropdownToggle}
                />
            </SearchContainer>

            <ContentContainer>
                <FilterBar filters={searchFilters} handlers={filterActions} totalResults={filteredTours.length} />

                <ResultsContainer>
                    <ResultsHeader>
                        <ResultsCount>{filteredTours.length} results found</ResultsCount>
                        {uiState.isSearching && <span>Searching...</span>}
                    </ResultsHeader>

                    <ToursList>
                        {filteredTours.map((tour) => (
                            <TourCard key={tour.id} variant="elevated">
                                <TourImage>
                                    <img src={tour.image} alt={tour.title} />
                                    <FavoriteButton>
                                        <FaHeart size={16} />
                                    </FavoriteButton>
                                </TourImage>

                                <TourContent>
                                    <TourHeader>
                                        <TourTitle>{tour.title}</TourTitle>
                                        <TourPrice>
                                            <Price>${tour.price}</Price>
                                        </TourPrice>
                                    </TourHeader>

                                    <TourDescription>{tour.description}</TourDescription>

                                    <TourLocation>
                                        <FaMapMarkerAlt size={14} />
                                        <span>{tour.country}</span>
                                        <Button variant="text" size="sm">
                                            Show on Map
                                        </Button>
                                    </TourLocation>

                                    <TourMeta>
                                        <MetaLeft>
                                            <BookedInfo>{tour.peopleBooked || '10K+'} people booked</BookedInfo>
                                            <Rating>
                                                <RatingValue>{tour.rating || 4.5}</RatingValue>
                                                <RatingStars>
                                                    {Array.from({ length: 5 }, (_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            size={12}
                                                            color={
                                                                i < Math.floor(tour.rating || 4.5)
                                                                    ? '#ffc107'
                                                                    : '#e4e5e9'
                                                            }
                                                        />
                                                    ))}
                                                </RatingStars>
                                                <span>({tour.reviews || 50} reviews)</span>
                                            </Rating>
                                        </MetaLeft>
                                        <Button variant="outline" size="sm">
                                            See details
                                        </Button>
                                    </TourMeta>
                                </TourContent>
                            </TourCard>
                        ))}

                        {filteredTours.length === 0 ? (
                            <NoDataFound
                                type="search"
                                onButtonClick={() => {
                                    filterActions.clearAllFilters();
                                    searchActions.resetSearch();
                                }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={() => {
                                        console.log('Fetch more tours');
                                    }}
                                >
                                    Show more
                                </Button>
                            </div>
                        )}
                    </ToursList>
                </ResultsContainer>
            </ContentContainer>
        </PageContainer>
    );
}
