import { TourListResponse, TourPropsResponse } from '@/services/api/tours';

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

export const transformToursArray = (tours: TourListResponse[]): TourPropsResponse[] => {
    return tours.map(transformTourData);
};

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
