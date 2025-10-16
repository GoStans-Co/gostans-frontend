import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCartService } from './useCartService';
import { RecoilRoot } from 'recoil';
import React from 'react';

// Mock dependencies
vi.mock('@/hooks/api/useTypedFetch', () => ({
    useTypedFetch: () => ({
        execute: vi.fn().mockResolvedValue({
            data: { data: [], statusCode: 200, message: 'Success' },
        }),
    }),
    extractApiData: vi.fn((response) => response?.data),
    extractStatusCode: vi.fn(() => 200),
    extractMessage: vi.fn((_, defaultMsg) => defaultMsg),
}));

vi.mock('@/services/cache/cookieAuthService', () => ({
    default: () => ({
        isAuthenticated: vi.fn(() => true),
        getUserData: vi.fn(),
        getRefreshToken: vi.fn(),
    }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(RecoilRoot, null, children);

describe('useCartService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('hook initialization', () => {
        it('should initialize with empty cart', () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            expect(result.current.cart).toEqual([]);
        });

        it('should provide all cart service methods', () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            expect(result.current.getCartList).toBeDefined();
            expect(result.current.addToCart).toBeDefined();
            expect(result.current.addToLocalCart).toBeDefined();
            expect(result.current.removeFromCart).toBeDefined();
            expect(result.current.syncCartOnLogin).toBeDefined();
            expect(result.current.clearCartOnLogout).toBeDefined();
            expect(result.current.removeDuplicates).toBeDefined();
        });
    });

    describe('addToLocalCart', () => {
        it('should add item to local cart', () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const cartItem = {
                tourId: 'tour-1',
                tourData: {
                    uuid: 'tour-1',
                    title: 'Test Tour',
                    price: '100',
                    mainImage: 'img.jpg',
                    duration: '3 days',
                    about: 'Test',
                    tourType: 1,
                    shortDescription: 'Short',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            act(() => {
                result.current.addToLocalCart(cartItem);
            });

            expect(result.current.cart).toHaveLength(1);
            expect(result.current.cart[0].tourId).toBe('tour-1');
        });

        it('should increment quantity for existing item', () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const cartItem = {
                tourId: 'tour-1',
                tourData: {
                    uuid: 'tour-1',
                    title: 'Test Tour',
                    price: '100',
                    mainImage: 'img.jpg',
                    duration: '3 days',
                    about: 'Test',
                    tourType: 1,
                    shortDescription: 'Short',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            act(() => {
                result.current.addToLocalCart(cartItem);
                result.current.addToLocalCart(cartItem);
            });

            expect(result.current.cart).toHaveLength(1);
            expect(result.current.cart[0].quantity).toBe(2);
        });
    });

    describe('removeDuplicates', () => {
        it('should remove duplicate items by tourId', async () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const item1 = {
                tourId: 'tour-1',
                tourData: {
                    uuid: 'tour-1',
                    title: 'Tour 1',
                    price: '100',
                    mainImage: 'img.jpg',
                    duration: '3 days',
                    about: 'Test',
                    tourType: 1,
                    shortDescription: 'Short',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const item2 = { ...item1, quantity: 2 };

            act(() => {
                result.current.addToLocalCart(item1);
            });

            // Manually add duplicate (simulating corrupted state)
            act(() => {
                result.current.addToLocalCart(item2);
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
            });
        });
    });

    describe('clearCartOnLogout', () => {
        it('should clear cart and localStorage', () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            localStorage.setItem('cart-storage', 'test');
            localStorage.setItem('cartSynced', 'true');

            const cartItem = {
                tourId: 'tour-1',
                tourData: {
                    uuid: 'tour-1',
                    title: 'Test Tour',
                    price: '100',
                    mainImage: 'img.jpg',
                    duration: '3 days',
                    about: 'Test',
                    tourType: 1,
                    shortDescription: 'Short',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            act(() => {
                result.current.addToLocalCart(cartItem);
            });

            expect(result.current.cart).toHaveLength(1);

            act(() => {
                result.current.clearCartOnLogout();
            });

            expect(result.current.cart).toHaveLength(0);
            expect(localStorage.getItem('cart-storage')).toBeNull();
            expect(localStorage.getItem('cartSynced')).toBeNull();
        });
    });
});