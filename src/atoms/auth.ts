import { atom, selector } from 'recoil';
import { UserData } from '@/services/cookieAuthService';

export const authTokenAtom = atom<string | null>({
    key: 'authToken',
    default: null,
});

export const userDataAtom = atom<UserData | null>({
    key: 'userData',
    default: null,
});

export const isAuthenticatedSelector = selector({
    key: 'isAuthenticated',
    get: ({ get }) => {
        const token = get(authTokenAtom);
        const user = get(userDataAtom);
        return !!(token && user);
    },
});
