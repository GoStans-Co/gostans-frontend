import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createCartItemFromBooking,
    formatImageUrl,
    cleanCartData,
    mapApiToCartItem,
    mapCartItemResponseToCartItem,
} from '../cartItemHandling';
import { CartItem, ApiCartItem, CartItemResponse } from '@/services/api/cart/types';
import { Booking } from '@/services/api/user';

describe('cartItemHandling utilities', () => {
    describe('createCartItemFromBooking', () => {
        it('should create a cart item from a booking with absolute URL', () => {
            const booking: Booking = {
                uuid: 'tour-123',
                tourTitle: 'Amazing Tour',
                amount: '299.99',
                mainImage: 'https://example.com/image.jpg',
                tourType: '3',
                tripStartDate: '2024-01-15',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result).toEqual({
                tourId: 'tour-123',
                tourData: {
                    uuid: 'tour-123',
                    title: 'Amazing Tour',
                    price: '299.99',
                    mainImage: 'https://example.com/image.jpg',
                    duration: '3',
                    about: '',
                    tourType: 3,
                    shortDescription: '',
                },
                quantity: 1,
                selectedDate: '2024-01-15',
                adults: 1,
                addedAt: expect.any(Number),
                price: 299.99,
            });
        });

        it('should create a cart item from a booking with relative URL', () => {
            const booking: Booking = {
                uuid: 'tour-456',
                tourTitle: 'Mountain Trek',
                amount: '450.00',
                mainImage: '/media/mountain.jpg',
                tourType: '5',
                tripStartDate: '2024-02-20',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.mainImage).toBe(
                'https://api.gostans.com/api/v1/media/mountain.jpg',
            );
            expect(result.tourData.tourType).toBe(5);
            expect(result.price).toBe(450);
        });

        it('should handle booking with non-numeric tourType', () => {
            const booking: Booking = {
                uuid: 'tour-789',
                tourTitle: 'City Tour',
                amount: '99.99',
                mainImage: 'https://example.com/city.jpg',
                tourType: 'invalid',
                tripStartDate: '2024-03-10',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.tourType).toBe(0);
        });

        it('should handle booking with decimal amount', () => {
            const booking: Booking = {
                uuid: 'tour-decimal',
                tourTitle: 'Decimal Tour',
                amount: '123.456',
                mainImage: 'https://example.com/tour.jpg',
                tourType: '2',
                tripStartDate: '2024-04-01',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result.price).toBe(123.456);
        });

        it('should set addedAt to current timestamp', () => {
            const booking: Booking = {
                uuid: 'tour-time',
                tourTitle: 'Time Tour',
                amount: '100',
                mainImage: 'https://example.com/time.jpg',
                tourType: '1',
                tripStartDate: '2024-05-01',
            } as Booking;

            const beforeTime = Date.now();
            const result = createCartItemFromBooking(booking);
            const afterTime = Date.now();

            expect(result.addedAt).toBeGreaterThanOrEqual(beforeTime);
            expect(result.addedAt).toBeLessThanOrEqual(afterTime);
        });
    });

    describe('formatImageUrl', () => {
        it('should return placeholder for empty string', () => {
            const result = formatImageUrl('');
            expect(result).toBe('/api/placeholder/400/300');
        });

        it('should return placeholder for null/undefined', () => {
            expect(formatImageUrl(null as any)).toBe('/api/placeholder/400/300');
            expect(formatImageUrl(undefined as any)).toBe('/api/placeholder/400/300');
        });

        it('should return URL as-is if it starts with http://', () => {
            const url = 'http://example.com/image.jpg';
            const result = formatImageUrl(url);
            expect(result).toBe(url);
        });

        it('should return URL as-is if it starts with https://', () => {
            const url = 'https://example.com/image.jpg';
            const result = formatImageUrl(url);
            expect(result).toBe(url);
        });

        it('should prepend base URL for absolute path starting with /', () => {
            const result = formatImageUrl('/media/image.jpg');
            expect(result).toBe('https://api.gostans.com/media/image.jpg');
        });

        it('should prepend base URL and /media/ for relative path', () => {
            const result = formatImageUrl('image.jpg');
            expect(result).toBe('https://api.gostans.com/media/image.jpg');
        });

        it('should handle paths with special characters', () => {
            const result = formatImageUrl('my-tour_123.jpg');
            expect(result).toBe('https://api.gostans.com/media/my-tour_123.jpg');
        });

        it('should handle paths with spaces', () => {
            const result = formatImageUrl('my tour.jpg');
            expect(result).toBe('https://api.gostans.com/media/my tour.jpg');
        });
    });

    describe('cleanCartData', () => {
        it('should return empty array for non-array input', () => {
            expect(cleanCartData(null as any)).toEqual([]);
            expect(cleanCartData(undefined as any)).toEqual([]);
            expect(cleanCartData({} as any)).toEqual([]);
            expect(cleanCartData('string' as any)).toEqual([]);
        });

        it('should filter out items with missing required fields', () => {
            const invalidItems: any[] = [
                // Missing tourId
                {
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Tour 1',
                    },
                    quantity: 1,
                },
                // Missing tourData
                {
                    tourId: 'tour-2',
                    quantity: 1,
                },
                // Missing tourData.uuid
                {
                    tourId: 'tour-3',
                    tourData: {
                        title: 'Tour 3',
                    },
                    quantity: 1,
                },
                // Missing tourData.title
                {
                    tourId: 'tour-4',
                    tourData: {
                        uuid: 'tour-4',
                    },
                    quantity: 1,
                },
                // Zero quantity
                {
                    tourId: 'tour-5',
                    tourData: {
                        uuid: 'tour-5',
                        title: 'Tour 5',
                    },
                    quantity: 0,
                },
            ];

            const result = cleanCartData(invalidItems);
            expect(result).toEqual([]);
        });

        it('should keep valid items', () => {
            const validItem: CartItem = {
                tourId: 'tour-valid',
                tourData: {
                    uuid: 'tour-valid',
                    title: 'Valid Tour',
                    price: '100',
                    mainImage: 'image.jpg',
                    duration: '2 days',
                    about: 'Great tour',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 2,
                adults: 2,
                addedAt: Date.now(),
            };

            const result = cleanCartData([validItem]);
            expect(result).toEqual([validItem]);
        });

        it('should remove duplicate items based on tourId', () => {
            const item1: CartItem = {
                tourId: 'tour-duplicate',
                tourData: {
                    uuid: 'tour-duplicate',
                    title: 'First Instance',
                    price: '100',
                    mainImage: 'image1.jpg',
                    duration: '2 days',
                    about: 'Tour',
                    tourType: 1,
                    shortDescription: 'Desc',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const item2: CartItem = {
                ...item1,
                tourData: { ...item1.tourData, title: 'Second Instance' },
                quantity: 2,
            };

            const result = cleanCartData([item1, item2]);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(item1);
        });

        it('should handle mixed valid and invalid items', () => {
            const validItem: CartItem = {
                tourId: 'tour-valid',
                tourData: {
                    uuid: 'tour-valid',
                    title: 'Valid Tour',
                    price: '100',
                    mainImage: 'image.jpg',
                    duration: '2 days',
                    about: 'Great tour',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const invalidItem: any = {
                tourId: 'tour-invalid',
                quantity: 1,
            };

            const result = cleanCartData([validItem, invalidItem]);
            expect(result).toEqual([validItem]);
        });

        it('should filter out null and undefined items', () => {
            const validItem: CartItem = {
                tourId: 'tour-valid',
                tourData: {
                    uuid: 'tour-valid',
                    title: 'Valid Tour',
                    price: '100',
                    mainImage: 'image.jpg',
                    duration: '2 days',
                    about: 'Great tour',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            const result = cleanCartData([validItem, null as any, undefined as any]);
            expect(result).toEqual([validItem]);
        });

        it('should handle empty array', () => {
            const result = cleanCartData([]);
            expect(result).toEqual([]);
        });

        it('should preserve all valid items when no duplicates', () => {
            const items: CartItem[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Tour 1',
                        price: '100',
                        mainImage: 'image1.jpg',
                        duration: '2 days',
                        about: 'Tour 1',
                        tourType: 1,
                        shortDescription: 'Desc 1',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
                {
                    tourId: 'tour-2',
                    tourData: {
                        uuid: 'tour-2',
                        title: 'Tour 2',
                        price: '200',
                        mainImage: 'image2.jpg',
                        duration: '3 days',
                        about: 'Tour 2',
                        tourType: 2,
                        shortDescription: 'Desc 2',
                    },
                    quantity: 2,
                    adults: 2,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(items);
            expect(result).toHaveLength(2);
            expect(result).toEqual(items);
        });
    });

    describe('mapApiToCartItem', () => {
        it('should map API cart item to internal cart item format', () => {
            const apiItem: ApiCartItem = {
                id: 1,
                tour: {
                    uuid: 'api-tour-1',
                    title: 'API Tour',
                    price: '350.00',
                    mainImage: '/media/api-tour.jpg',
                    tourType: 2,
                    durationDays: 4,
                    shortDescription: 'Great API tour',
                },
                quantity: 3,
                addedAt: '2024-01-15T10:30:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result).toEqual({
                tourId: 'api-tour-1',
                tourData: {
                    uuid: 'api-tour-1',
                    title: 'API Tour',
                    price: '350.00',
                    mainImage: '/media/api-tour.jpg',
                    duration: '4 days',
                    about: 'Great API tour',
                    tourType: 2,
                    shortDescription: 'Great API tour',
                },
                quantity: 3,
                addedAt: new Date('2024-01-15T10:30:00Z').getTime(),
                adults: 1,
                price: 350.0,
                duration: '4 days',
            });
        });

        it('should handle API item with null durationDays', () => {
            const apiItem: ApiCartItem = {
                id: 2,
                tour: {
                    uuid: 'api-tour-2',
                    title: 'Flexible Tour',
                    price: '150.00',
                    mainImage: 'https://example.com/flexible.jpg',
                    tourType: 1,
                    durationDays: null,
                    shortDescription: 'Flexible duration',
                },
                quantity: 1,
                addedAt: '2024-02-20T14:45:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle API item with missing mainImage', () => {
            const apiItem: ApiCartItem = {
                id: 3,
                tour: {
                    uuid: 'api-tour-3',
                    title: 'No Image Tour',
                    price: '200.00',
                    mainImage: '',
                    tourType: 1,
                    durationDays: 2,
                    shortDescription: 'No image',
                },
                quantity: 1,
                addedAt: '2024-03-10T09:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should parse price as float correctly', () => {
            const apiItem: ApiCartItem = {
                id: 4,
                tour: {
                    uuid: 'api-tour-4',
                    title: 'Price Test Tour',
                    price: '99.99',
                    mainImage: 'image.jpg',
                    tourType: 1,
                    durationDays: 1,
                    shortDescription: 'Price test',
                },
                quantity: 1,
                addedAt: '2024-04-01T12:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.price).toBe(99.99);
            expect(typeof result.price).toBe('number');
        });

        it('should convert ISO date string to timestamp', () => {
            const isoDate = '2024-05-15T10:30:45.123Z';
            const apiItem: ApiCartItem = {
                id: 5,
                tour: {
                    uuid: 'api-tour-5',
                    title: 'Date Test Tour',
                    price: '100.00',
                    mainImage: 'image.jpg',
                    tourType: 1,
                    durationDays: 1,
                    shortDescription: 'Date test',
                },
                quantity: 1,
                addedAt: isoDate,
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.addedAt).toBe(new Date(isoDate).getTime());
            expect(typeof result.addedAt).toBe('number');
        });
    });

    describe('mapCartItemResponseToCartItem', () => {
        it('should map cart item response to internal cart item format', () => {
            const apiItem: CartItemResponse = {
                id: 10,
                tour: {
                    uuid: 'response-tour-1',
                    title: 'Response Tour',
                    price: '450.00',
                    mainImage: 'response-tour.jpg',
                    tourType: 3,
                    durationDays: 5,
                    shortDescription: 'Great response tour',
                },
                quantity: 2,
                addedAt: '2024-06-01T08:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result).toEqual({
                tourId: 'response-tour-1',
                tourData: {
                    uuid: 'response-tour-1',
                    title: 'Response Tour',
                    price: '450.00',
                    mainImage: expect.stringContaining('response-tour.jpg'),
                    duration: '5 days',
                    about: 'Great response tour',
                    tourType: 3,
                    shortDescription: 'Great response tour',
                },
                quantity: 2,
                addedAt: new Date('2024-06-01T08:00:00Z').getTime(),
                adults: 1,
                price: 450.0,
                duration: '5 days',
            });
        });

        it('should format image URL correctly', () => {
            const apiItem: CartItemResponse = {
                id: 11,
                tour: {
                    uuid: 'response-tour-2',
                    title: 'Image URL Tour',
                    price: '200.00',
                    mainImage: 'tour-image.jpg',
                    tourType: 1,
                    durationDays: 2,
                    shortDescription: 'Image URL test',
                },
                quantity: 1,
                addedAt: '2024-07-01T10:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe(
                'https://api.gostans.com/media/tour-image.jpg',
            );
        });

        it('should handle null durationDays', () => {
            const apiItem: CartItemResponse = {
                id: 12,
                tour: {
                    uuid: 'response-tour-3',
                    title: 'Multi-day Tour',
                    price: '300.00',
                    mainImage: 'https://example.com/multi.jpg',
                    tourType: 2,
                    durationDays: null,
                    shortDescription: 'Multi-day adventure',
                },
                quantity: 1,
                addedAt: '2024-08-01T12:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle large quantities', () => {
            const apiItem: CartItemResponse = {
                id: 13,
                tour: {
                    uuid: 'response-tour-4',
                    title: 'Bulk Tour',
                    price: '50.00',
                    mainImage: 'https://example.com/bulk.jpg',
                    tourType: 1,
                    durationDays: 1,
                    shortDescription: 'Bulk booking',
                },
                quantity: 100,
                addedAt: '2024-09-01T14:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.quantity).toBe(100);
        });

        it('should preserve all tour data fields', () => {
            const apiItem: CartItemResponse = {
                id: 14,
                tour: {
                    uuid: 'response-tour-5',
                    title: 'Complete Tour',
                    price: '175.50',
                    mainImage: '/media/complete.jpg',
                    tourType: 2,
                    durationDays: 3,
                    shortDescription: 'Complete tour with all fields',
                },
                quantity: 1,
                addedAt: '2024-10-01T16:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData).toHaveProperty('uuid');
            expect(result.tourData).toHaveProperty('title');
            expect(result.tourData).toHaveProperty('price');
            expect(result.tourData).toHaveProperty('mainImage');
            expect(result.tourData).toHaveProperty('duration');
            expect(result.tourData).toHaveProperty('about');
            expect(result.tourData).toHaveProperty('tourType');
            expect(result.tourData).toHaveProperty('shortDescription');
        });
    });
});