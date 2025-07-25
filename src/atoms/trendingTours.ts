import { TourPropsResponse } from '@/services/api/tours';
import { atom, selector } from 'recoil';

export const trendingToursState = atom<TourPropsResponse[]>({
    key: 'trendingToursState',
    default: [],
});

export const trendingToursLoadingState = atom<boolean>({
    key: 'trendingToursLoadingState',
    default: false,
});

export const trendingToursErrorState = atom<string | null>({
    key: 'trendingToursErrorState',
    default: null,
});

export const homepageToursSelector = selector({
    key: 'homepageToursSelector',
    get: ({ get }) => {
        const tours = get(trendingToursState);
        return tours.slice(0, 8);
    },
});

export const tourTypesSelector = selector({
    key: 'tourTypesSelector',
    get: ({ get }) => {
        const tours = get(trendingToursState);
        const uniqueTypes = Array.from(new Set(tours.map((tour) => tour.tourType?.name).filter(Boolean)));
        return [
            { id: 'all', label: 'All Tours' },
            ...uniqueTypes.map((type) => ({
                id: type.toLowerCase().replace(/\s+/g, '-'),
                label: type,
            })),
        ];
    },
});
