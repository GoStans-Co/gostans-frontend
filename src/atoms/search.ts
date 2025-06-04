import { atom } from 'recoil';

export type SearchData = {
    destination: string;
    dates: string;
    travelers: string;
    adults: number;
    children: number;
    infants: number;
};

export type SearchFilters = {
    minPrice: string;
    maxPrice: string;
    selectedRating: string;
};

export type SearchUIState = {
    showTravelersDropdown: boolean;
    isSearching: boolean;
};

export type SearchCacheStatus = {
    loaded: boolean;
    lastFetch: number | null;
    isLoading: boolean;
};

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

export const searchResultsAtom = atom<
    Record<
        string,
        {
            data: any[];
            lastFetch: number;
            searchParams: SearchData & SearchFilters;
        }
    >
>({
    key: 'searchResultsAtom',
    default: {},
});

export const defaultSearchValuesAtom = atom<Partial<SearchData>>({
    key: 'defaultSearchValuesAtom',
    default: {
        destination: 'Uzbekistan',
        dates: '02 Jan 2025 ~ 04 Jan 2025',
        travelers: '2 adults, 2 children',
        adults: 2,
        children: 2,
        infants: 0,
    },
});
