import { TourListResponse, TourPropsResponse } from '@/services/api/tours';

/**
 * Transform a single tour data from API response to TourPropsResponse format
 * @param {TourListResponse} tour - Tour data from API response
 * @returns {TourPropsResponse} Transformed tour data
 */
export const transformTourData = (tour: TourListResponse): TourPropsResponse => ({
    id: tour.id,
    title: tour.title,
    shortDescription: tour.shortDescription || '',
    tourType: {
        id: tour.tourType?.id || 0,
        name: tour.tourType?.name || 'General',
    },
    currency: tour.currency || 'USD',
    isLiked: tour.isLiked || false,
    uuid: tour.uuid || '',
    price: Number(tour.price || '0'),
    mainImage: tour.mainImage || null,
    country: tour.countryName || 'Unknown',
    variant: 'link',
    buttonText: 'Book Now',
});

/**
 * Transform an array of tours from API response to TourPropsResponse format
 * @param {TourListResponse[]} tours - Array of tour data from API response
 * @returns {TourPropsResponse[]} Array of transformed tour data
 */
export const transformToursArray = (tours: TourListResponse[]): TourPropsResponse[] => {
    return tours.map(transformTourData);
};

/**
 * Get unique tour type tabs from an array of tours
 * @param {TourPropsResponse[]} tours - Array of tour data
 * @returns {Array<{ id: string; label: string }>} Array of unique tour type tabs
 */
export const getUniqueTypesTabs = (tours: TourPropsResponse[]) => {
    const uniqueTypes = Array.from(new Set(tours.map((tour) => tour.tourType?.name).filter(Boolean)));

    return [
        { id: 'all', label: 'All Tours' },
        ...uniqueTypes.map((type) => ({
            id: type.toLowerCase().replace(/\s+/g, '-'),
            label: type,
        })),
    ];
};
