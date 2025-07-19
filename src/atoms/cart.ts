import { CartItem } from '@/services/api/cart';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'cart-storage',
    storage: localStorage,
});

export const cartAtom = atom<CartItem[]>({
    key: 'cartAtom',
    default: [],
    effects_UNSTABLE: [persistAtom],
});
