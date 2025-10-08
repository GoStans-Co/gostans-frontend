import { wishlistAtom } from '@/atoms/wishlist';
import { useTypedFetch, extractApiData, extractStatusCode, extractMessage } from '@/hooks/api/useTypedFetch';
import { ApiResponse } from '@/types/common/fetch';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { WishlistAddResponse, WishlistResponse } from '@/services/api/wishlist/types';
import { TokenStorage } from '@/utils/tokenManagement/tokenStorage';

/**
 * Wishlist Fetch Service - Wishlist Operations
 * @module useWishlistService
 * @description This module provides functions for wishlist operations
 */
export const useWishlistService = () => {
    const { execute: fetchData } = useTypedFetch();
    const [wishlist, setWishlist] = useRecoilState(wishlistAtom);

    /**
     * Fetches the user's wishlist with pagination support
     * @param {Object} params - Pagination parameters
     * @param {number} [params.page=1] - Page number for pagination
     * @param {number} [params.pageSize=10] - Number of items per page
     * @returns {Promise<ApiResponse<WishlistResponse>>}
     * Promise resolving to wishlist data with pagination info
     */
    const getWishlist = async ({
        page = 1,
        pageSize = 10,
    }: {
        page?: number;
        pageSize?: number;
    } = {}): Promise<ApiResponse<WishlistResponse>> => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('page_size', pageSize.toString());

        const response = await fetchData({
            url: `/user/wishlist/?${params.toString()}`,
            method: 'GET',
        });

        const wishlistData = extractApiData<WishlistResponse>(response);

        if (wishlistData?.results) {
            setWishlist(wishlistData.results);
        }

        return {
            data: wishlistData,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'Wishlist fetched successfully'),
        };
    };

    /**
     * Adds a tour to the user's wishlist
     * @param {string} tourUuid - UUID of the tour to add to wishlist
     * @returns {Promise<ApiResponse<WishlistAddResponse>>}
     * Promise resolving to add confirmation response
     */
    const addToWishlist = async (tourUuid: string): Promise<ApiResponse<WishlistAddResponse>> => {
        const response = await fetchData({
            url: `/user/wishlist/add/${tourUuid}/`,
            method: 'POST',
        });

        const statusCode = extractStatusCode(response);

        if (statusCode === 201) {
            await getWishlist();
        }

        return {
            data: extractApiData<WishlistAddResponse>(response),
            statusCode: statusCode,
            message: extractMessage(response, 'Added to wishlist successfully'),
        };
    };

    /**
     * Removes a tour from the user's wishlist with optimistic updates
     * @param {string} tourUuid - UUID of the tour to remove from wishlist
     * @returns {Promise<void>} Promise that resolves when tour is removed
     */
    const removeFromWishlist = async (tourUuid: string): Promise<void> => {
        try {
            setWishlist((prev) => prev.filter((tour) => tour.uuid !== tourUuid));
            const accessToken = TokenStorage.getAccessToken();

            await fetchData({
                url: `/user/wishlist/delete/${tourUuid}/`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error: unknown) {
            await getWishlist();
            throw error;
        }
    };

    const isInWishlist = (tourUuid: string): boolean => {
        return wishlist.some((tour) => tour.uuid === tourUuid);
    };

    const clearWishlist = (): void => {
        setWishlist([]);
    };

    return useMemo(
        () => ({
            getWishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist,
        }),
        [fetchData, wishlist, setWishlist],
    );
};
