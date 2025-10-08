import { useTypedFetch, extractApiData, extractStatusCode, extractMessage } from '@/hooks/api/useTypedFetch';
import { ApiResponse } from '@/types/common/fetch';
import {
    AddToCartRequest,
    ApiCartItem,
    ApiCartResponse,
    CartItem,
    CartItemResponse,
    RemoveFromCartResponse,
} from '@/services/api/cart/types';
import { useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import useCookieAuth from '@/services/cache/cookieAuthService';

/**
 * Cart Fetch Service - Cart Operations
 * @module useCartService
 * @description This module provides functions for cart operations
 */
export const useCartService = () => {
    const { execute: fetchData } = useTypedFetch();
    const [cart, setCart] = useRecoilState(cartAtom);
    const { isAuthenticated } = useCookieAuth();

    const syncStatus = useRef({
        isInProgress: false,
        lastSyncTime: 0,
        SYNC_COOLDOWN: 3000,
    });

    /**
     * Maps API cart item response to internal CartItem format
     * @param {ApiCartItem} apiItem - Cart item data from API response
     * @returns {CartItem} Mapped cart item in internal format
     */
    const mapApiToCartItem = (apiItem: ApiCartItem): CartItem => {
        return {
            tourId: apiItem.tour.uuid,
            tourData: {
                uuid: apiItem.tour.uuid,
                title: apiItem.tour.title,
                price: apiItem.tour.price,
                mainImage: apiItem.tour.mainImage,
                duration: apiItem.tour.duration,
                about: apiItem.tour.shortDescription,
                tourType: apiItem.tour.tourType,
                shortDescription: apiItem.tour.shortDescription,
            },
            quantity: apiItem.quantity,
            addedAt: new Date(apiItem.addedAt).getTime(),
            adults: 1,
            price: parseFloat(apiItem.tour.price),
            duration: apiItem.tour.duration,
        };
    };

    /**
     * Synchronizes local cart with server cart when user logs in
     * Merges local cart items with server cart, handling conflicts smoothly
     * @returns {Promise<void>} Promise that resolves when synchronization is complete
     */
    const syncCartOnLogin = async (): Promise<void> => {
        const now = Date.now();

        if (syncStatus.current.isInProgress) {
            return;
        }

        if (now - syncStatus.current.lastSyncTime < syncStatus.current.SYNC_COOLDOWN) {
            return;
        }

        syncStatus.current.isInProgress = true;
        syncStatus.current.lastSyncTime = now;

        const serverCartResponse = await getCartList();
        const serverCart = serverCartResponse.data?.data || [];

        const localCart = cart;

        /**
         *  We sync local items to server as we handle individual failures smoothly
         */
        for (const localItem of localCart) {
            const existsOnServer = serverCart.some((serverItem) => serverItem.tour.uuid === localItem.tourId);

            if (!existsOnServer) {
                try {
                    await addToCart({
                        tourUuid: localItem.tourId,
                        quantity: localItem.quantity,
                    });
                } catch (error) {
                    console.error('Item sync failed (likely already exists):', error);
                }
            }
        }

        /* Fetch updated server cart and set it to local state */
        const updatedServerCart = await getCartList();
        const mappedCart = updatedServerCart.data?.data.map(mapApiToCartItem) || [];
        setCart(mappedCart);

        syncStatus.current.isInProgress = false;
    };

    /**
     * Fetches the user's cart items from the server and updates local state
     * @returns {Promise<ApiResponse<ApiCartResponse>>}
     * Promise resolving to cart data from server
     */
    const getCartList = async (): Promise<ApiResponse<ApiCartResponse>> => {
        const response = await fetchData({
            url: '/user/cartList/',
            method: 'GET',
        });

        const cartData = extractApiData<ApiCartResponse>(response);

        if (cartData?.data) {
            /* then we map API response to CartItem format */
            const mappedCart = cartData.data.map(mapApiToCartItem);
            setCart(mappedCart);
        }

        return {
            data: cartData,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'Cart fetched successfully'),
        };
    };

    /**
     * Adds a tour item to the user's cart
     * @param {AddToCartRequest} data
     * Cart item data including tour UUID and quantity
     * @returns {Promise<ApiResponse<CartItemResponse>>}
     * Promise resolving to added cart item response
     */
    const addToCart = async (data: AddToCartRequest): Promise<ApiResponse<CartItemResponse>> => {
        const response = await fetchData({
            url: '/user/addTocart/',
            method: 'POST',
            data,
        });

        const cartItemData = extractApiData<CartItemResponse>(response);
        const statusCode = extractStatusCode(response);

        /* if authenticated and successful, then update local cart */
        if (isAuthenticated() && (statusCode === 201 || statusCode === 200)) {
            const mappedItem = mapApiToCartItem(cartItemData);

            setCart((prev) => {
                const existingIndex = prev.findIndex((item) => item.tourId === mappedItem.tourId);
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = mappedItem;
                    return updated;
                }
                return [...prev, mappedItem];
            });
        }

        return {
            data: cartItemData,
            statusCode: statusCode,
            message: extractMessage(response, 'Added to cart successfully'),
        };
    };

    /**
     * Removes a tour item from the user's cart
     * @param {string} tourUuid - UUID of the tour to remove from cart
     * @returns {Promise<ApiResponse<RemoveFromCartResponse>>}
     * Promise resolving to removal confirmation
     */
    const removeFromCart = async (tourUuid: string): Promise<ApiResponse<RemoveFromCartResponse>> => {
        const response = await fetchData({
            url: `/user/removeCart/${tourUuid}/`,
            method: 'DELETE',
        });

        const statusCode = extractStatusCode(response);

        if (isAuthenticated() && statusCode === 200) {
            setCart((prev) => prev.filter((item) => item.tourId !== tourUuid));
        }

        return {
            data: extractApiData<RemoveFromCartResponse>(response),
            statusCode: statusCode,
            message: extractMessage(response, 'Removed from cart successfully'),
        };
    };

    /**
     * Clears all cart data when user logs out
     * Removes cart items from local state and localStorage, resets sync status
     */
    const clearCartOnLogout = () => {
        setCart([]);
        localStorage.removeItem('cart-storage');

        syncStatus.current = {
            isInProgress: false,
            lastSyncTime: 0,
            SYNC_COOLDOWN: 3000,
        };
    };

    return useMemo(
        () => ({
            getCartList,
            addToCart,
            removeFromCart,
            syncCartOnLogin,
            clearCartOnLogout,
            cart,
        }),
        [fetchData, cart],
    );
};
