import { atom } from 'recoil';

export type WishlistTour = {
    id: number;
    uuid: string;
    title: string;
    tourType: string;
    mainImage: string;
    price?: string;
    country?: string;
    city?: string;
};

export const wishlistAtom = atom<WishlistTour[]>({
    key: 'wishlistAtom',
    default: [],
});
