import { atom } from 'recoil';
import { TourDetailsResponse } from '@/atoms/tours';

export type CartItem = {
    tourId: string;
    tourData: TourDetailsResponse;
    quantity: number;
    selectedDate?: string;
    adults: number;
    addedAt: number;
};

export const cartAtom = atom<CartItem[]>({
    key: 'cartAtom',
    default: [],
});
