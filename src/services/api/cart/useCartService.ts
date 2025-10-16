import { useTypedFetch, extractApiData, extractStatusCode, extractMessage } from '@/hooks/api/useTypedFetch';
import { ApiResponse } from '@/types/common/fetch';
import {
    AddToCartRequest,
    ApiCartResponse,
    CartItem,
    CartItemResponse,
    RemoveFromCartResponse,
} from '@/services/api/cart/types';
import { useEffect, useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { cleanCartData, mapApiToCartItem, mapCartItemResponseToCartItem } from '@/utils/general/cartItemHandling';

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
     * we will clean the cart data
     * on load to prevent any corruption
     */
    useEffect(() => {
        removeDuplicates();
        setCart(cleanCartData(cart));
    }, []);

    /**
     * Synchronizes local cart with server cart when user logs in
     * Merges local cart items with server cart, handling conflicts smoothly
     * @returns {Promise<void>}
     * Promise that resolves when synchronization is complete
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

        try {
            /* remove duplicates first */
            const localCart = cart.filter(
                (item, index, self) => index === self.findIndex((t) => t.tourId === item.tourId),
            );

            /* we fet server cart without updating local state first */
            const serverCartResponse = await getCartList(false);
            const serverCart = serverCartResponse.data?.data || [];

            /* then we sync local items to server that don't exist there  */
            const syncPromises = localCart.map(async (localItem) => {
                const existsOnServer = serverCart.some((serverItem) => serverItem.tour.uuid === localItem.tourId);

                if (!existsOnServer) {
                    try {
                        await addToCart({
                            tourUuid: localItem.tourId,
                            quantity: localItem.quantity,
                        });
                    } catch (error) {
                        console.info('Failed to sync item:', localItem.tourData.title, error);
                    }
                }
            });

            await Promise.all(syncPromises);
            await getCartList(true);
        } catch (error) {
            console.info('Cart sync failed:', error);
        } finally {
            syncStatus.current.isInProgress = false;
        }
    };

    /**
     * Fetches the user's cart items from the server without automatically updating local state
     * @param {boolean} updateLocal - Whether to update local cart state (default: false)
     * @returns {Promise<ApiResponse<ApiCartResponse>>}
     * Promise resolving to cart data from server
     */
    const getCartList = async (updateLocal: boolean = false): Promise<ApiResponse<ApiCartResponse>> => {
        const response = await fetchData({
            url: '/user/cartList/',
            method: 'GET',
        });

        const cartData = extractApiData<ApiCartResponse>(response);

        if (cartData?.data && updateLocal) {
            /* Map API response to CartItem format */
            const mappedCart = cartData.data.map(mapApiToCartItem);

            /* Clean and validate cart data */
            const cleanedCart = cleanCartData(mappedCart);
            setCart(cleanedCart);
        }

        return {
            data: cartData,
            statusCode: extractStatusCode(response),
            message: extractMessage(response, 'Cart fetched successfully'),
        };
    };

    /**
     * Adds a tour item to the cart (local first, then sync to server if authenticated)
     * @param {AddToCartRequest} data Cart item data including tour UUID and quantity
     * @param {CartItem} [localCartItem] Local cart item data for non-authenticated users
     * @returns {Promise<ApiResponse<CartItemResponse | null>>}
     * Promise resolving to added cart item response
     */
    const addToCart = async (
        data: AddToCartRequest,
        localCartItem?: CartItem,
    ): Promise<ApiResponse<CartItemResponse | null>> => {
        /* if not authenticated, we add to local cart only */
        if (!isAuthenticated()) {
            if (localCartItem) {
                setCart((prev) => {
                    const existingIndex = prev.findIndex((item) => item.tourId === localCartItem.tourId);
                    if (existingIndex >= 0) {
                        const updated = [...prev];
                        updated[existingIndex].quantity += data.quantity;
                        return updated;
                    }
                    return [...prev, localCartItem];
                });

                return {
                    data: null,
                    statusCode: 200,
                    message: 'Added to local cart successfully',
                };
            } else {
                throw new Error('Local cart item data required for non-authenticated users');
            }
        }
        try {
            const response = await fetchData({
                url: '/user/addTocart/',
                method: 'POST',
                data,
            });

            const cartItemData = extractApiData<CartItemResponse>(response);
            const statusCode = extractStatusCode(response);

            /* then we update the local cart if successful */
            if ((statusCode === 201 || statusCode === 200) && cartItemData) {
                const mappedItem = mapCartItemResponseToCartItem(cartItemData);

                setCart((prev) => {
                    const filteredCart = prev.filter((item) => item.tourId !== mappedItem.tourId);
                    const updatedCart = [...filteredCart, mappedItem];

                    return updatedCart;
                });
            }

            return {
                data: cartItemData,
                statusCode: statusCode,
                message: extractMessage(response, 'Added to cart successfully'),
            };
        } catch (error) {
            console.info('Failed to add to server cart:', error);
            throw error;
        }
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
     * Adds item to local cart only (for guest users)
     * @param {CartItem} cartItem - The cart item to add locally
     * @returns {void}
     */
    const addToLocalCart = (cartItem: CartItem): void => {
        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.tourId === cartItem.tourId);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex].quantity += cartItem.quantity;
                return updated;
            }
            return [...prev, cartItem];
        });
    };
    /**
     * Removes duplicate items from cart based on tourId
     * @returns {void}
     */
    const removeDuplicates = () => {
        setCart((prev) => {
            const uniqueItems = prev.filter(
                (item, index, self) => index === self.findIndex((t) => t.tourId === item.tourId),
            );
            return uniqueItems;
        });
    };

    /**
     * Clears all cart data when user logs out
     * Removes cart items from local state and localStorage, resets sync status
     */
    const clearCartOnLogout = () => {
        setCart([]);
        localStorage.removeItem('cart-storage');
        localStorage.removeItem('cartSynced');

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
            addToLocalCart,
            removeFromCart,
            syncCartOnLogin,
            clearCartOnLogout,
            removeDuplicates,
            cleanCartData,
            cart,
        }),
        [
            fetchData,
            cart,
            getCartList,
            addToCart,
            addToLocalCart,
            removeFromCart,
            syncCartOnLogin,
            clearCartOnLogout,
            removeDuplicates,
            cleanCartData,
        ],
    );
};
