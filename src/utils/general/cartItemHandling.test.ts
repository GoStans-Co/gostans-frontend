import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createCartItemFromBooking,
    formatImageUrl,
    cleanCartData,
    mapApiToCartItem,
    mapCartItemResponseToCartItem,
} from './cartItemHandling';
import { Booking } from '@/services/api/user';
import { ApiCartItem, CartItem, CartItemResponse } from '@/services/api/cart';

describe('cartItemHandling', () => {
    beforeEach(() => {
        // Reset environment variables
        vi.stubEnv('VITE_API_URL', 'https://api.gostans.com/api/v1');
        vi.stubEnv('REACT_APP_API_BASE_URL', 'https://api.gostans.com');
    });

    describe('createCartItemFromBooking', () => {
        it('should create a cart item from a booking with absolute URL image', () => {
            const booking: Booking = {
                uuid: 'tour-123',
                tourTitle: 'Amazing Tour',
                amount: '150.00',
                mainImage: 'https://example.com/image.jpg',
                tourType: '3',
                tripStartDate: '2024-06-15',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result).toEqual({
                tourId: 'tour-123',
                tourData: {
                    uuid: 'tour-123',
                    title: 'Amazing Tour',
                    price: '150.00',
                    mainImage: 'https://example.com/image.jpg',
                    duration: '3',
                    about: '',
                    tourType: 3,
                    shortDescription: '',
                },
                quantity: 1,
                selectedDate: '2024-06-15',
                adults: 1,
                addedAt: expect.any(Number),
                price: 150,
            });
        });

        it('should create a cart item with relative image path', () => {
            const booking: Booking = {
                uuid: 'tour-456',
                tourTitle: 'Beach Adventure',
                amount: '200.50',
                mainImage: '/media/tours/beach.jpg',
                tourType: '5',
                tripStartDate: '2024-07-20',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.mainImage).toBe('https://api.gostans.com/api/v1/media/tours/beach.jpg');
            expect(result.price).toBe(200.5);
        });

        it('should handle non-numeric tourType gracefully', () => {
            const booking: Booking = {
                uuid: 'tour-789',
                tourTitle: 'Mountain Trek',
                amount: '300.00',
                mainImage: 'https://example.com/mountain.jpg',
                tourType: 'invalid',
                tripStartDate: '2024-08-10',
            } as Booking;

            const result = createCartItemFromBooking(booking);

            expect(result.tourData.tourType).toBe(0);
        });

        it('should set addedAt to current timestamp', () => {
            const booking: Booking = {
                uuid: 'tour-999',
                tourTitle: 'City Tour',
                amount: '75.00',
                mainImage: 'https://example.com/city.jpg',
                tourType: '1',
                tripStartDate: '2024-05-01',
            } as Booking;

            const before = Date.now();
            const result = createCartItemFromBooking(booking);
            const after = Date.now();

            expect(result.addedAt).toBeGreaterThanOrEqual(before);
            expect(result.addedAt).toBeLessThanOrEqual(after);
        });
    });

    describe('formatImageUrl', () => {
        it('should return placeholder for empty string', () => {
            expect(formatImageUrl('')).toBe('/api/placeholder/400/300');
        });

        it('should return placeholder for null/undefined', () => {
            expect(formatImageUrl(null)).toBe('/api/placeholder/400/300');
            expect(formatImageUrl(undefined)).toBe('/api/placeholder/400/300');
        });

        it('should return absolute HTTP URLs as-is', () => {
            const url = 'http://example.com/image.jpg';
            expect(formatImageUrl(url)).toBe(url);
        });

        it('should return absolute HTTPS URLs as-is', () => {
            const url = 'https://example.com/image.jpg';
            expect(formatImageUrl(url)).toBe(url);
        });

        it('should prepend base URL to paths starting with /', () => {
            const result = formatImageUrl('/media/tours/image.jpg');
            expect(result).toBe('https://api.gostans.com/media/tours/image.jpg');
        });

        it('should handle relative paths without leading slash', () => {
            const result = formatImageUrl('tours/image.jpg');
            expect(result).toBe('https://api.gostans.com/media/tours/image.jpg');
        });

        it('should use environment variable when available', () => {
            vi.stubEnv('REACT_APP_API_BASE_URL', 'https://custom-api.com');
            const result = formatImageUrl('/image.jpg');
            expect(result).toBe('https://custom-api.com/image.jpg');
        });
    });

    describe('cleanCartData', () => {
        it('should return empty array for non-array input', () => {
            expect(cleanCartData(null)).toEqual([]);
            expect(cleanCartData(undefined)).toEqual([]);
            expect(cleanCartData({})).toEqual([]);
            expect(cleanCartData('string')).toEqual([]);
        });

        it('should filter out invalid items', () => {
            const cartData: unknown[] = [
                {
                    tourId: 'valid-1',
                    tourData: {
                        uuid: 'valid-1',
                        title: 'Valid Tour',
                        price: '100',
                    },
                    quantity: 1,
                },
                null,
                { tourId: 'invalid-no-tourdata' },
                {
                    tourId: 'valid-2',
                    tourData: {
                        uuid: 'valid-2',
                        title: 'Another Valid',
                        price: '200',
                    },
                    quantity: 2,
                },
            ];

            const result = cleanCartData(cartData);
            expect(result).toHaveLength(2);
            expect(result[0].tourId).toBe('valid-1');
            expect(result[1].tourId).toBe('valid-2');
        });

        it('should remove items with zero or negative quantity', () => {
            const cartData: CartItem[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Tour 1',
                        price: '100',
                        mainImage: 'img.jpg',
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
                    tourId: 'tour-2',
                    tourData: {
                        uuid: 'tour-2',
                        title: 'Tour 2',
                        price: '200',
                        mainImage: 'img2.jpg',
                        duration: '5 days',
                        about: 'About',
                        tourType: 2,
                        shortDescription: 'Short',
                    },
                    quantity: 0,
                    adults: 1,
                    addedAt: Date.now(),
                },
            ];

            const result = cleanCartData(cartData);
            expect(result).toHaveLength(1);
            expect(result[0].tourId).toBe('tour-1');
        });

        it('should remove duplicate items by tourId', () => {
            const cartData: CartItem[] = [
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Tour 1',
                        price: '100',
                        mainImage: 'img.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 1,
                    adults: 1,
                    addedAt: 1000,
                },
                {
                    tourId: 'tour-1',
                    tourData: {
                        uuid: 'tour-1',
                        title: 'Tour 1 Duplicate',
                        price: '150',
                        mainImage: 'img2.jpg',
                        duration: '3 days',
                        about: 'About',
                        tourType: 1,
                        shortDescription: 'Short',
                    },
                    quantity: 2,
                    adults: 2,
                    addedAt: 2000,
                },
            ];

            const result = cleanCartData(cartData);
            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBe(1); // Keeps first occurrence
        });

        it('should handle empty array', () => {
            expect(cleanCartData([])).toEqual([]);
        });

        it('should preserve valid items with all required fields', () => {
            const validItem: CartItem = {
                tourId: 'tour-123',
                tourData: {
                    uuid: 'tour-123',
                    title: 'Valid Tour',
                    price: '150.00',
                    mainImage: 'https://example.com/image.jpg',
                    duration: '3 days',
                    about: 'Tour description',
                    tourType: 1,
                    shortDescription: 'Short desc',
                },
                quantity: 2,
                adults: 2,
                addedAt: Date.now(),
                price: 150,
            };

            const result = cleanCartData([validItem]);
            expect(result).toEqual([validItem]);
        });
    });

    describe('mapApiToCartItem', () => {
        it('should map API cart item with all fields', () => {
            const apiItem: ApiCartItem = {
                id: 1,
                tour: {
                    uuid: 'tour-abc',
                    title: 'Wonderful Tour',
                    price: '250.00',
                    mainImage: 'https://example.com/tour.jpg',
                    tourType: 2,
                    durationDays: 5,
                    shortDescription: 'Amazing experience',
                },
                quantity: 3,
                addedAt: '2024-01-15T10:30:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result).toEqual({
                tourId: 'tour-abc',
                tourData: {
                    uuid: 'tour-abc',
                    title: 'Wonderful Tour',
                    price: '250.00',
                    mainImage: 'https://example.com/tour.jpg',
                    duration: '5 days',
                    about: 'Amazing experience',
                    tourType: 2,
                    shortDescription: 'Amazing experience',
                },
                quantity: 3,
                addedAt: new Date('2024-01-15T10:30:00Z').getTime(),
                adults: 1,
                price: 250,
                duration: '5 days',
            });
        });

        it('should handle null durationDays', () => {
            const apiItem: ApiCartItem = {
                id: 2,
                tour: {
                    uuid: 'tour-def',
                    title: 'Flexible Tour',
                    price: '100.00',
                    mainImage: 'img.jpg',
                    tourType: 1,
                    durationDays: null,
                    shortDescription: 'Flexible duration',
                },
                quantity: 1,
                addedAt: '2024-01-20T14:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should handle empty mainImage', () => {
            const apiItem: ApiCartItem = {
                id: 3,
                tour: {
                    uuid: 'tour-ghi',
                    title: 'No Image Tour',
                    price: '75.00',
                    mainImage: '',
                    tourType: 3,
                    durationDays: 2,
                    shortDescription: 'Tour without image',
                },
                quantity: 1,
                addedAt: '2024-02-01T09:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.tourData.mainImage).toBe('/api/placeholder/400/300');
        });

        it('should parse price correctly with decimals', () => {
            const apiItem: ApiCartItem = {
                id: 4,
                tour: {
                    uuid: 'tour-jkl',
                    title: 'Decimal Price Tour',
                    price: '199.99',
                    mainImage: 'img.jpg',
                    tourType: 1,
                    durationDays: 3,
                    shortDescription: 'Tour with decimal price',
                },
                quantity: 2,
                addedAt: '2024-02-10T12:00:00Z',
            };

            const result = mapApiToCartItem(apiItem);

            expect(result.price).toBe(199.99);
        });
    });

    describe('mapCartItemResponseToCartItem', () => {
        it('should map CartItemResponse to CartItem', () => {
            const response: CartItemResponse = {
                id: 10,
                tour: {
                    uuid: 'tour-xyz',
                    title: 'Response Tour',
                    price: '300.00',
                    mainImage: '/media/response.jpg',
                    tourType: 4,
                    durationDays: 7,
                    shortDescription: 'Mapped from response',
                },
                quantity: 4,
                addedAt: '2024-03-01T08:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(response);

            expect(result.tourId).toBe('tour-xyz');
            expect(result.quantity).toBe(4);
            expect(result.tourData.title).toBe('Response Tour');
            expect(result.tourData.duration).toBe('7 days');
            expect(result.duration).toBe('7 days');
            expect(result.adults).toBe(1);
            expect(result.price).toBe(300);
        });

        it('should format image URL for relative paths', () => {
            const response: CartItemResponse = {
                id: 11,
                tour: {
                    uuid: 'tour-mno',
                    title: 'Image Format Tour',
                    price: '125.00',
                    mainImage: '/uploads/tour-image.jpg',
                    tourType: 2,
                    durationDays: 4,
                    shortDescription: 'Testing image formatting',
                },
                quantity: 1,
                addedAt: '2024-03-15T10:30:00Z',
            };

            const result = mapCartItemResponseToCartItem(response);

            expect(result.tourData.mainImage).toBe('https://api.gostans.com/uploads/tour-image.jpg');
        });

        it('should handle null durationDays in response', () => {
            const response: CartItemResponse = {
                id: 12,
                tour: {
                    uuid: 'tour-pqr',
                    title: 'Flexible Response Tour',
                    price: '180.00',
                    mainImage: 'https://cdn.example.com/image.jpg',
                    tourType: 1,
                    durationDays: null,
                    shortDescription: 'No fixed duration',
                },
                quantity: 2,
                addedAt: '2024-04-01T14:00:00Z',
            };

            const result = mapCartItemResponseToCartItem(response);

            expect(result.tourData.duration).toBe('Multi-day');
            expect(result.duration).toBe('Multi-day');
        });

        it('should convert addedAt string to timestamp', () => {
            const dateString = '2024-05-10T16:45:30Z';
            const response: CartItemResponse = {
                id: 13,
                tour: {
                    uuid: 'tour-stu',
                    title: 'Timestamp Tour',
                    price: '95.00',
                    mainImage: 'img.jpg',
                    tourType: 3,
                    durationDays: 1,
                    shortDescription: 'Testing timestamp',
                },
                quantity: 1,
                addedAt: dateString,
            };

            const result = mapCartItemResponseToCartItem(response);

            expect(result.addedAt).toBe(new Date(dateString).getTime());
        });
    });
});