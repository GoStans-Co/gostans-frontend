import { useFetch } from '@/hooks/api/useFetch';
import { ApiResponse } from '@/types/common/fetch';
import {
    AddToCartRequest,
    ApiCartItem,
    ApiCartResponse,
    CartItem,
    CartItemResponse,
    RemoveFromCartResponse,
} from '@/services/api/cart/types';
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import useCookieAuth from '@/services/cache/cookieAuthService';

/**
 * Cart Fetch Service - Cart Operations
 * @module useCartService
 * @description This module provides functions for cart operations
 */
export const useCartService = () => {
    const { execute: fetchData } = useFetch();
    const [cart, setCart] = useRecoilState(cartAtom);
    const { isAuthenticated } = useCookieAuth();

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

    const syncCartOnLogin = async (): Promise<void> => {
        try {
            const serverCartResponse = await getCartList();
            const serverCart = serverCartResponse.data?.data || [];

            const localCart = cart;

            for (const localItem of localCart) {
                const existsOnServer = serverCart.some((serverItem) => serverItem.tour.uuid === localItem.tourId);

                if (!existsOnServer) {
                    try {
                        await addToCart({
                            tourUuid: localItem.tourId,
                            quantity: localItem.quantity,
                        });
                    } catch (error) {
                        console.log('Item already exists on server or failed to add');
                    }
                }
            }

            /* we first fetch updated server cart and set it to local state */
            const updatedServerCart = await getCartList();
            const mappedCart = updatedServerCart.data?.data.map(mapApiToCartItem) || [];
            setCart(mappedCart);
        } catch (error) {
            console.error('Error syncing cart on login:', error);
        }
    };

    const getCartList = async (): Promise<ApiResponse<ApiCartResponse>> => {
        try {
            const response = await fetchData({
                url: '/user/cartList/',
                method: 'GET',
            });

            if (response.data) {
                /* then we map API response to CartItem format */
                const mappedCart = response.data.map(mapApiToCartItem);
                setCart(mappedCart);
            }

            return {
                data: response,
                statusCode: response.status,
                message: response.message,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            return {
                data: { statusCode: 500, message: 'Failed to fetch cart', data: [] },
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Failed to fetch cart',
            };
        }
    };

    const addToCart = async (data: AddToCartRequest): Promise<ApiResponse<CartItemResponse>> => {
        try {
            const response = await fetchData({
                url: '/user/addTocart/',
                method: 'POST',
                data,
            });

            /* if authenticated and successful, then update local cart */
            if (isAuthenticated() && (response.statusCode === 201 || response.statusCode === 200)) {
                const mappedItem = mapApiToCartItem(response.data);

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
                data: response.data,
                statusCode: response.statusCode,
                message: response.message,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw {
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Failed to add to cart',
            };
        }
    };

    const removeFromCart = async (tourUuid: string): Promise<ApiResponse<RemoveFromCartResponse>> => {
        try {
            const response = await fetchData({
                url: `/user/removeCart/${tourUuid}/`,
                method: 'DELETE',
            });

            if (isAuthenticated() && response.statusCode === 200) {
                setCart((prev) => prev.filter((item) => item.tourId !== tourUuid));
            }

            return {
                data: response.data,
                statusCode: response.statusCode,
                message: response.message,
            };
        } catch (error: unknown) {
            const errorResponse = error as { response?: { status?: number }; message?: string };
            throw {
                statusCode: errorResponse.response?.status || 500,
                message: errorResponse.message || 'Failed to remove from cart',
            };
        }
    };

    const clearCartOnLogout = () => {
        setCart([]);
        localStorage.removeItem('cart-storage');
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
