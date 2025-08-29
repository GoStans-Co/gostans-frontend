import { useRecoilState } from 'recoil';
import { userProfileAtom, userCacheStatusAtom } from '@/atoms/auth';
import { AuthResponse, SocialAuthResponse } from '@/services/api/auth/types';
import { UserProfile } from '@/services/api/user/types';
import { CACHE_DURATION } from '@/services/api/user/userService';

export const useUserProfileCache = () => {
    const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(userCacheStatusAtom);

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        return Date.now() - lastFetch < CACHE_DURATION;
    };

    const updateUserProfileCache = (userData: AuthResponse['user'] | SocialAuthResponse | UserProfile): void => {
        const now = Date.now();

        if ('dateJoined' in userData && 'isVerified' in userData) {
            setUserProfile(userData as UserProfile);
        } else if ('accessToken' in userData) {
            /* to handle social login response */
            const socialUser = userData as SocialAuthResponse;
            setUserProfile({
                id: socialUser.id,
                email: socialUser.email,
                name: socialUser.name,
                phone: socialUser.phone || '',
                bookings: { all: [], upcoming: [], completed: [] },
                image: socialUser.imageURL || undefined,
                dateJoined: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isVerified: true,
                wishlists: [],
            });
        } else {
            /* for regular login response */
            const regularUser = userData as AuthResponse['user'];
            setUserProfile({
                id: regularUser.id,
                email: regularUser.email,
                name: regularUser.name,
                bookings: { all: [], upcoming: [], completed: [] },
                phone: regularUser.phone || '',
                image: regularUser.imageURL || undefined,
                dateJoined: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isVerified: false,
                wishlists: [],
            });
        }

        setCacheStatus({ loaded: true, lastFetch: now });
    };

    const isProfileCached = (): boolean => {
        /* adding this check if token exists and is valid */
        const authToken = document.cookie.match(/authToken=([^;]+)/)?.[1];
        if (!authToken) return false;

        return cacheStatus.loaded && isCacheValid(cacheStatus.lastFetch) && !!userProfile;
    };

    const clearProfileCache = () => {
        setUserProfile(null);
        setCacheStatus({ loaded: false, lastFetch: null });
    };

    const forceProfileRefresh = () => {
        setCacheStatus({ loaded: false, lastFetch: null });
    };

    return {
        userProfile,
        cacheStatus,
        updateUserProfileCache,
        clearProfileCache,
        forceProfileRefresh,
        isCacheValid,
        isProfileCached,
    };
};
