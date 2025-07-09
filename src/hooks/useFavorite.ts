import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useApiServices from '@/services';
import { wishlistAtom } from '@/atoms/wishlist';
import useCookieAuth from '@/services/cookieAuthService';

export default function useFavorite() {
    const wishlist = useRecoilValue(wishlistAtom);
    const setWishlist = useSetRecoilState(wishlistAtom);
    const { wishlist: wishlistService } = useApiServices();

    const { isAuthenticated } = useCookieAuth();

    const [isAddingToWishlist, setIsAddingToWishlist] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeWishlist = async () => {
            if (isAuthenticated() && !isInitialized) {
                try {
                    await wishlistService.getWishlist();
                    setIsInitialized(true);
                } catch (error) {
                    console.error('Failed to initialize wishlist:', error);
                }
            }
        };
        initializeWishlist();
    }, [isAuthenticated, isInitialized]);

    const isInWishlist = (tourUuid: string): boolean => {
        return wishlist.some((item) => item.uuid === tourUuid);
    };

    const toggleWishlistWithTour = async (tourUuid: string, tourData?: any, e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!tourUuid) {
            return false;
        }

        setIsAddingToWishlist(tourUuid);

        try {
            const response = await wishlistService.addToWishlist(tourUuid);

            if (response.data.statuscode === 201 || response.data.statuscode === 200) {
                if (tourData) {
                    const updatedTourData = { ...tourData, isLiked: !tourData.isLiked };

                    if (updatedTourData.isLiked) {
                        setWishlist((prev) => [...prev.filter((item) => item.uuid !== tourUuid), updatedTourData]);
                    } else {
                        setWishlist((prev) => prev.filter((item) => item.uuid !== tourUuid));
                    }
                } else {
                    await wishlistService.getWishlist();
                }
            }
            return true;
        } catch (error) {
            console.error('Wishlist error:', error);
            return false;
        } finally {
            setIsAddingToWishlist(null);
        }
    };

    const toggleFavorite = async (tourUuid: string) => {
        return await toggleWishlistWithTour(tourUuid);
    };

    const getHeartColor = (tourUuid: string, tourData?: any): string => {
        if (tourData && typeof tourData.isLiked === 'boolean') {
            return tourData.isLiked ? '#ef4444' : '#64748b';
        }
        return isInWishlist(tourUuid) ? '#ef4444' : '#64748b';
    };

    const isProcessing = (tourUuid: string): boolean => {
        return isAddingToWishlist === tourUuid;
    };

    return {
        wishlist,
        isAddingToWishlist,

        isInWishlist,
        toggleWishlistWithTour,
        toggleFavorite,
        getHeartColor,
        isProcessing,
    };
}
