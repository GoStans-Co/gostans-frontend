import { atom } from 'recoil';
import { SearchData, SearchFilters, SearchUIState, SearchCacheStatus, SearchCacheEntry } from '@/types/search';

export const searchDataAtom = atom<SearchData>({
    key: 'searchDataAtom',
    default: {
        destination: '',
        dates: '',
        travelers: '',
        adults: 0,
        children: 0,
        infants: 0,
    },
});

export const searchFiltersAtom = atom<SearchFilters>({
    key: 'searchFiltersAtom',
    default: {
        minPrice: '',
        maxPrice: '',
        selectedRating: '',
        propertyTypes: [],
        amenities: [],
        locations: [],
        guestRating: [],
    },
});

export const searchUIStateAtom = atom<SearchUIState>({
    key: 'searchUIStateAtom',
    default: {
        showTravelersDropdown: false,
        isSearching: false,
    },
});

export const searchCacheStatusAtom = atom<SearchCacheStatus>({
    key: 'searchCacheStatusAtom',
    default: {
        loaded: false,
        lastFetch: null,
        isLoading: false,
    },
});

export const searchResultsAtom = atom<Record<string, SearchCacheEntry>>({
    key: 'searchResultsAtom',
    default: {},
});

export const defaultSearchValuesAtom = atom<Partial<SearchData>>({
    key: 'defaultSearchValuesAtom',
    default: {
        destination: '',
        dates: '02 Jan 2025 ~ 04 Jan 2025',
        travelers: '1 adults, 0 children',
        adults: 1,
        children: 0,
        infants: 0,
    },
});
