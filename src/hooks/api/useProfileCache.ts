import { useRecoilState } from 'recoil';
import { userProfileAtom, userCacheStatusAtom } from '@/atoms/auth';
import { AuthResponse, SocialAuthResponse } from '@/services/api/auth/types';
import { UserProfile } from '@/services/api/user/types';

export const CACHE_DURATION = 5 * 60 * 1000;

export const useUserProfileCache = () => {
    const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
    const [cacheStatus, setCacheStatus] = useRecoilState(userCacheStatusAtom);

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        return Date.now() - lastFetch < CACHE_DURATION;
    };

    const updateUserProfileCache = (userData: AuthResponse['user'] | SocialAuthResponse | UserProfile): void => {
        const now = Date.now();

        // Handle UserProfile type (from fetch service)
        if ('dateJoined' in userData && 'isVerified' in userData) {
            setUserProfile(userData as UserProfile);
        }
        // Handle social login response
        else if ('accessToken' in userData) {
            const socialUser = userData as SocialAuthResponse;
            setUserProfile({
                id: socialUser.id,
                email: socialUser.email,
                name: socialUser.name,
                phone: socialUser.phone || '',
                image: socialUser.imageURL,
                dateJoined: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isVerified: true,
                wishLists: [],
            });
        }
        // Handle regular login response
        else {
            const regularUser = userData as AuthResponse['user'];
            setUserProfile({
                id: regularUser.id,
                email: regularUser.email,
                name: regularUser.name,
                phone: regularUser.phone || '',
                image: undefined,
                dateJoined: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isVerified: false,
                wishLists: [],
            });
        }

        setCacheStatus({ loaded: true, lastFetch: now });
    };

    const isProfileCached = (): boolean => {
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
