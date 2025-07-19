import { UserProfile } from '@/services/api/user/types';
import { CacheStatus } from '@/services/api/tours';
import { UserData } from '@/services/cache/cookieAuthService';
import { atom, selector } from 'recoil';

export const userProfileAtom = atom<UserProfile | null>({
    key: 'userProfileAtom',
    default: null,
});

export const userCacheStatusAtom = atom<CacheStatus>({
    key: 'userCacheStatusAtom',
    default: {
        loaded: false,
        lastFetch: null,
    },
});

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
