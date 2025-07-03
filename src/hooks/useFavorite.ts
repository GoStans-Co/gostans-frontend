import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { message } from 'antd';
import useApiServices from '@/services';
import { wishlistAtom } from '@/atoms/wishlist';
import useCookieAuth from '@/services/cookieAuthService';

export default function useFavorite() {
    const wishlist = useRecoilValue(wishlistAtom);
    const setWishlist = useSetRecoilState(wishlistAtom);
    const { wishlist: wishlistService } = useApiServices();

    const { isAuthenticated } = useCookieAuth();

    const [messageApi, contextHolder] = message.useMessage();
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
            messageApi.error('Tour ID is required');
            return false;
        }

        setIsAddingToWishlist(tourUuid);

        try {
            const isCurrentlyInWishlist = isInWishlist(tourUuid);

            if (isCurrentlyInWishlist) {
                await wishlistService.removeFromWishlist(tourUuid);
                setWishlist((prev) => prev.filter((item) => item.uuid !== tourUuid));
                messageApi.success('Removed from favorites');
            } else {
                const response = await wishlistService.addToWishlist(tourUuid);

                if (response.data.statuscode === 201) {
                    if (tourData) {
                        setWishlist((prev) => [...prev, tourData]);
                    } else {
                        /* fallback to fetch wishlist if tourData is not provided */
                        await wishlistService.getWishlist();
                    }
                    messageApi.success('Added to favorites');
                }
            }
            return true;
        } catch (error) {
            messageApi.error('Failed to update favorites');
            console.error('Wishlist error:', error);
            return false;
        } finally {
            setIsAddingToWishlist(null);
        }
    };

    const toggleFavorite = async (tourUuid: string) => {
        return await toggleWishlistWithTour(tourUuid);
    };

    const getHeartColor = (tourUuid: string): string => {
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

        contextHolder,
        messageApi,
    };
}
