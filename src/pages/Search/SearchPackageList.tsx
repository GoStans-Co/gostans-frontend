import React, { useState, useEffect, useRef } from 'react';
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
} from '@/hooks/utils/useSearchActions';
import FilterBar from '@/components/FilterBar';
import NoDataFound from '@/components/Common/NoDataFound';
import { motion } from 'framer-motion';
import useFavorite from '@/hooks/ui/useFavorite';
import useModal from '@/hooks/ui/useModal';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { ModalAlert, ModalAuth } from '@/components/ModalPopup';
import { message } from 'antd';
import { useApiServices } from '@/services/api';
import { TourListResponse } from '@/services/api/tours';
import dayjs from 'dayjs';

const PageContainer = styled.div`
    min-height: 100vh;
    padding-top: 20px;
    width: 100%;
    box-sizing: border-box;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding-top: 10px;
    }
`;

const SearchContainer = styled.div`
    padding: 2rem;
    padding-left: 10rem;
    padding-right: 10rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-height: 150px;
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.grayBackground};
    position: relative;
    z-index: 1;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
        min-height: 120px;
        padding-left: 1rem;
        padding-right: 1rem;
        overflow-x: hidden;
    }

    ${({ theme }) => theme.responsive.tablet} {
        padding: 2rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }
`;

const ContentContainer = styled.div`
    margin: 0 auto;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    padding-bottom: 4rem;
    padding-right: 2rem;
    max-width: 100vw;
    align-items: flex-start;

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: 250px 1fr;
        gap: 1.5rem;
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        padding: 1rem;
        gap: 1rem;
        padding-top: 1rem;
        padding-bottom: 2rem;
        margin: 0;
        width: 100vw;
        max-width: 100vw;
        box-sizing: border-box;
        align-items: stretch;
        overflow-x: hidden;
    }
`;

const RatingStars = styled.div`
    display: flex;
    gap: 0.25rem;
    color: #ffc107;
`;

const ResultsContainer = styled.div`
    padding-bottom: 3rem;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    scroll-margin-top: 50px;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        order: 1;
        padding: 0;
        margin: 0;
        scroll-margin-top: 80px;
    }
`;

const ResultsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    scroll-margin-top: 120px;

    ${({ theme }) => theme.responsive.maxMobile} {
        scroll-margin-top: 100px;
    }
`;

const ResultsCount = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ToursList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
    }
`;

const TourCard = styled(Card)`
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        padding: 1rem;
        border: 0.5px solid ${({ theme }) => theme.colors.border};

        &:hover {
            transform: none;
        }
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

    ${({ theme }) => theme.responsive.maxMobile} {
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

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.sm};
        align-items: flex-start;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0.5rem;
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const TourMeta = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.lg};
        margin-top: ${({ theme }) => theme.spacing.sm};
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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.5rem;
        padding: 0.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
`;

const PaginationButtonsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 0.25rem;
        justify-content: center;
    }
`;

const PaginationDots = styled.span`
    color: ${({ theme }) => theme.colors.lightText};
    font-weight: 500;
    padding: 0 0.25rem;
    display: flex;
    align-items: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const PaginationButton = styled(Button)<{ isActive?: boolean }>`
    min-width: 40px;

    ${({ theme }) => theme.responsive.maxMobile} {
        min-width: 32px;
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const NavigationButton = styled(Button)`
    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0.5rem;
        min-width: 36px;
    }
`;

const FilterToggleButton = styled.div`
    display: none;

    ${({ theme }) => theme.responsive.maxMobile} {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        background-color: ${({ theme }) => theme.colors.background};
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        border-radius: ${({ theme }) => theme.borderRadius.md};
        box-shadow: ${({ theme }) => theme.shadows.sm};
        border: 1px solid ${({ theme }) => theme.colors.border};
        transition: ${({ theme }) => theme.transitions.default};
    }
`;

const FilterLabel = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.text};

    svg {
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const ToggleSwitch = styled.div<{ isActive: boolean }>`
    width: 45px;
    height: 26px;
    background-color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.lightBackground)};
    border-radius: 13px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    padding: 0 3px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
    border: 1px solid ${({ isActive, theme }) => (isActive ? theme.colors.primary : theme.colors.border)};

    &::after {
        content: '';
        position: absolute;
        left: ${({ isActive }) => (isActive ? '20px' : '4px')};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: white;
        transition:
            left 0.3s ease,
            box-shadow 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }

    &:hover::after {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    &:active::after {
        width: 22px;
    }
`;

const ToggleText = styled.span<{ isActive: boolean }>`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ isActive }) => (isActive ? 'white' : '#666')};
    margin-left: ${({ isActive }) => (isActive ? '5px' : 'auto')};
    margin-right: ${({ isActive }) => (isActive ? 'auto' : '5px')};
    font-weight: 500;
    user-select: none;
`;

/**
 * SearchPackageList - Page Component
 * @description This component renders the search package list page, including search bar, filters, and tour results.
 * It handles fetching tours based on search criteria, pagination, and displaying results with options to favorite tours.
 */
export default function SearchPackageList() {
    const navigate = useNavigate();
    const resultsRef = useRef<HTMLDivElement>(null);
    const { tours: toursService } = useApiServices();
    const { isAuthenticated } = useCookieAuth();

    const searchData = useSearchData();
    const uiState = useSearchUIState();
    const searchActions = useSearchActions();
    const searchFilters = useSearchFilters();
    const filterActions = useFilterActions();
    const { toggleWishlistWithTour, getHeartColor, isProcessing } = useFavorite();

    const { getCachedResults, isCacheValid } = useSearchCache();
    const hasInitialized = useRef(false);

    const { openModal, closeModal } = useModal();

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
        dates: '',
        travelers: '',
        locations: [] as string[],
    });
    const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const PAGE_SIZE = 10;

    const generateCacheKey = (page: number): string => {
        return `${searchData.destination || ''}-${page}-${PAGE_SIZE}-${searchFilters.minPrice || ''}-${searchFilters.maxPrice || ''}-${searchData.dates || ''}-${searchData.adults || 0}-${searchData.children || 0}-${searchData.infants || 0}-${searchFilters.locations.join(',') || ''}`;
    };

    const applyClientSideFilters = (tours: TourListResponse[]): TourListResponse[] => {
        let filtered = tours;

        if (searchFilters.minPrice) {
            filtered = filtered.filter((tour) => parseFloat(tour.price) >= parseInt(searchFilters.minPrice));
        }
        if (searchFilters.maxPrice) {
            filtered = filtered.filter((tour) => parseFloat(tour.price) <= parseInt(searchFilters.maxPrice));
        }
        if (searchFilters.locations && searchFilters.locations.length > 0) {
            filtered = filtered.filter((tour) => {
                const tourCity = tour.cityName?.toLowerCase() || '';
                const tourCountry = tour.countryName?.toLowerCase() || '';

                return searchFilters.locations.some((loc) => {
                    /* this will handle the "All" country selection */
                    if (loc.includes('-all')) {
                        const countryName = loc.replace('-all', '');
                        return tourCountry.includes(countryName);
                    }

                    /* this will handle specific city selection */
                    if (loc.includes('-')) {
                        const cityName = loc.split('-').pop()?.toLowerCase();
                        return cityName && tourCity.includes(cityName);
                    }

                    return tourCity.includes(loc.toLowerCase());
                });
            });
        }

        return filtered;
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
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            searchActions.setIsSearching(false);
        }
    };

    const fetchTours = async (page = 1, forceRefresh = false) => {
        const cacheKey = generateCacheKey(page);

        if (!forceRefresh && isCacheValid(cacheKey)) {
            const cached = getCachedResults(cacheKey);
            if (cached) {
                const filtered = applyClientSideFilters(cached.data);
                setFilteredTours(filtered);
                if (cached.paginationInfo) {
                    setCurrentPagination(cached.paginationInfo);
                }
                return;
            }
        }

        setIsLoading(true);
        try {
            const searchParams: any = {
                search: searchData.destination,
                page: page,
                pageSize: PAGE_SIZE,
                all: false,
            };

            if (searchData.dates) {
                const dateRange = searchData.dates.split(' ~ ');
                if (dateRange.length === 2) {
                    /* here we convert from "DD MMM YYYY" to "YYYY-MM-DD" format */
                    const startDate = dayjs(dateRange[0].trim(), 'DD MMM YYYY').format('YYYY-MM-DD');
                    const endDate = dayjs(dateRange[1].trim(), 'DD MMM YYYY').format('YYYY-MM-DD');
                    searchParams.tripStartDate = startDate;
                    searchParams.tripEndDate = endDate;
                }
            }

            if (searchData.adults && searchData.adults > 0) {
                searchParams.adults = searchData.adults;
            }
            if (searchData.children && searchData.children > 0) {
                searchParams.children = searchData.children;
            }
            if (searchData.infants && searchData.infants > 0) {
                searchParams.infants = searchData.infants;
            }

            if (searchFilters.minPrice) {
                searchParams.minPrice = searchFilters.minPrice;
            }
            if (searchFilters.maxPrice) {
                searchParams.maxPrice = searchFilters.maxPrice;
            }

            if (searchFilters.locations && searchFilters.locations.length > 0) {
                const cities: string[] = [];
                const countries: string[] = [];

                searchFilters.locations.forEach((location) => {
                    if (location.includes('-all')) {
                        const countryName = location.replace('-all', '');
                        countries.push(countryName);
                    } else if (location.includes('-')) {
                        const cityName = location.split('-').pop();
                        if (cityName) cities.push(cityName);
                    }
                });

                if (cities.length > 0) searchParams.cities = cities.join(',');
                if (countries.length > 0) searchParams.countries = countries.join(',');
            }

            const response = await toursService.getTours(searchParams);

            if (response.data?.results) {
                const filtered = applyClientSideFilters(response.data.results);

                const paginationInfo = {
                    currentPage: page,
                    totalPages: Math.ceil(response.data.count / PAGE_SIZE),
                    totalCount: response.data.count,
                    hasNext: !!response.data.next,
                    hasPrevious: !!response.data.previous,
                    pageSize: PAGE_SIZE,
                };

                /* then we cache the original data */
                searchActions.cacheSearchResults(cacheKey, response.data.results, {
                    ...searchData,
                    ...searchFilters,
                    paginationInfo,
                });

                setFilteredTours(filtered);
                setCurrentPagination(paginationInfo);
            } else {
                setFilteredTours([]);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            setFilteredTours([]);
        }
        setIsLoading(false);
    };

    const searchBarHandlers = {
        onDestinationChange: (value: string) => {
            searchActions.handleDestinationChange(value);
            /* debounced search will be handled by existing useEffect */
        },
        onDatesChange: (value: string) => {
            searchActions.handleDatesChange(value);
            /* same here, debounced search will be handled by useEffect */
        },
        onTravelersChange: searchActions.handleTravelersChange,
        onTravelerCountChange: searchActions.handleTravelerCountChange,
        onSubmit: handleSearch,
    };

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;

            const currentSearchParams = {
                destination: searchData.destination,
                minPrice: searchFilters.minPrice,
                maxPrice: searchFilters.maxPrice,
                dates: searchData.dates,
                travelers: searchData.travelers,
                locations: [] as string[],
            };

            setLastSearchParams(currentSearchParams);
            fetchTours(1);
            return;
        }
    }, []);

    useEffect(() => {
        if (!hasInitialized.current) return;

        const currentFilterParams = {
            minPrice: searchFilters.minPrice,
            maxPrice: searchFilters.maxPrice,
            locations: searchFilters.locations,
        };

        const lastFilterParams = {
            minPrice: lastSearchParams.minPrice,
            maxPrice: lastSearchParams.maxPrice,
            locations: lastSearchParams.locations || [],
        };

        /* here we check if the filters have changed */
        const filtersChanged =
            currentFilterParams.minPrice !== lastFilterParams.minPrice ||
            currentFilterParams.maxPrice !== lastFilterParams.maxPrice ||
            JSON.stringify(currentFilterParams.locations) !== JSON.stringify(lastFilterParams.locations);

        /* here we first try to apply client side filtering first before instead of fetching new data */
        if (filtersChanged) {
            const cacheKey = generateCacheKey(1);
            if (isCacheValid(cacheKey)) {
                const cached = getCachedResults(cacheKey);
                if (cached) {
                    const filtered = applyClientSideFilters(cached.data);
                    setFilteredTours(filtered);

                    if (cached.paginationInfo) {
                        setCurrentPagination({
                            ...cached.paginationInfo,
                            currentPage: 1,
                        });
                    }

                    setLastSearchParams((prev) => ({
                        ...prev,
                        minPrice: searchFilters.minPrice,
                        maxPrice: searchFilters.maxPrice,
                        locations: searchFilters.locations,
                    }));
                    return;
                }
            }

            /* if no cached data or cannot filter client side, then fetch new data */
            setLastSearchParams((prev) => ({
                ...prev,
                minPrice: searchFilters.minPrice,
                maxPrice: searchFilters.maxPrice,
                locations: searchFilters.locations,
            }));
            toursService.clearCache();
            setCurrentPagination((prev) => ({ ...prev, currentPage: 1 }));
            fetchTours(1, true);
        }
    }, [searchFilters.minPrice, searchFilters.maxPrice, searchFilters.locations]);

    useEffect(() => {
        if (hasInitialized.current && searchData.destination !== lastSearchParams.destination) {
            const timeoutId = setTimeout(() => {
                setLastSearchParams((prev) => ({ ...prev, destination: searchData.destination }));
                toursService.clearCache();
                setCurrentPagination((prev) => ({ ...prev, currentPage: 1 }));
                fetchTours(1);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [searchData.destination]);

    useEffect(() => {
        /* real-time search when dates change */
        if (hasInitialized.current && searchData.dates !== lastSearchParams.dates) {
            const timeoutId = setTimeout(() => {
                setLastSearchParams((prev) => ({ ...prev, dates: searchData.dates }));
                toursService.clearCache();
                setCurrentPagination((prev) => ({ ...prev, currentPage: 1 }));
                fetchTours(1);
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [searchData.dates]);

    useEffect(() => {
        if (hasInitialized.current && searchData.travelers !== lastSearchParams.travelers) {
            const timeoutId = setTimeout(() => {
                setLastSearchParams((prev) => ({ ...prev, travelers: searchData.travelers }));
                toursService.clearCache();
                setCurrentPagination((prev) => ({ ...prev, currentPage: 1 }));
                fetchTours(1);
            }, 300);

            return () => clearTimeout(timeoutId);
        }
    }, [searchData.travelers]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= currentPagination.totalPages && !isLoading && page !== currentPagination.currentPage) {
            fetchTours(page);

            setTimeout(() => {
                if (resultsRef.current) {
                    const rect = resultsRef.current.getBoundingClientRect();
                    /* here we focus on the results container 90px from the top */
                    const offsetTop = window.pageYOffset + rect.top - 90;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth',
                    });
                }
            }, 100);
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

    const openLoginModal = (initialTab: 'login' | 'signup' = 'login') => {
        openModal('login-modal', <ModalAuth onClose={() => closeModal('login-modal')} initialTab={initialTab} />);
    };

    const handleWishlistClick = async (tourUuid: string, e: React.MouseEvent) => {
        if (!isAuthenticated()) {
            e.preventDefault();
            e.stopPropagation();
            setIsLoginAlertOpen(true);
            return;
        }

        const tourData = filteredTours.find((t) => t.uuid === tourUuid);
        const wasLiked = tourData?.isLiked || false;

        const success = await toggleWishlistWithTour(tourUuid, tourData, e);

        if (success && tourData) {
            setFilteredTours((prev) =>
                prev.map((tour) => (tour.uuid === tourUuid ? { ...tour, isLiked: !tour.isLiked } : tour)),
            );

            if (wasLiked) {
                messageApi.info('Removed from favorites');
            } else {
                messageApi.success('Added to favorites');
            }
        } else if (!success) {
            messageApi.error('Failed to update favorites');
        }
    };

    const handleLoginConfirm = () => {
        setIsLoginAlertOpen(false);
        openLoginModal('login');
    };

    const renderPaginationButtons = () => {
        const totalPages = currentPagination.totalPages;
        const currentPage = currentPagination.currentPage;
        const buttons = [];

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <PaginationButton
                        key={i}
                        variant={currentPage === i ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={isLoading || currentPage === i}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationButton>,
                );
            }
        } else {
            for (let i = 1; i <= 3; i++) {
                buttons.push(
                    <PaginationButton
                        key={i}
                        variant={currentPage === i ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                        disabled={isLoading || currentPage === i}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationButton>,
                );
            }

            buttons.push(<PaginationDots key="dots">...</PaginationDots>);
        }

        return buttons;
    };

    return (
        <>
            {contextHolder}
            <PageContainer>
                <SearchContainer>
                    <SearchBar
                        data={searchData}
                        handlers={searchBarHandlers}
                        showTravelersDropdown={uiState.showTravelersDropdown}
                        onTravelersDropdownToggle={searchActions.handleTravelersDropdownToggle}
                    />
                </SearchContainer>

                <ContentContainer>
                    <FilterToggleButton onClick={() => setShowMobileFilters(!showMobileFilters)}>
                        <FilterLabel>Show Filter Bar</FilterLabel>
                        <ToggleSwitch isActive={showMobileFilters}>
                            <ToggleText isActive={showMobileFilters}>{showMobileFilters ? '' : ''}</ToggleText>
                        </ToggleSwitch>
                    </FilterToggleButton>

                    <div
                        style={{
                            display: window.innerWidth <= 768 ? (showMobileFilters ? 'block' : 'none') : 'block',
                        }}
                    >
                        <FilterBar
                            filters={searchFilters}
                            handlers={filterActions}
                            totalResults={filteredTours.length}
                            tourData={filteredTours}
                        />
                    </div>

                    <ResultsContainer ref={resultsRef}>
                        {!isLoading && filteredTours.length > 0 && (
                            <ResultsHeader>
                                <ResultsCount>
                                    Page {currentPagination.currentPage} of {currentPagination.totalPages} /
                                    {currentPagination.totalCount} total results found
                                </ResultsCount>
                            </ResultsHeader>
                        )}

                        <ToursList>
                            {isLoading ? (
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
                            ) : !isLoading && filteredTours.length === 0 ? (
                                <NoDataFound
                                    type="search"
                                    onButtonClick={() => {
                                        filterActions.clearAllFilters();
                                        searchActions.resetSearch();
                                    }}
                                />
                            ) : (
                                <>
                                    {filteredTours.map((tour) => (
                                        <Link
                                            to={`/searchTrips/${tour.uuid}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                            key={tour.id}
                                        >
                                            <TourCard key={tour.id} variant="outlined">
                                                <TourImage>
                                                    <img src={tour.mainImage || '/placeholder.jpg'} alt={tour.title} />
                                                    <FavoriteButton
                                                        onClick={(e) => handleWishlistClick(tour.uuid, e)}
                                                        disabled={isProcessing(tour.uuid)}
                                                        style={{
                                                            color: getHeartColor(tour.uuid, tour),
                                                        }}
                                                    >
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

                                                    <TourDescription>{tour.shortDescription}</TourDescription>

                                                    <TourLocation>
                                                        <FaMapMarkerAlt size={14} />
                                                        <span>{tour.cityName}</span>
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
                                                            fullWidth={window.innerWidth < 768}
                                                        >
                                                            See details
                                                        </Button>
                                                    </TourMeta>
                                                </TourContent>
                                            </TourCard>
                                        </Link>
                                    ))}

                                    {/* only show pagination when we have data and not loading */}
                                    {filteredTours.length > 0 && (
                                        <PaginationContainer>
                                            <NavigationButton
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePrevious}
                                                disabled={!currentPagination.hasPrevious || isLoading}
                                            >
                                                <FaChevronLeft />
                                            </NavigationButton>

                                            <PaginationButtonsContainer>
                                                {renderPaginationButtons()}
                                            </PaginationButtonsContainer>

                                            <NavigationButton
                                                variant="outline"
                                                size="sm"
                                                onClick={handleNext}
                                                disabled={!currentPagination.hasNext || isLoading}
                                            >
                                                <FaChevronRight />
                                            </NavigationButton>
                                        </PaginationContainer>
                                    )}
                                </>
                            )}
                        </ToursList>
                    </ResultsContainer>
                </ContentContainer>
            </PageContainer>
            <ModalAlert
                isOpen={isLoginAlertOpen}
                onClose={() => setIsLoginAlertOpen(false)}
                title="Login Required"
                message="Please login to add items to your favorites."
                type="info"
                showCancel={true}
                confirmText="Login"
                cancelText="Cancel"
                onConfirm={handleLoginConfirm}
            />
        </>
    );
}
