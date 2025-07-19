import { TourListResponse } from '@/services/api/tours';

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
    propertyTypes: string[];
    amenities: string[];
    locations: string[];
    guestRating: string[];
};

export type SearchUIState = {
    showTravelersDropdown: boolean;
    isSearching: boolean;
};

export type PaginationInfo = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
    pageSize: number;
};

export type SearchCacheEntry = {
    data: TourListResponse[];
    lastFetch: number;
    searchParams: SearchData & SearchFilters;
    paginationInfo?: PaginationInfo;
};

export type SearchCacheStatus = {
    loaded: boolean;
    lastFetch: number | null;
    isLoading: boolean;
};
