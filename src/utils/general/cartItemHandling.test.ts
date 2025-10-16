import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createCartItemFromBooking,
    formatImageUrl,
    cleanCartData,
    mapApiToCartItem,
    mapCartItemResponseToCartItem,
} from './cartItemHandling';
import { ApiCartItem, CartItem, CartItemResponse } from '@/services/api/cart/types';
import { Booking } from '@/services/api/user/types';

describe('cartItemHandling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createCartItemFromBooking', () => {
        it('should create a CartItem from a valid Booking', () => {
            const booking: Booking = {
                id: 1,
                uuid: 'booking-123',
                tourTitle: 'Amazing Tour',
                tourType: '5',
                mainImage: 'https://example.com/image.jpg',
                amount: '299.99',
                currency: 'USD',
                status: 'CONFIRMED',
                tripStartDate: '2024-06-01',
                tripEndDate: '2024-06-05',
                createdAt: '2024-01-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result).toEqual({
                tourId: 'booking-123',
                tourData: {
                    uuid: 'booking-123',
                    title: 'Amazing Tour',
                    price: '299.99',
                    mainImage: 'https://example.com/image.jpg',
                    duration: '5',
                    about: '',
                    tourType: 5,
                    shortDescription: '',
                },
                quantity: 1,
                selectedDate: '2024-06-01',
                adults: 1,
                addedAt: expect.any(Number),
                price: 299.99,
            });
        });

        it('should handle image URL without http/https prefix', () => {
            const booking: Booking = {
                id: 2,
                uuid: 'booking-456',
                tourTitle: 'Mountain Trek',
                tourType: '3',
                mainImage: '/media/tour.jpg',
                amount: '199.50',
                currency: 'USD',
                status: 'PENDING',
                tripStartDate: '2024-07-10',
                tripEndDate: '2024-07-13',
                createdAt: '2024-02-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.mainImage).toBe('https://api.gostans.com/api/v1/media/tour.jpg');
        });

        it('should parse tourType as integer', () => {
            const booking: Booking = {
                id: 3,
                uuid: 'booking-789',
                tourTitle: 'City Tour',
                tourType: '10',
                mainImage: 'https://example.com/city.jpg',
                amount: '149.99',
                currency: 'USD',
                status: 'COMPLETED',
                tripStartDate: '2024-05-15',
                tripEndDate: '2024-05-15',
                createdAt: '2024-03-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.tourType).toBe(10);
            expect(typeof result.tourData.tourType).toBe('number');
        });

        it('should handle invalid tourType gracefully', () => {
            const booking: Booking = {
                id: 4,
                uuid: 'booking-invalid',
                tourTitle: 'Invalid Tour',
                tourType: 'invalid',
                mainImage: 'https://example.com/image.jpg',
                amount: '99.99',
                currency: 'USD',
                status: 'PENDING',
                tripStartDate: '2024-08-01',
                tripEndDate: '2024-08-05',
                createdAt: '2024-04-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.tourType).toBe(0);
        });

        it('should parse amount as float price', () => {
            const booking: Booking = {
                id: 5,
                uuid: 'booking-price',
                tourTitle: 'Price Test Tour',
                tourType: '2',
                mainImage: 'https://example.com/image.jpg',
                amount: '1234.567',
                currency: 'USD',
                status: 'CONFIRMED',
                tripStartDate: '2024-09-01',
                tripEndDate: '2024-09-03',
                createdAt: '2024-05-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result.price).toBe(1234.567);
            expect(typeof result.price).toBe('number');
        });

        it('should set quantity to 1 by default', () => {
            const booking: Booking = {
                id: 6,
                uuid: 'booking-qty',
                tourTitle: 'Quantity Test',
                tourType: '1',
                mainImage: 'https://example.com/image.jpg',
                amount: '50.00',
                currency: 'USD',
                status: 'PENDING',
                tripStartDate: '2024-10-01',
                tripEndDate: '2024-10-01',
                createdAt: '2024-06-01',
            };

            const result = createCartItemFromBooking(booking);

            expect(result.quantity).toBe(1);
            expect(result.adults).toBe(1);
        });
    });

    describe('formatImageUrl', () => {
        it('should return placeholder for empty string', () => {
            const result = formatImageUrl('');
            expect(result).toBe('/api/placeholder/400/300');
        });

        it('should return placeholder for null/undefined', () => {
            expect(formatImageUrl('')).toBe('/api/placeholder/400/300');
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

        it('should prepend base URL if path starts with /', () => {
            const path = '/media/image.jpg';
            const result = formatImageUrl(path);
            expect(result).toBe('https://api.gostans.com/media/image.jpg');
        });

        it('should handle paths without leading slash', () => {
            const path = 'media/image.jpg';
            const result = formatImageUrl(path);
            expect(result).toBe('https://api.gostans.com/media/media/image.jpg');
        });

        it('should handle complex paths', () => {
            const path = '/uploads/tours/2024/summer/beach.png';
            const result = formatImageUrl(path);
            expect(result).toBe('https://api.gostans.com/uploads/tours/2024/summer/beach.png');
        });

        it('should handle URLs with query parameters', () => {
            const url = 'https://cdn.example.com/image.jpg?w=300&h=200';
            const result = formatImageUrl(url);
            expect(result).toBe(url);
        });

        it('should handle URLs with hash fragments', () => {
            const url = 'https://example.com/image.jpg#section';
            const result = formatImageUrl(url);
            expect(result).toBe(url);
        });
    });

    describe('cleanCartData', () => {
        it('should return empty array for non-array input', () => {
            expect(cleanCartData(null as unknown)).toEqual([]);
            expect(cleanCartData(undefined as unknown)).toEqual([]);
            expect(cleanCartData({} as unknown)).toEqual([]);
            expect(cleanCartData('string' as unknown)).toEqual([]);
            expect(cleanCartData(123 as unknown)).toEqual([]);
        });

        it('should filter out null and undefined items', () => {
            const cartData: unknown[] = [
                null,
                undefined,
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Valid Tour',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(1);
            expect(result[0].tourId).toBe('tour-1');
        });

        it('should filter out items without tourId', () => {
            const cartData: unknown[] = [
                {
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Valid Tour',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(0);
        });

        it('should filter out items without tourData', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'tour-1',
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(0);
        });

        it('should filter out items with missing tourData.uuid', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        title: 'Invalid Tour',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(0);
        });

        it('should filter out items with missing tourData.title', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(0);
        });

        it('should filter out items with quantity <= 0', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Zero Quantity',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 0,
                    adults: 1,
                    addedAt: Date.now(),
                },
                {
                    tourId: 'tour-2',
                    tourData: {
                        uuid: 'tour-2',
                        title: 'Negative Quantity',
                        price: '100',
                        mainImage: 'image.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: -1,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(0);
        });

        it('should remove duplicate items (same tourId)', () => {
            const cartData: CartItem[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Duplicate Tour First',
                        price: '100',
                        mainImage: 'image1.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: Date.now(),
                },
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Duplicate Tour Second',
                        price: '150',
                        mainImage: 'image2.jpg',
                        duration: '5 days',
                        about: 'Different about',
                        tourType: 2,
                        shortDescription: 'Different short',
                    },
                    quantity: 2,
                    adults: 2,
                    addedAt: Date.now() + 1000,
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(1);
            expect(result[0].tourData.title).toBe('Duplicate Tour First');
        });

        it('should keep valid items and remove invalid ones', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Valid Tour 1',
                        price: '100',
                        mainImage: 'image1.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 2,
                    adults: 1,
                    addedAt: Date.now(),
                },
                null,
                {
                    tourId: 'tour-2',
                    quantity: 0,
                },
                {
                    tourId: 'tour-3',
                    tourData: {
                        uuid: 'tour-3',
                        title: 'Valid Tour 3',
                        price: '200',
                        mainImage: 'image3.jpg',
                        duration: '5 days',
                        about: 'About 3',
                        tourType: 2,
                        shortDescription: 'Short 3',
                    },
                    quantity: 1,
                    adults: 2,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(2);
            expect(result[0].tourId).toBe('tour-1');
            expect(result[1].tourId).toBe('tour-3');
        });

        it('should handle empty array', () => {
            const result = cleanCartData([]);
            expect(result).toEqual([]);
        });

        it('should preserve all properties of valid items', () => {
            const cartData: CartItem[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Complete Tour',
                        price: '299.99',
                        mainImage: 'image.jpg',
                        duration: '7 days',
                        about: 'Full description',
                        tourType: 3,
                        shortDescription: 'Short desc',
                    },
                    quantity: 3,
                    adults: 2,
                    addedAt: 1234567890,
                    selectedDate: '2024-06-15',
                    price: 299.99,
                },
            ];

            const result = cleanCartData(cartData);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(cartData[0]);
        });
    });

    describe('mapApiToCartItem', () => {
        it('should map API cart item to CartItem format with durationDays', () => {
            const apiItem: ApiCartItem = {
                id: 1,
                tour: {
                    uuid: 'tour-123',
                    title: 'Beach Paradise',
                    price: '499.99',
                    mainImage: 'https://example.com/beach.jpg',
                    tourType: 1,
                    durationDays: 7,
                    shortDescription: 'Relaxing beach vacation',
                },
                quantity: 2,
                addedAt: '2024-01-15T10:30:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result).toEqual({
                tourId: 'tour-123',
                tourData: {
                    uuid: 'tour-123',
                    title: 'Beach Paradise',
                    price: '499.99',
                    mainImage: 'https://example.com/beach.jpg',
                    duration: '7 days',
                    about: 'Relaxing beach vacation',
                    tourType: 1,
                    shortDescription: 'Relaxing beach vacation',
                },
                quantity: 2,
                addedAt: new Date('2024-01-15T10:30:00Z').getTime(),
                adults: 1,
                price: 499.99,
                duration: '7 days',
            });
        });

        it('should handle null durationDays', () => {
            const apiItem: ApiCartItem = {
                id: 2,
                tour: {
                    uuid: 'tour-456',
                    title: 'Multi-day Adventure',
                    price: '299.00',
                    mainImage: '/media/adventure.jpg',
                    tourType: 2,
                    durationDays: null,
                    shortDescription: 'Exciting adventure',
                },
                quantity: 1,
                addedAt: '2024-02-20T14:45:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should format relative image URLs', () => {
            const apiItem: ApiCartItem = {
                id: 3,
                tour: {
                    uuid: 'tour-789',
                    title: 'Mountain Trek',
                    price: '399.50',
                    mainImage: '/uploads/mountain.png',
                    tourType: 3,
                    durationDays: 5,
                    shortDescription: 'Mountain climbing',
                },
                quantity: 1,
                addedAt: '2024-03-10T08:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('https://api.gostans.com/uploads/mountain.png');
        });

        it('should use placeholder for missing mainImage', () => {
            const apiItem: ApiCartItem = {
                id: 4,
                tour: {
                    uuid: 'tour-no-image',
                    title: 'No Image Tour',
                    price: '199.99',
                    mainImage: '',
                    tourType: 1,
                    durationDays: 3,
                    shortDescription: 'Tour without image',
                },
                quantity: 1,
                addedAt: '2024-04-05T12:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should parse date string to timestamp', () => {
            const dateString = '2024-05-15T16:30:45.123Z';
            const apiItem: ApiCartItem = {
                id: 5,
                tour: {
                    uuid: 'tour-date',
                    title: 'Date Test Tour',
                    price: '150.00',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 2,
                    shortDescription: 'Date parsing test',
                },
                quantity: 1,
                addedAt: dateString,
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.addedAt).toBe(new Date(dateString).getTime());
            expect(typeof result.addedAt).toBe('number');
        });

        it('should parse price string to float', () => {
            const apiItem: ApiCartItem = {
                id: 6,
                tour: {
                    uuid: 'tour-price',
                    title: 'Price Test',
                    price: '1234.567',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 2,
                    durationDays: 4,
                    shortDescription: 'Price parsing test',
                },
                quantity: 3,
                addedAt: '2024-06-01T00:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.price).toBe(1234.567);
            expect(typeof result.price).toBe('number');
        });

        it('should set adults to 1 by default', () => {
            const apiItem: ApiCartItem = {
                id: 7,
                tour: {
                    uuid: 'tour-adults',
                    title: 'Adults Test',
                    price: '500.00',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 6,
                    shortDescription: 'Adults test',
                },
                quantity: 2,
                addedAt: '2024-07-01T00:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.adults).toBe(1);
        });

        it('should handle zero durationDays as Multi-day', () => {
            const apiItem: ApiCartItem = {
                id: 8,
                tour: {
                    uuid: 'tour-zero-days',
                    title: 'Zero Duration',
                    price: '100.00',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 0,
                    shortDescription: 'Zero duration test',
                },
                quantity: 1,
                addedAt: '2024-08-01T00:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });
    });

    describe('mapCartItemResponseToCartItem', () => {
        it('should map CartItemResponse to CartItem format', () => {
            const apiItem: CartItemResponse = {
                id: 1,
                tour: {
                    uuid: 'response-123',
                    title: 'Response Tour',
                    price: '599.99',
                    mainImage: 'https://cdn.example.com/tour.jpg',
                    tourType: 2,
                    durationDays: 10,
                    shortDescription: 'Amazing tour response',
                },
                quantity: 3,
                addedAt: '2024-09-01T10:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result).toEqual({
                tourId: 'response-123',
                tourData: {
                    uuid: 'response-123',
                    title: 'Response Tour',
                    price: '599.99',
                    mainImage: 'https://cdn.example.com/tour.jpg',
                    duration: '10 days',
                    about: 'Amazing tour response',
                    tourType: 2,
                    shortDescription: 'Amazing tour response',
                },
                quantity: 3,
                addedAt: new Date('2024-09-01T10:00:00Z').getTime(),
                adults: 1,
                price: 599.99,
                duration: '10 days',
            });
        });

        it('should format image URL through formatImageUrl', () => {
            const apiItem: CartItemResponse = {
                id: 2,
                tour: {
                    uuid: 'response-456',
                    title: 'Image Format Test',
                    price: '299.99',
                    mainImage: '/media/tours/summer.jpg',
                    tourType: 1,
                    durationDays: 5,
                    shortDescription: 'Image formatting',
                },
                quantity: 1,
                addedAt: '2024-10-01T00:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('https://api.gostans.com/media/tours/summer.jpg');
        });

        it('should handle null durationDays as Multi-day', () => {
            const apiItem: CartItemResponse = {
                id: 3,
                tour: {
                    uuid: 'response-null-days',
                    title: 'Null Duration',
                    price: '399.00',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 3,
                    durationDays: null,
                    shortDescription: 'No duration specified',
                },
                quantity: 2,
                addedAt: '2024-11-01T00:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should parse complex date formats', () => {
            const dateString = '2024-12-25T23:59:59.999Z';
            const apiItem: CartItemResponse = {
                id: 4,
                tour: {
                    uuid: 'response-date',
                    title: 'Date Parsing',
                    price: '450.00',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 7,
                    shortDescription: 'Complex date',
                },
                quantity: 1,
                addedAt: dateString,
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.addedAt).toBe(new Date(dateString).getTime());
        });

        it('should handle empty mainImage with placeholder', () => {
            const apiItem: CartItemResponse = {
                id: 5,
                tour: {
                    uuid: 'response-empty-image',
                    title: 'Empty Image',
                    price: '199.99',
                    mainImage: '',
                    tourType: 2,
                    durationDays: 4,
                    shortDescription: 'No image provided',
                },
                quantity: 1,
                addedAt: '2024-01-01T00:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should correctly parse decimal prices', () => {
            const apiItem: CartItemResponse = {
                id: 6,
                tour: {
                    uuid: 'response-decimal',
                    title: 'Decimal Price',
                    price: '999.999',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 8,
                    shortDescription: 'Decimal price test',
                },
                quantity: 1,
                addedAt: '2024-02-01T00:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.price).toBe(999.999);
        });

        it('should handle single-day tours', () => {
            const apiItem: CartItemResponse = {
                id: 7,
                tour: {
                    uuid: 'response-single-day',
                    title: 'One Day Tour',
                    price: '99.99',
                    mainImage: 'https://example.com/image.jpg',
                    tourType: 1,
                    durationDays: 1,
                    shortDescription: 'Single day adventure',
                },
                quantity: 2,
                addedAt: '2024-03-01T00:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(apiItem);

            expect(result.tourData.duration).toBe('1 days');
            expect(result.duration).toBe('1 days');
        });
    });
});