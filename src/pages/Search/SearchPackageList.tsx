import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaHeart, FaStar, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Button from '@/components/Common/Button';
import Card from '@/components/Common/Card';
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
import useApiServices from '@/services';
import { TourListResponse } from '@/atoms/tours';
import { motion } from 'framer-motion';

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
    height: 170px;
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
    text-align: left;
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
    color: #666;
    font-size: 14px;
    margin: 0.5rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
`;

const TourLocation = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin-bottom: 0.75rem;
    justify-content: flex-start;
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
    align-items: flex-start;
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

const LoadingSpinner = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    flex-direction: column;
    gap: 1rem;
`;

const Spinner = styled(motion.div)`
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
`;

export default function SearchPackageList() {
    const navigate = useNavigate();
    const { tours: toursService } = useApiServices();

    const searchData = useSearchData();
    const uiState = useSearchUIState();
    const searchActions = useSearchActions();
    const searchFilters = useSearchFilters();
    const filterActions = useFilterActions();

    const { getCachedResults, isCacheValid } = useSearchCache();

    const [filteredTours, setFilteredTours] = useState<TourListResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPagination, setCurrentPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNext: false,
        hasPrevious: false,
        pageSize: 10,
    });
    const [lastSearchParams, setLastSearchParams] = useState({
        destination: '',
        minPrice: '',
        maxPrice: '',
    });

    const PAGE_SIZE = 10;

    const generateCacheKey = (page: number): string => {
        return `${searchData.destination || ''}-${page}-${PAGE_SIZE}-${searchFilters.minPrice || ''}-${searchFilters.maxPrice || ''}-${searchFilters.selectedRating || ''}`;
    };

    const fetchTours = async (page = 1) => {
        const cacheKey = generateCacheKey(page);

        if (isCacheValid(cacheKey)) {
            const cached = getCachedResults(cacheKey);
            if (cached) {
                console.log('Using search cache for page:', page);
                setFilteredTours(cached.data);
                if (cached.paginationInfo) {
                    setCurrentPagination(cached.paginationInfo);
                } else {
                    setCurrentPagination((prev) => ({ ...prev, currentPage: page }));
                }
                return;
            }
        }
        console.log('Fetching fresh data for page:', page);
        setIsLoading(true);
        try {
            const response = await toursService.getTours({
                search: searchData.destination,
                page: page,
                page_size: PAGE_SIZE,
            });

            if (response.statusCode === 200 && response.data?.results) {
                let filtered = response.data.results;

                if (searchFilters.minPrice) {
                    filtered = filtered.filter((tour) => parseFloat(tour.price) >= parseInt(searchFilters.minPrice));
                }
                if (searchFilters.maxPrice) {
                    filtered = filtered.filter((tour) => parseFloat(tour.price) <= parseInt(searchFilters.maxPrice));
                }

                const paginationInfo = {
                    currentPage: page,
                    totalPages: Math.ceil(response.data.count / PAGE_SIZE),
                    totalCount: response.data.count,
                    hasNext: !!response.data.next,
                    hasPrevious: !!response.data.previous,
                    pageSize: PAGE_SIZE,
                };

                /* buyerda existing search codedan foydanalanib cache qilamiz */
                searchActions.cacheSearchResults(cacheKey, filtered, {
                    ...searchData,
                    ...searchFilters,
                    paginationInfo,
                });

                setFilteredTours(filtered);
                setCurrentPagination(paginationInfo);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setFilteredTours([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTours(1);
    }, []);

    useEffect(() => {
        const currentSearchParams = {
            destination: searchData.destination,
            minPrice: searchFilters.minPrice,
            maxPrice: searchFilters.maxPrice,
        };

        /* buyerda search params o'zgarganini tekshiramiz */
        if (
            currentSearchParams.destination !== lastSearchParams.destination ||
            currentSearchParams.minPrice !== lastSearchParams.minPrice ||
            currentSearchParams.maxPrice !== lastSearchParams.maxPrice
        ) {
            console.log('Search params changed, fetching page 1');
            setLastSearchParams(currentSearchParams);
            toursService.clearCache();
            setCurrentPagination((prev) => ({ ...prev, currentPage: 1 }));
            fetchTours(1);
        }
    }, [searchData.destination, searchFilters.minPrice, searchFilters.maxPrice]);

    const handlePageChange = (page: number) => {
        console.log('Page change requested:', page);
        if (page >= 1 && page <= currentPagination.totalPages && !isLoading && page !== currentPagination.currentPage) {
            fetchTours(page);
        }
    };

    const handlePrevious = () => {
        if (currentPagination.hasPrevious) {
            handlePageChange(currentPagination.currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPagination.hasNext) {
            handlePageChange(currentPagination.currentPage + 1);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        searchActions.setIsSearching(true);

        try {
            const params = new URLSearchParams();
            if (searchData.destination) params.set('destination', searchData.destination);
            if (searchData.dates) params.set('dates', searchData.dates);
            if (searchData.travelers) params.set('travelers', searchData.travelers);

            navigate(`/searchTrips?${params.toString()}`, { replace: true });
            toursService.clearCache();
            setCurrentPagination((prev) => ({ ...prev, currentPag: 1 }));
            await fetchTours(1);
        } catch (error) {
            console.error('Search failed:', error);
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
                        <ResultsCount>
                            Page {currentPagination.currentPage} of {currentPagination.totalPages} /
                            {currentPagination.totalCount} total results found
                        </ResultsCount>
                    </ResultsHeader>

                    <ToursList>
                        {filteredTours.map((tour) => (
                            <Link
                                to={`/searchTrips/${tour.uuid}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                key={tour.id}
                            >
                                <TourCard key={tour.id} variant="elevated">
                                    <TourImage>
                                        <img src={tour.main_image || '/placeholder.jpg'} alt={tour.title} />
                                        <FavoriteButton>
                                            <FaHeart size={16} />
                                        </FavoriteButton>
                                    </TourImage>

                                    <TourContent>
                                        <TourHeader>
                                            <TourTitle>{tour.title}</TourTitle>
                                            <TourPrice>
                                                <Price>
                                                    {tour.currency} {tour.price}
                                                </Price>
                                            </TourPrice>
                                        </TourHeader>

                                        <TourDescription>{tour.short_description}</TourDescription>

                                        <TourLocation>
                                            <FaMapMarkerAlt size={14} />
                                            <span>{tour.tour_type.name}</span>
                                            <Button variant="text" size="sm">
                                                Show on Map
                                            </Button>
                                        </TourLocation>

                                        <TourMeta>
                                            <MetaLeft>
                                                <BookedInfo>10K+ people booked</BookedInfo>
                                                <Rating>
                                                    <RatingValue>4.5</RatingValue>
                                                    <RatingStars>
                                                        {Array.from({ length: 5 }, (_, i) => (
                                                            <FaStar key={i} size={12} color="#ffc107" />
                                                        ))}
                                                    </RatingStars>
                                                    <span>(50 reviews)</span>
                                                </Rating>
                                            </MetaLeft>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/searchTrips/${tour.uuid}`)}
                                            >
                                                See details
                                            </Button>
                                        </TourMeta>
                                    </TourContent>
                                </TourCard>
                            </Link>
                        ))}

                        {!isLoading && filteredTours.length === 0 ? (
                            <NoDataFound
                                type="search"
                                onButtonClick={() => {
                                    filterActions.clearAllFilters();
                                    searchActions.resetSearch();
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginTop: '2rem',
                                    padding: '1rem',
                                }}
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevious}
                                    disabled={!currentPagination.hasPrevious || isLoading}
                                >
                                    <FaChevronLeft />
                                </Button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {Array.from({ length: Math.min(5, currentPagination.totalPages) }, (_, i) => {
                                        const pageNumber =
                                            Math.max(
                                                1,
                                                Math.min(
                                                    currentPagination.totalPages - 4,
                                                    currentPagination.currentPage - 2,
                                                ),
                                            ) + i;
                                        if (pageNumber > currentPagination.totalPages) return null;

                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={
                                                    currentPagination.currentPage === pageNumber ? 'primary' : 'outline'
                                                }
                                                size="sm"
                                                onClick={() => handlePageChange(pageNumber)}
                                                disabled={isLoading || currentPagination.currentPage === pageNumber}
                                                style={{ minWidth: '40px' }}
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNext}
                                    disabled={!currentPagination.hasNext || isLoading}
                                >
                                    <FaChevronRight />
                                </Button>
                                {/* <span style={{ marginLeft: '1rem', color: '#666', fontSize: '14px' }}>
                                    Page {currentPagination.currentPage} of {currentPagination.totalPages} (
                                    {currentPagination.totalCount} total results)
                                </span> */}
                            </div>
                        )}

                        {isLoading && (
                            <LoadingSpinner initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Spinner
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Searching...
                                </motion.p>
                            </LoadingSpinner>
                        )}
                    </ToursList>
                </ResultsContainer>
            </ContentContainer>
        </PageContainer>
    );
}
