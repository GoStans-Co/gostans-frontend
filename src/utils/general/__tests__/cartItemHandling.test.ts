import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createCartItemFromBooking,
    formatImageUrl,
    cleanCartData,
    mapApiToCartItem,
    mapCartItemResponseToCartItem,
} from '../cartItemHandling';
import type { Booking } from '@/services/api/user';
import type { ApiCartItem, CartItem, CartItemResponse } from '@/services/api/cart';

describe('cartItemHandling utilities', () => {
    describe('createCartItemFromBooking', () => {
        const mockBooking: Booking = {
            id: 1,
            uuid: 'test-uuid-123',
            tourTitle: 'Amazing Tour',
            tourType: '5',
            mainImage: '/media/tour.jpg',
            amount: '299.99',
            currency: 'USD',
            status: 'COMPLETED',
            tripStartDate: '2024-01-15',
            tripEndDate: '2024-01-20',
            createdAt: '2024-01-01T00:00:00Z',
        };

        beforeEach(() => {
            vi.stubEnv('VITE_API_URL', 'https://test-api.com/api/v1');
        });

        it('should create a CartItem from a Booking object', () => {
            const result = createCartItemFromBooking(mockBooking);

            expect(result).toEqual({
                tourId: 'test-uuid-123',
                tourData: {
                    uuid: 'test-uuid-123',
                    title: 'Amazing Tour',
                    price: '299.99',
                    mainImage: 'https://test-api.com/api/v1/media/tour.jpg',
                    duration: '5',
                    about: '',
                    tourType: 5,
                    shortDescription: '',
                },
                quantity: 1,
                selectedDate: '2024-01-15',
                adults: 1,
                addedAt: expect.any(Number),
                price: 299.99,
            });
        });

        it('should handle absolute HTTP URLs in mainImage', () => {
            const bookingWithHttpUrl = {
                ...mockBooking,
                mainImage: 'http://example.com/image.jpg',
            };

            const result = createCartItemFromBooking(bookingWithHttpUrl);
            expect(result.tourData.mainImage).toBe('http://example.com/image.jpg');
        });

        it('should handle absolute HTTPS URLs in mainImage', () => {
            const bookingWithHttpsUrl = {
                ...mockBooking,
                mainImage: 'https://cdn.example.com/image.jpg',
            };

            const result = createCartItemFromBooking(bookingWithHttpsUrl);
            expect(result.tourData.mainImage).toBe('https://cdn.example.com/image.jpg');
        });

        it('should use default API URL when VITE_API_URL is not set', () => {
            vi.stubEnv('VITE_API_URL', undefined);
            
            const result = createCartItemFromBooking(mockBooking);
            expect(result.tourData.mainImage).toBe('https://api.gostans.com/api/v1/media/tour.jpg');
        });

        it('should parse tourType as integer', () => {
            const bookingWithStringType = {
                ...mockBooking,
                tourType: '10',
            };

            const result = createCartItemFromBooking(bookingWithStringType);
            expect(result.tourData.tourType).toBe(10);
        });

        it('should default tourType to 0 when parsing fails', () => {
            const bookingWithInvalidType = {
                ...mockBooking,
                tourType: 'invalid',
            };

            const result = createCartItemFromBooking(bookingWithInvalidType);
            expect(result.tourData.tourType).toBe(0);
        });

        it('should parse amount as float', () => {
            const bookingWithDecimal = {
                ...mockBooking,
                amount: '1234.56',
            };

            const result = createCartItemFromBooking(bookingWithDecimal);
            expect(result.price).toBe(1234.56);
        });

        it('should always set quantity to 1', () => {
            const result = createCartItemFromBooking(mockBooking);
            expect(result.quantity).toBe(1);
        });

        it('should always set adults to 1', () => {
            const result = createCartItemFromBooking(mockBooking);
            expect(result.adults).toBe(1);
        });

        it('should generate a timestamp for addedAt', () => {
            const beforeTime = Date.now();
            const result = createCartItemFromBooking(mockBooking);
            const afterTime = Date.now();

            expect(result.addedAt).toBeGreaterThanOrEqual(beforeTime);
            expect(result.addedAt).toBeLessThanOrEqual(afterTime);
        });
    });

    describe('formatImageUrl', () => {
        beforeEach(() => {
            vi.stubEnv('REACT_APP_API_BASE_URL', 'https://test-api.com');
        });

        it('should return placeholder for empty string', () => {
            expect(formatImageUrl('')).toBe('/api/placeholder/400/300');
        });

        it('should return placeholder for null (coerced to empty)', () => {
            // @ts-expect-error Testing edge case
            expect(formatImageUrl(null)).toBe('/api/placeholder/400/300');
        });

        it('should return placeholder for undefined (coerced to empty)', () => {
            // @ts-expect-error Testing edge case
            expect(formatImageUrl(undefined)).toBe('/api/placeholder/400/300');
        });

        it('should return HTTP URLs unchanged', () => {
            const url = 'http://example.com/image.jpg';
            expect(formatImageUrl(url)).toBe(url);
        });

        it('should return HTTPS URLs unchanged', () => {
            const url = 'https://cdn.example.com/image.jpg';
            expect(formatImageUrl(url)).toBe(url);
        });

        it('should prepend API base URL to absolute paths', () => {
            const path = '/media/images/tour.jpg';
            expect(formatImageUrl(path)).toBe('https://test-api.com/media/images/tour.jpg');
        });

        it('should use default API URL when REACT_APP_API_BASE_URL is not set', () => {
            vi.stubEnv('REACT_APP_API_BASE_URL', undefined);
            
            const path = '/media/image.jpg';
            expect(formatImageUrl(path)).toBe('https://api.gostans.com/media/image.jpg');
        });

        it('should prepend API base URL and /media/ to relative paths', () => {
            const filename = 'tour-image.jpg';
            expect(formatImageUrl(filename)).toBe('https://test-api.com/media/tour-image.jpg');
        });

        it('should handle paths with subdirectories', () => {
            const path = 'tours/summer/beach.jpg';
            expect(formatImageUrl(path)).toBe('https://test-api.com/media/tours/summer/beach.jpg');
        });

        it('should handle URLs with query parameters', () => {
            const url = 'https://example.com/image.jpg?size=large&format=webp';
            expect(formatImageUrl(url)).toBe(url);
        });

        it('should handle URLs with fragments', () => {
            const url = 'https://example.com/image.jpg#section';
            expect(formatImageUrl(url)).toBe(url);
        });
    });

    describe('cleanCartData', () => {
        const validCartItem: CartItem = {
            tourId: 'tour-123',
            tourData: {
                uuid: 'tour-123',
                title: 'Test Tour',
                price: '99.99',
                mainImage: 'image.jpg',
                duration: '5 days',
                about: 'Description',
                tourType: 1,
                shortDescription: 'Short desc',
            },
            quantity: 2,
            adults: 1,
            addedAt: Date.now(),
            price: 99.99,
        };

        it('should return empty array for non-array input', () => {
            // @ts-expect-error Testing edge case
            expect(cleanCartData(null)).toEqual([]);
            // @ts-expect-error Testing edge case
            expect(cleanCartData(undefined)).toEqual([]);
            // @ts-expect-error Testing edge case
            expect(cleanCartData('not an array')).toEqual([]);
            // @ts-expect-error Testing edge case
            expect(cleanCartData(123)).toEqual([]);
        });

        it('should return empty array for empty input', () => {
            expect(cleanCartData([])).toEqual([]);
        });

        it('should filter out null or undefined items', () => {
            const cart = [validCartItem, null, validCartItem, undefined] as unknown[];
            const result = cleanCartData(cart);
            
            expect(result).toHaveLength(2);
            expect(result.every(item => item !== null && item !== undefined)).toBe(true);
        });

        it('should filter out non-object items', () => {
            const cart = [validCartItem, 'string', 123, true] as unknown[];
            const result = cleanCartData(cart);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(validCartItem);
        });

        it('should filter out items without tourId', () => {
            const invalidItem = { ...validCartItem, tourId: '' };
            const cart = [validCartItem, invalidItem];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
            expect(result[0].tourId).toBe('tour-123');
        });

        it('should filter out items without tourData', () => {
            const invalidItem = { ...validCartItem, tourData: null as unknown as CartItem['tourData'] };
            const cart = [validCartItem, invalidItem];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
        });

        it('should filter out items with empty tourData.uuid', () => {
            const invalidItem = {
                ...validCartItem,
                tourData: { ...validCartItem.tourData, uuid: '' },
            };
            const cart = [validCartItem, invalidItem];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
        });

        it('should filter out items with empty tourData.title', () => {
            const invalidItem = {
                ...validCartItem,
                tourData: { ...validCartItem.tourData, title: '' },
            };
            const cart = [validCartItem, invalidItem];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
        });

        it('should filter out items with zero or negative quantity', () => {
            const zeroQuantity = { ...validCartItem, quantity: 0 };
            const negativeQuantity = { ...validCartItem, tourId: 'tour-456', quantity: -1 };
            const cart = [validCartItem, zeroQuantity, negativeQuantity];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBeGreaterThan(0);
        });

        it('should remove duplicate items based on tourId', () => {
            const duplicate1 = { ...validCartItem, quantity: 1 };
            const duplicate2 = { ...validCartItem, quantity: 3 };
            const duplicate3 = { ...validCartItem, quantity: 5 };
            const cart = [duplicate1, duplicate2, duplicate3];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
            expect(result[0].tourId).toBe('tour-123');
        });

        it('should keep the first occurrence when removing duplicates', () => {
            const first = { ...validCartItem, quantity: 10 };
            const second = { ...validCartItem, quantity: 20 };
            const cart = [first, second];
            
            const result = cleanCartData(cart);
            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBe(10);
        });

        it('should handle multiple different items with some duplicates', () => {
            const item1 = validCartItem;
            const item2 = { ...validCartItem, tourId: 'tour-456' };
            const item3 = { ...validCartItem, tourId: 'tour-789' };
            const duplicate1 = validCartItem;
            const duplicate2 = { ...validCartItem, tourId: 'tour-456' };
            
            const cart = [item1, item2, duplicate1, item3, duplicate2];
            const result = cleanCartData(cart);
            
            expect(result).toHaveLength(3);
            expect(result.map(i => i.tourId).sort()).toEqual(['tour-123', 'tour-456', 'tour-789']);
        });

        it('should preserve valid items with all required properties', () => {
            const result = cleanCartData([validCartItem]);
            expect(result[0]).toEqual(validCartItem);
        });

        it('should handle complex scenario with multiple validation failures', () => {
            const nullItem = null;
            const noTourId = { ...validCartItem, tourId: '' };
            const noTitle = {
                ...validCartItem,
                tourId: 'tour-456',
                tourData: { ...validCartItem.tourData, uuid: 'tour-456', title: '' },
            };
            const zeroQty = { ...validCartItem, tourId: 'tour-789', quantity: 0 };
            const duplicate = validCartItem;
            
            const cart = [validCartItem, nullItem, noTourId, noTitle, zeroQty, duplicate] as unknown[];
            const result = cleanCartData(cart);
            
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(validCartItem);
        });
    });

    describe('mapApiToCartItem', () => {
        const mockApiItem: ApiCartItem = {
            id: 1,
            tour: {
                uuid: 'api-tour-123',
                title: 'API Tour',
                price: '149.99',
                mainImage: 'https://example.com/image.jpg',
                tourType: 2,
                durationDays: 7,
                shortDescription: 'A great tour',
            },
            quantity: 3,
            addedAt: '2024-01-15T10:30:00Z',
        };

        it('should map ApiCartItem to CartItem format', () => {
            const result = mapApiToCartItem(mockApiItem);

            expect(result).toEqual({
                tourId: 'api-tour-123',
                tourData: {
                    uuid: 'api-tour-123',
                    title: 'API Tour',
                    price: '149.99',
                    mainImage: 'https://example.com/image.jpg',
                    duration: '7 days',
                    about: 'A great tour',
                    tourType: 2,
                    shortDescription: 'A great tour',
                },
                quantity: 3,
                addedAt: new Date('2024-01-15T10:30:00Z').getTime(),
                adults: 1,
                price: 149.99,
                duration: '7 days',
            });
        });

        it('should handle null durationDays by using "Multi-day"', () => {
            const itemWithNullDuration = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, durationDays: null },
            };

            const result = mapApiToCartItem(itemWithNullDuration);
            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle undefined durationDays by using "Multi-day"', () => {
            const itemWithUndefinedDuration = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, durationDays: undefined as unknown as number | null },
            };

            const result = mapApiToCartItem(itemWithUndefinedDuration);
            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle zero durationDays by using "Multi-day"', () => {
            const itemWithZeroDuration = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, durationDays: 0 },
            };

            const result = mapApiToCartItem(itemWithZeroDuration);
            expect(result.tourData.duration).toBe('Multi-day');
        });

        it('should format single day duration', () => {
            const itemWithSingleDay = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, durationDays: 1 },
            };

            const result = mapApiToCartItem(itemWithSingleDay);
            expect(result.tourData.duration).toBe('1 days');
            expect(result.duration).toBe('1 days');
        });

        it('should use formatImageUrl when mainImage is missing', () => {
            const itemWithoutImage = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, mainImage: '' as unknown as string },
            };

            const result = mapApiToCartItem(itemWithoutImage);
            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should parse price string to float', () => {
            const itemWithDecimalPrice = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, price: '999.95' },
            };

            const result = mapApiToCartItem(itemWithDecimalPrice);
            expect(result.price).toBe(999.95);
        });

        it('should convert ISO date string to timestamp', () => {
            const dateString = '2024-06-15T14:30:00Z';
            const expectedTimestamp = new Date(dateString).getTime();
            
            const itemWithDate = {
                ...mockApiItem,
                addedAt: dateString,
            };

            const result = mapApiToCartItem(itemWithDate);
            expect(result.addedAt).toBe(expectedTimestamp);
        });

        it('should always set adults to 1', () => {
            const result = mapApiToCartItem(mockApiItem);
            expect(result.adults).toBe(1);
        });

        it('should use shortDescription for both about and shortDescription', () => {
            const itemWithDesc = {
                ...mockApiItem,
                tour: { ...mockApiItem.tour, shortDescription: 'Amazing experience' },
            };

            const result = mapApiToCartItem(itemWithDesc);
            expect(result.tourData.about).toBe('Amazing experience');
            expect(result.tourData.shortDescription).toBe('Amazing experience');
        });

        it('should preserve quantity from API response', () => {
            const itemWithLargeQuantity = {
                ...mockApiItem,
                quantity: 10,
            };

            const result = mapApiToCartItem(itemWithLargeQuantity);
            expect(result.quantity).toBe(10);
        });
    });

    describe('mapCartItemResponseToCartItem', () => {
        const mockCartItemResponse: CartItemResponse = {
            id: 2,
            tour: {
                uuid: 'response-tour-456',
                title: 'Response Tour',
                price: '249.50',
                mainImage: '/media/tour-image.jpg',
                tourType: 3,
                durationDays: 5,
                shortDescription: 'An exciting tour',
            },
            quantity: 2,
            addedAt: '2024-02-20T15:45:00Z',
        };

        beforeEach(() => {
            vi.stubEnv('REACT_APP_API_BASE_URL', 'https://test-api.com');
        });

        it('should map CartItemResponse to CartItem format', () => {
            const result = mapCartItemResponseToCartItem(mockCartItemResponse);

            expect(result).toEqual({
                tourId: 'response-tour-456',
                tourData: {
                    uuid: 'response-tour-456',
                    title: 'Response Tour',
                    price: '249.50',
                    mainImage: 'https://test-api.com/media/tour-image.jpg',
                    duration: '5 days',
                    about: 'An exciting tour',
                    tourType: 3,
                    shortDescription: 'An exciting tour',
                },
                quantity: 2,
                addedAt: new Date('2024-02-20T15:45:00Z').getTime(),
                adults: 1,
                price: 249.50,
                duration: '5 days',
            });
        });

        it('should format mainImage using formatImageUrl', () => {
            const result = mapCartItemResponseToCartItem(mockCartItemResponse);
            expect(result.tourData.mainImage).toBe('https://test-api.com/media/tour-image.jpg');
        });

        it('should handle absolute HTTP URLs in mainImage', () => {
            const responseWithHttpUrl = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, mainImage: 'http://cdn.com/image.jpg' },
            };

            const result = mapCartItemResponseToCartItem(responseWithHttpUrl);
            expect(result.tourData.mainImage).toBe('http://cdn.com/image.jpg');
        });

        it('should handle absolute HTTPS URLs in mainImage', () => {
            const responseWithHttpsUrl = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, mainImage: 'https://cdn.com/image.jpg' },
            };

            const result = mapCartItemResponseToCartItem(responseWithHttpsUrl);
            expect(result.tourData.mainImage).toBe('https://cdn.com/image.jpg');
        });

        it('should handle empty mainImage with placeholder', () => {
            const responseWithoutImage = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, mainImage: '' },
            };

            const result = mapCartItemResponseToCartItem(responseWithoutImage);
            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should handle null durationDays', () => {
            const responseWithNullDuration = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, durationDays: null },
            };

            const result = mapCartItemResponseToCartItem(responseWithNullDuration);
            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle zero durationDays', () => {
            const responseWithZeroDuration = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, durationDays: 0 },
            };

            const result = mapCartItemResponseToCartItem(responseWithZeroDuration);
            expect(result.tourData.duration).toBe('Multi-day');
        });

        it('should format durationDays with "days" suffix', () => {
            const responseWithTenDays = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, durationDays: 10 },
            };

            const result = mapCartItemResponseToCartItem(responseWithTenDays);
            expect(result.tourData.duration).toBe('10 days');
            expect(result.duration).toBe('10 days');
        });

        it('should parse price to float correctly', () => {
            const responseWithPrice = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, price: '1599.99' },
            };

            const result = mapCartItemResponseToCartItem(responseWithPrice);
            expect(result.price).toBe(1599.99);
        });

        it('should handle price with many decimal places', () => {
            const responseWithPrecisePrice = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, price: '99.999' },
            };

            const result = mapCartItemResponseToCartItem(responseWithPrecisePrice);
            expect(result.price).toBe(99.999);
        });

        it('should convert addedAt ISO string to timestamp', () => {
            const dateString = '2024-12-25T00:00:00Z';
            const expectedTimestamp = new Date(dateString).getTime();
            
            const responseWithDate = {
                ...mockCartItemResponse,
                addedAt: dateString,
            };

            const result = mapCartItemResponseToCartItem(responseWithDate);
            expect(result.addedAt).toBe(expectedTimestamp);
        });

        it('should always set adults to 1', () => {
            const result = mapCartItemResponseToCartItem(mockCartItemResponse);
            expect(result.adults).toBe(1);
        });

        it('should preserve quantity', () => {
            const responseWithQuantity = {
                ...mockCartItemResponse,
                quantity: 7,
            };

            const result = mapCartItemResponseToCartItem(responseWithQuantity);
            expect(result.quantity).toBe(7);
        });

        it('should use shortDescription for both about and shortDescription fields', () => {
            const responseWithDesc = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, shortDescription: 'Best tour ever!' },
            };

            const result = mapCartItemResponseToCartItem(responseWithDesc);
            expect(result.tourData.about).toBe('Best tour ever!');
            expect(result.tourData.shortDescription).toBe('Best tour ever!');
        });

        it('should handle tourType correctly', () => {
            const responseWithTourType = {
                ...mockCartItemResponse,
                tour: { ...mockCartItemResponse.tour, tourType: 5 },
            };

            const result = mapCartItemResponseToCartItem(responseWithTourType);
            expect(result.tourData.tourType).toBe(5);
        });

        it('should maintain tourId consistency', () => {
            const result = mapCartItemResponseToCartItem(mockCartItemResponse);
            expect(result.tourId).toBe(result.tourData.uuid);
            expect(result.tourId).toBe('response-tour-456');
        });
    });

    describe('Integration scenarios', () => {
        it('should handle full workflow: Booking -> CartItem -> Clean', () => {
            const booking: Booking = {
                id: 1,
                uuid: 'booking-123',
                tourTitle: 'Integration Test Tour',
                tourType: '3',
                mainImage: 'https://example.com/image.jpg',
                amount: '199.99',
                currency: 'USD',
                status: 'COMPLETED',
                tripStartDate: '2024-03-01',
                tripEndDate: '2024-03-05',
                createdAt: '2024-02-01T00:00:00Z',
            };

            const cartItem = createCartItemFromBooking(booking);
            const cleaned = cleanCartData([cartItem]);

            expect(cleaned).toHaveLength(1);
            expect(cleaned[0].tourId).toBe('booking-123');
            expect(cleaned[0].tourData.title).toBe('Integration Test Tour');
        });

        it('should handle API response mapping and cleaning', () => {
            const apiItems: ApiCartItem[] = [
                {
                    id: 1,
                    tour: {
                        uuid: 'tour-1',
                        title: 'Tour One',
                        price: '100',
                        mainImage: 'image1.jpg',
                        tourType: 1,
                        durationDays: 3,
                        shortDescription: 'Tour 1',
                    },
                    quantity: 1,
                    addedAt: '2024-01-01T00:00:00Z',
                },
                {
                    id: 2,
                    tour: {
                        uuid: 'tour-1', // Duplicate
                        title: 'Tour One Duplicate',
                        price: '100',
                        mainImage: 'image1.jpg',
                        tourType: 1,
                        durationDays: 3,
                        shortDescription: 'Tour 1',
                    },
                    quantity: 2,
                    addedAt: '2024-01-02T00:00:00Z',
                },
            ];

            const mapped = apiItems.map(mapApiToCartItem);
            const cleaned = cleanCartData(mapped);

            expect(cleaned).toHaveLength(1);
            expect(cleaned[0].tourId).toBe('tour-1');
        });
    });
});