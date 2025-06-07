import { UserProfile } from '@/services/api';
import { atom } from 'recoil';

export type CacheStatus = {
    loaded: boolean;
    lastFetch: number | null;
};

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
