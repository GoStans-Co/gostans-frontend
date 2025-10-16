import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { useCartService } from '../useCartService';
import * as useTypedFetchModule from '@/hooks/api/useTypedFetch';
import * as useCookieAuthModule from '@/services/cache/cookieAuthService';
import { CartItem, ApiCartItem, CartItemResponse, AddToCartRequest } from '../types';

// Mock modules
vi.mock('@/hooks/api/useTypedFetch');
vi.mock('@/services/cache/cookieAuthService');

const mockExecute = vi.fn();
const mockIsAuthenticated = vi.fn();

describe('useCartService', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <RecoilRoot>{children}</RecoilRoot>
    );

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.spyOn(useTypedFetchModule, 'useTypedFetch').mockReturnValue({
            execute: mockExecute,
            data: null,
            loading: false,
            error: null,
            reset: vi.fn(),
        } as any);

        vi.spyOn(useCookieAuthModule, 'default').mockReturnValue({
            isAuthenticated: mockIsAuthenticated,
            setAuthCookie: vi.fn(),
            removeAuthCookie: vi.fn(),
            getAuthToken: vi.fn(),
            getRefreshToken: vi.fn(),
            getUserData: vi.fn(),
            authToken: 'mock-token',
            refreshToken: 'mock-refresh',
            userData: null,
        } as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getCartList', () => {
        it('should fetch cart list without updating local state', async () => {
            mockIsAuthenticated.mockReturnValue(true);
            
            const mockApiResponse: ApiCartItem[] = [
                {
                    id: 1,
                    tour: {
                        uuid: 'tour-1',
                        title: 'Mountain Trek',
                        price: '299.99',
                        mainImage: '/media/mountain.jpg',
                        tourType: 1,
                        durationDays: 3,
                        shortDescription: 'Amazing mountain trek',
                    },
                    quantity: 2,
                    addedAt: '2024-01-15T10:00:00Z',
                },
            ];

            mockExecute.mockResolvedValue({
                data: mockApiResponse,
                statusCode: 200,
                message: 'Success',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            await act(async () => {
                const response = await result.current.getCartList(false);
                expect(response.statusCode).toBe(200);
                expect(response.data?.data).toEqual(mockApiResponse);
            });

            expect(mockExecute).toHaveBeenCalledWith({
                url: '/user/cartList/',
                method: 'GET',
            });
        });

        it('should fetch cart list and update local state when updateLocal is true', async () => {
            mockIsAuthenticated.mockReturnValue(true);
            
            const mockApiResponse: ApiCartItem[] = [
                {
                    id: 1,
                    tour: {
                        uuid: 'tour-1',
                        title: 'City Tour',
                        price: '150.00',
                        mainImage: 'https://example.com/city.jpg',
                        tourType: 2,
                        durationDays: 1,
                        shortDescription: 'Explore the city',
                    },
                    quantity: 1,
                    addedAt: '2024-02-20T14:00:00Z',
                },
            ];

            mockExecute.mockResolvedValue({
                data: mockApiResponse,
                statusCode: 200,
                message: 'Success',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            await act(async () => {
                await result.current.getCartList(true);
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].tourId).toBe('tour-1');
            });
        });

        it('should handle empty cart response', async () => {
            mockIsAuthenticated.mockReturnValue(true);
            
            mockExecute.mockResolvedValue({
                data: [],
                statusCode: 200,
                message: 'Success',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            await act(async () => {
                const response = await result.current.getCartList(true);
                expect(response.statusCode).toBe(200);
            });

            expect(result.current.cart).toEqual([]);
        });
    });

    describe('addToCart', () => {
        it('should add item to local cart when not authenticated', async () => {
            mockIsAuthenticated.mockReturnValue(false);

            const localCartItem: CartItem = {
                tourId: 'tour-local',
                tourData: {
                    uuid: 'tour-local',
                    title: 'Local Tour',
                    price: '100.00',
                    mainImage: 'https://example.com/local.jpg',
                    duration: '2 days',
                    about: 'Local tour',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const { result } = renderHook(() => useCartService(), { wrapper });

            await act(async () => {
                const response = await result.current.addToCart(
                    { tourUuid: 'tour-local', quantity: 1 },
                    localCartItem
                );
                
                expect(response.statusCode).toBe(200);
                expect(response.message).toBe('Added to local cart successfully');
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].tourId).toBe('tour-local');
            });

            expect(mockExecute).not.toHaveBeenCalled();
        });

        it('should increment quantity when adding existing item to local cart', async () => {
            mockIsAuthenticated.mockReturnValue(false);

            const localCartItem: CartItem = {
                tourId: 'tour-existing',
                tourData: {
                    uuid: 'tour-existing',
                    title: 'Existing Tour',
                    price: '200.00',
                    mainImage: 'https://example.com/existing.jpg',
                    duration: '3 days',
                    about: 'Existing tour',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const { result } = renderHook(() => useCartService(), { wrapper });

            // Add first time
            await act(async () => {
                await result.current.addToCart(
                    { tourUuid: 'tour-existing', quantity: 1 },
                    localCartItem
                );
            });

            // Add second time
            await act(async () => {
                await result.current.addToCart(
                    { tourUuid: 'tour-existing', quantity: 2 },
                    localCartItem
                );
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].quantity).toBe(3);
            });
        });

        it('should throw error when not authenticated and no local cart item provided', async () => {
            mockIsAuthenticated.mockReturnValue(false);

            const { result } = renderHook(() => useCartService(), { wrapper });

            await expect(async () => {
                await act(async () => {
                    await result.current.addToCart({ tourUuid: 'tour-1', quantity: 1 });
                });
            }).rejects.toThrow('Local cart item data required for non-authenticated users');
        });

        it('should add item to server cart when authenticated', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            const mockResponse: CartItemResponse = {
                id: 1,
                tour: {
                    uuid: 'tour-server',
                    title: 'Server Tour',
                    price: '350.00',
                    mainImage: '/media/server.jpg',
                    tourType: 2,
                    durationDays: 4,
                    shortDescription: 'Server tour',
                },
                quantity: 2,
                addedAt: '2024-03-10T09:00:00Z',
            };

            mockExecute.mockResolvedValue({
                data: mockResponse,
                statusCode: 201,
                message: 'Added successfully',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            await act(async () => {
                const response = await result.current.addToCart({
                    tourUuid: 'tour-server',
                    quantity: 2,
                });
                
                expect(response.statusCode).toBe(201);
                expect(response.data?.tour.uuid).toBe('tour-server');
            });

            expect(mockExecute).toHaveBeenCalledWith({
                url: '/user/addTocart/',
                method: 'POST',
                data: { tourUuid: 'tour-server', quantity: 2 },
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].tourId).toBe('tour-server');
            });
        });

        it('should replace existing item in cart when adding to server', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            const existingItem: CartItem = {
                tourId: 'tour-replace',
                tourData: {
                    uuid: 'tour-replace',
                    title: 'Old Tour',
                    price: '100.00',
                    mainImage: 'old.jpg',
                    duration: '1 day',
                    about: 'Old',
                    tourType: 1,
                    shortDescription: 'Old',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const mockResponse: CartItemResponse = {
                id: 1,
                tour: {
                    uuid: 'tour-replace',
                    title: 'Updated Tour',
                    price: '150.00',
                    mainImage: 'new.jpg',
                    tourType: 1,
                    durationDays: 2,
                    shortDescription: 'Updated',
                },
                quantity: 3,
                addedAt: '2024-04-01T12:00:00Z',
            };

            mockExecute.mockResolvedValue({
                data: mockResponse,
                statusCode: 200,
                message: 'Updated successfully',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            // Add existing item first
            await act(async () => {
                result.current.addToLocalCart(existingItem);
            });

            // Update via server
            await act(async () => {
                await result.current.addToCart({
                    tourUuid: 'tour-replace',
                    quantity: 3,
                });
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].quantity).toBe(3);
                expect(result.current.cart[0].tourData.title).toBe('Updated Tour');
            });
        });

        it('should handle server error gracefully', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            mockExecute.mockRejectedValue(new Error('Server error'));

            const { result } = renderHook(() => useCartService(), { wrapper });

            await expect(async () => {
                await act(async () => {
                    await result.current.addToCart({
                        tourUuid: 'tour-error',
                        quantity: 1,
                    });
                });
            }).rejects.toThrow('Server error');
        });
    });

    describe('removeFromCart', () => {
        it('should remove item from cart when authenticated', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            mockExecute.mockResolvedValue({
                data: { tour_uuid: 'tour-remove', message: 'Removed' },
                statusCode: 200,
                message: 'Removed successfully',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            // Add an item first
            const item: CartItem = {
                tourId: 'tour-remove',
                tourData: {
                    uuid: 'tour-remove',
                    title: 'Tour to Remove',
                    price: '100.00',
                    mainImage: 'remove.jpg',
                    duration: '1 day',
                    about: 'Remove',
                    tourType: 1,
                    shortDescription: 'Remove',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(item);
            });

            await act(async () => {
                const response = await result.current.removeFromCart('tour-remove');
                expect(response.statusCode).toBe(200);
            });

            expect(mockExecute).toHaveBeenCalledWith({
                url: '/user/removeCart/tour-remove/',
                method: 'DELETE',
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(0);
            });
        });

        it('should not remove from local cart when not authenticated', async () => {
            mockIsAuthenticated.mockReturnValue(false);

            mockExecute.mockResolvedValue({
                data: { tour_uuid: 'tour-remove', message: 'Removed' },
                statusCode: 200,
                message: 'Removed successfully',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            const item: CartItem = {
                tourId: 'tour-keep',
                tourData: {
                    uuid: 'tour-keep',
                    title: 'Tour to Keep',
                    price: '100.00',
                    mainImage: 'keep.jpg',
                    duration: '1 day',
                    about: 'Keep',
                    tourType: 1,
                    shortDescription: 'Keep',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(item);
            });

            await act(async () => {
                await result.current.removeFromCart('tour-keep');
            });

            // Cart should still have the item since user is not authenticated
            expect(result.current.cart).toHaveLength(1);
        });
    });

    describe('addToLocalCart', () => {
        it('should add new item to local cart', async () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const item: CartItem = {
                tourId: 'tour-new',
                tourData: {
                    uuid: 'tour-new',
                    title: 'New Tour',
                    price: '250.00',
                    mainImage: 'new.jpg',
                    duration: '2 days',
                    about: 'New',
                    tourType: 1,
                    shortDescription: 'New',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(item);
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].tourId).toBe('tour-new');
            });
        });

        it('should increment quantity for existing item', async () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const item: CartItem = {
                tourId: 'tour-increment',
                tourData: {
                    uuid: 'tour-increment',
                    title: 'Increment Tour',
                    price: '100.00',
                    mainImage: 'increment.jpg',
                    duration: '1 day',
                    about: 'Increment',
                    tourType: 1,
                    shortDescription: 'Increment',
                },
                quantity: 2,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(item);
                result.current.addToLocalCart(item);
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
                expect(result.current.cart[0].quantity).toBe(4);
            });
        });
    });

    describe('removeDuplicates', () => {
        it('should remove duplicate items from cart', async () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const item1: CartItem = {
                tourId: 'tour-dup',
                tourData: {
                    uuid: 'tour-dup',
                    title: 'First',
                    price: '100.00',
                    mainImage: 'first.jpg',
                    duration: '1 day',
                    about: 'First',
                    tourType: 1,
                    shortDescription: 'First',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const item2: CartItem = {
                ...item1,
                tourData: { ...item1.tourData, title: 'Second' },
                quantity: 2,
            };

            await act(async () => {
                result.current.addToLocalCart(item1);
                // Manually add duplicate (shouldn't happen in normal flow)
                result.current.addToLocalCart(item2);
            });

            await act(async () => {
                result.current.removeDuplicates();
            });

            await waitFor(() => {
                expect(result.current.cart).toHaveLength(1);
            });
        });
    });

    describe('clearCartOnLogout', () => {
        it('should clear cart and localStorage', async () => {
            const { result } = renderHook(() => useCartService(), { wrapper });

            const item: CartItem = {
                tourId: 'tour-clear',
                tourData: {
                    uuid: 'tour-clear',
                    title: 'Clear Tour',
                    price: '100.00',
                    mainImage: 'clear.jpg',
                    duration: '1 day',
                    about: 'Clear',
                    tourType: 1,
                    shortDescription: 'Clear',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(item);
            });

            expect(result.current.cart).toHaveLength(1);

            await act(async () => {
                result.current.clearCartOnLogout();
            });

            await waitFor(() => {
                expect(result.current.cart).toEqual([]);
            });
        });
    });

    describe('syncCartOnLogin', () => {
        it('should not sync if already in progress', async () => {
            mockIsAuthenticated.mockReturnValue(true);
            mockExecute.mockResolvedValue({
                data: [],
                statusCode: 200,
                message: 'Success',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            // Start two syncs simultaneously
            await act(async () => {
                const sync1 = result.current.syncCartOnLogin();
                const sync2 = result.current.syncCartOnLogin();
                await Promise.all([sync1, sync2]);
            });

            // Should only call execute once for getCartList
            expect(mockExecute).toHaveBeenCalledTimes(1);
        });

        it('should sync local items to server', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            // Mock empty server cart
            mockExecute.mockResolvedValueOnce({
                data: [],
                statusCode: 200,
                message: 'Success',
            });

            // Mock successful addToCart
            mockExecute.mockResolvedValueOnce({
                data: {
                    id: 1,
                    tour: {
                        uuid: 'tour-sync',
                        title: 'Sync Tour',
                        price: '100.00',
                        mainImage: 'sync.jpg',
                        tourType: 1,
                        durationDays: 1,
                        shortDescription: 'Sync',
                    },
                    quantity: 1,
                    addedAt: '2024-05-01T10:00:00Z',
                },
                statusCode: 201,
                message: 'Added',
            });

            // Mock final getCartList
            mockExecute.mockResolvedValueOnce({
                data: [],
                statusCode: 200,
                message: 'Success',
            });

            const { result } = renderHook(() => useCartService(), { wrapper });

            const localItem: CartItem = {
                tourId: 'tour-sync',
                tourData: {
                    uuid: 'tour-sync',
                    title: 'Sync Tour',
                    price: '100.00',
                    mainImage: 'sync.jpg',
                    duration: '1 day',
                    about: 'Sync',
                    tourType: 1,
                    shortDescription: 'Sync',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            await act(async () => {
                result.current.addToLocalCart(localItem);
            });

            await act(async () => {
                await result.current.syncCartOnLogin();
            });

            await waitFor(() => {
                expect(mockExecute).toHaveBeenCalledWith(
                    expect.objectContaining({
                        url: '/user/addTocart/',
                        method: 'POST',
                    })
                );
            });
        });

        it('should handle sync errors gracefully', async () => {
            mockIsAuthenticated.mockReturnValue(true);

            mockExecute.mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useCartService(), { wrapper });

            // Should not throw error
            await act(async () => {
                await expect(result.current.syncCartOnLogin()).resolves.not.toThrow();
            });
        });
    });
});