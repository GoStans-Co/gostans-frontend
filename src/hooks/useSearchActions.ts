import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    searchDataAtom,
    searchFiltersAtom,
    searchUIStateAtom,
    searchCacheStatusAtom,
    searchResultsAtom,
    defaultSearchValuesAtom,
} from '@/atoms/search';
import { SearchCacheEntry, SearchData, SearchFilters } from '@/types/search';
import { TourListResponse } from '@/atoms/tours';

export const useSearchData = () => {
    return useRecoilValue(searchDataAtom);
};

export const useSearchFilters = () => {
    return useRecoilValue(searchFiltersAtom);
};

export const useSearchUIState = () => {
    return useRecoilValue(searchUIStateAtom);
};

export const useSearchActions = () => {
    const setSearchData = useSetRecoilState(searchDataAtom);
    const setSearchFilters = useSetRecoilState(searchFiltersAtom);
    const [uiState, setUIState] = useRecoilState(searchUIStateAtom);
    const setSearchResults = useSetRecoilState(searchResultsAtom);
    const setCacheStatus = useSetRecoilState(searchCacheStatusAtom);

    const updateSearchData = (updates: Partial<SearchData>) => {
        setSearchData((prev) => ({ ...prev, ...updates }));
    };

    const updateSearchFilters = (updates: Partial<SearchFilters>) => {
        setSearchFilters((prev) => ({ ...prev, ...updates }));
    };

    const updateUIState = (updates: Partial<typeof uiState>) => {
        setUIState((prev) => ({ ...prev, ...updates }));
    };

    const handleDestinationChange = (destination: string) => {
        updateSearchData({ destination });
    };

    const handleDatesChange = (dates: string) => {
        updateSearchData({ dates });
    };

    const handleTravelersChange = (travelers: string) => {
        updateSearchData({ travelers });
    };

    const handleTravelerCountChange = (adults: number, children: number, infants: number) => {
        updateSearchData({ adults, children, infants });
    };

    const handleTravelersDropdownToggle = (show: boolean) => {
        updateUIState({ showTravelersDropdown: show });
    };

    const setIsSearching = (isSearching: boolean) => {
        updateUIState({ isSearching });
    };

    const cacheSearchResults = (
        searchKey: string,
        data: TourListResponse[],
        searchParams: SearchData & SearchFilters & { paginationInfo?: any },
    ) => {
        setSearchResults((prev) => ({
            ...prev,
            [searchKey]: {
                data,
                lastFetch: Date.now(),
                searchParams: {
                    destination: searchParams.destination,
                    dates: searchParams.dates,
                    travelers: searchParams.travelers,
                    adults: searchParams.adults,
                    children: searchParams.children,
                    infants: searchParams.infants,
                    minPrice: searchParams.minPrice,
                    maxPrice: searchParams.maxPrice,
                    selectedRating: searchParams.selectedRating,
                    propertyTypes: searchParams.propertyTypes,
                    amenities: searchParams.amenities,
                    locations: searchParams.locations,
                    guestRating: searchParams.guestRating,
                },
                paginationInfo: searchParams.paginationInfo,
            } as SearchCacheEntry,
        }));
    };

    const updateCacheStatus = (updates: Partial<{ loaded: boolean; lastFetch: number | null; isLoading: boolean }>) => {
        setCacheStatus((prev) => ({ ...prev, ...updates }));
    };

    const resetSearch = () => {
        setSearchData({
            destination: '',
            dates: '',
            travelers: '',
            adults: 0,
            children: 0,
            infants: 0,
        });
        setSearchFilters({
            minPrice: '',
            maxPrice: '',
            selectedRating: '',
            propertyTypes: [],
            amenities: [],
            locations: [],
            guestRating: [],
        });
        updateUIState({ showTravelersDropdown: false, isSearching: false });
    };

    return {
        updateSearchData,
        updateSearchFilters,
        updateUIState,

        handleDestinationChange,
        handleDatesChange,
        handleTravelersChange,
        handleTravelerCountChange,
        handleTravelersDropdownToggle,

        setIsSearching,
        cacheSearchResults,
        updateCacheStatus,
        resetSearch,
    };
};

export const useFilterActions = () => {
    const setSearchFilters = useSetRecoilState(searchFiltersAtom);

    const updateFilters = (updates: Partial<SearchFilters>) => {
        setSearchFilters((prev) => ({ ...prev, ...updates }));
    };

    const handlePriceChange = (min: string, max: string) => {
        updateFilters({ minPrice: min, maxPrice: max });
    };

    const handleRatingChange = (rating: string) => {
        updateFilters({ selectedRating: rating });
    };

    const handlePropertyTypeChange = (types: string[]) => {
        updateFilters({ propertyTypes: types });
    };

    const handleAmenityChange = (amenities: string[]) => {
        updateFilters({ amenities });
    };

    const handleLocationChange = (locations: string[]) => {
        updateFilters({ locations });
    };

    const handleGuestRatingChange = (ratings: string[]) => {
        updateFilters({ guestRating: ratings });
    };

    const clearAllFilters = () => {
        setSearchFilters({
            minPrice: '',
            maxPrice: '',
            selectedRating: '',
            propertyTypes: [],
            amenities: [],
            locations: [],
            guestRating: [],
        });
    };

    return {
        updateFilters,
        handlePriceChange,
        handleRatingChange,
        handlePropertyTypeChange,
        handleAmenityChange,
        handleLocationChange,
        handleGuestRatingChange,
        clearAllFilters,
    };
};

export const useSearchCache = () => {
    const searchResults = useRecoilValue(searchResultsAtom);
    const cacheStatus = useRecoilValue(searchCacheStatusAtom);

    const getCachedResults = (searchKey: string) => {
        return searchResults[searchKey] || null;
    };

    const isCacheValid = (searchKey: string, maxAge: number = 5 * 60 * 1000) => {
        const cached = searchResults[searchKey];
        if (!cached) return false;

        const age = Date.now() - cached.lastFetch;
        return age < maxAge;
    };

    return {
        searchResults,
        cacheStatus,
        getCachedResults,
        isCacheValid,
    };
};

export const useDefaultSearchValues = () => {
    const defaultValues = useRecoilValue(defaultSearchValuesAtom);
    const { updateSearchData } = useSearchActions();

    const initializeDefaults = () => {
        updateSearchData(defaultValues as SearchData);
    };

    return {
        defaultValues,
        initializeDefaults,
    };
};
