import { wishlistAtom } from '@/atoms/wishlist';
import { useFetch } from '@/hooks/api/useFetch';
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
    const { execute: fetchData } = useFetch();
    const [wishlist, setWishlist] = useRecoilState(wishlistAtom);

    const getWishlist = async ({
        page = 1,
        pageSize = 10,
    }: {
        page?: number;
        pageSize?: number;
    } = {}): Promise<ApiResponse<WishlistResponse>> => {
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('page_size', pageSize.toString());

            const response = await fetchData({
                url: `/user/wishlist/?${params.toString()}`,
                method: 'GET',
            });

            const apiResponse: ApiResponse<WishlistResponse> = {
                data: response.data,
                statusCode: response.statuscode,
                message: response.message,
            };

            if (response.data?.results) {
                setWishlist(response.data.results);
            }

            return apiResponse;
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                data: { count: 0, next: null, previous: null, results: [] },
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Failed to fetch wishlist',
            };
        }
    };

    const addToWishlist = async (tourUuid: string): Promise<ApiResponse<WishlistAddResponse>> => {
        try {
            const response = await fetchData({
                url: `/user/wishlist/add/${tourUuid}/`,
                method: 'POST',
            });

            const apiResponse: ApiResponse<WishlistAddResponse> = {
                data: response,
                statusCode: response.status,
                message: response.message,
            };

            if (response.status === 201) {
                await getWishlist();
            }

            return apiResponse;
        } catch (error: unknown) {
            throw error;
        }
    };

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
