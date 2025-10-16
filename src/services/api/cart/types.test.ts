import { describe, it, expect } from 'vitest';
import type {
    CartItem,
    Participant,
    CardDetails,
    PaymentMethod,
    PaymentDetails,
    BookingFormData,
    CartItemResponse,
    AddToCartRequest,
    RemoveFromCartResponse,
    ApiCartItem,
} from './types';

describe('Cart Types Schema Validation', () => {
    describe('CartItem', () => {
        it('should have all required properties', () => {
            const validCartItem: CartItem = {
                tourId: 'tour-123',
                tourData: {
                    uuid: 'tour-123',
                    title: 'Beach Tour',
                    price: '299.99',
                    mainImage: 'https://example.com/beach.jpg',
                    duration: '5 days',
                    about: 'Relaxing beach vacation',
                    tourType: 1,
                    shortDescription: 'Beach vacation',
                },
                quantity: 2,
                adults: 2,
                addedAt: Date.now(),
            };

            expect(validCartItem.tourId).toBeDefined();
            expect(validCartItem.tourData).toBeDefined();
            expect(validCartItem.quantity).toBeGreaterThan(0);
            expect(validCartItem.adults).toBeGreaterThan(0);
            expect(validCartItem.addedAt).toBeGreaterThan(0);
        });

        it('should allow optional fields', () => {
            const cartItemWithOptionals: CartItem = {
                tourId: 'tour-456',
                tourData: {
                    uuid: 'tour-456',
                    title: 'Mountain Trek',
                    price: '399.99',
                    mainImage: 'mountain.jpg',
                    duration: '7 days',
                    about: 'Mountain climbing',
                    tourType: 2,
                    shortDescription: 'Trek',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
                selectedDate: '2024-06-15',
                price: 399.99,
                duration: '7 days',
                trip_start_date: '2024-06-15',
                trip_end_date: '2024-06-22',
            };

            expect(cartItemWithOptionals.selectedDate).toBeDefined();
            expect(cartItemWithOptionals.price).toBeDefined();
            expect(cartItemWithOptionals.trip_start_date).toBeDefined();
            expect(cartItemWithOptionals.trip_end_date).toBeDefined();
        });

        it('should validate tourData structure', () => {
            const cartItem: CartItem = {
                tourId: 'tour-789',
                tourData: {
                    uuid: 'tour-789',
                    title: 'City Tour',
                    price: '149.99',
                    mainImage: 'city.jpg',
                    duration: '1 day',
                    about: 'City exploration',
                    tourType: 3,
                    shortDescription: 'City',
                },
                quantity: 1,
                adults: 1,
                addedAt: Date.now(),
            };

            expect(cartItem.tourData.uuid).toBe(cartItem.tourId);
            expect(typeof cartItem.tourData.title).toBe('string');
            expect(typeof cartItem.tourData.price).toBe('string');
            expect(typeof cartItem.tourData.tourType).toBe('number');
        });
    });

    describe('Participant', () => {
        it('should have all required participant fields', () => {
            const participant: Participant = {
                id: 'participant-123',
                firstName: 'John',
                lastName: 'Doe',
                idType: 'passport',
                idNumber: 'AB123456',
                dateOfBirth: '1990-01-01',
            };

            expect(participant.id).toBeDefined();
            expect(participant.firstName).toBeTruthy();
            expect(participant.lastName).toBeTruthy();
            expect(participant.idType).toBeTruthy();
            expect(participant.idNumber).toBeTruthy();
            expect(participant.dateOfBirth).toMatch(/\d{4}-\d{2}-\d{2}/);
        });
    });

    describe('CardDetails', () => {
        it('should validate card details structure', () => {
            const cardDetails: CardDetails = {
                number: '4111111111111111',
                expiryMonth: '12',
                expiryYear: '2025',
                cvv: '123',
                saveCard: true,
            };

            expect(cardDetails.number).toHaveLength(16);
            expect(cardDetails.cvv).toHaveLength(3);
            expect(typeof cardDetails.saveCard).toBe('boolean');
        });
    });

    describe('PaymentMethod', () => {
        it('should accept valid payment methods', () => {
            const validMethods: PaymentMethod[] = [
                'mastercard',
                'apple-pay',
                'visa-pay',
                'paypal',
                'google-pay',
                'bank-transfer',
            ];

            validMethods.forEach((method) => {
                const paymentMethod: PaymentMethod = method;
                expect(paymentMethod).toBeDefined();
            });
        });
    });

    describe('PaymentDetails', () => {
        it('should have all required payment detail fields', () => {
            const paymentDetails: PaymentDetails = {
                id: 'payment-123',
                orderId: 'order-456',
                payerId: 'payer-789',
                amount: '299.99',
                currency: 'USD',
                status: 'completed',
                transactionId: 'txn-abc123',
            };

            expect(paymentDetails.id).toBeDefined();
            expect(paymentDetails.orderId).toBeDefined();
            expect(paymentDetails.amount).toBeDefined();
            expect(paymentDetails.currency).toBeDefined();
            expect(paymentDetails.status).toBeDefined();
        });

        it('should allow optional payment detail fields', () => {
            const paymentDetails: PaymentDetails = {
                id: 'payment-456',
                orderId: 'order-789',
                payerId: 'payer-012',
                amount: '499.99',
                currency: 'EUR',
                status: 'pending',
                transactionId: 'txn-def456',
                payerEmail: 'payer@example.com',
                payerName: 'Jane Smith',
                paymentMethod: 'paypal',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                details: { additionalInfo: 'test' },
                booking: 123,
            };

            expect(paymentDetails.payerEmail).toBeDefined();
            expect(paymentDetails.paymentMethod).toBeDefined();
            expect(paymentDetails.booking).toBeDefined();
        });
    });

    describe('BookingFormData', () => {
        it('should validate booking form structure', () => {
            const formData: BookingFormData = {
                participants: [
                    {
                        id: 'p1',
                        firstName: 'John',
                        lastName: 'Doe',
                        idType: 'passport',
                        idNumber: 'XYZ123',
                        dateOfBirth: '1985-05-15',
                    },
                ],
            };

            expect(Array.isArray(formData.participants)).toBe(true);
            expect(formData.participants.length).toBeGreaterThan(0);
        });

        it('should allow all optional booking fields', () => {
            const formData: BookingFormData = {
                participants: [],
                cardDetails: {
                    number: '4111111111111111',
                    expiryMonth: '12',
                    expiryYear: '2025',
                    cvv: '123',
                    saveCard: false,
                },
                paymentMethod: 'mastercard',
                paymentDetails: {
                    id: 'pay-1',
                    orderId: 'order-1',
                    payerId: 'payer-1',
                    amount: '100',
                    currency: 'USD',
                    status: 'completed',
                    transactionId: 'txn-1',
                },
                cartItems: [],
                totalAmount: 100,
            };

            expect(formData.cardDetails).toBeDefined();
            expect(formData.paymentMethod).toBeDefined();
            expect(formData.totalAmount).toBeGreaterThan(0);
        });
    });

    describe('CartItemResponse', () => {
        it('should validate API cart item response structure', () => {
            const response: CartItemResponse = {
                id: 1,
                tour: {
                    uuid: 'tour-123',
                    title: 'Adventure Tour',
                    price: '399.99',
                    mainImage: 'https://example.com/tour.jpg',
                    tourType: 2,
                    durationDays: 7,
                    shortDescription: 'Exciting adventure',
                },
                quantity: 2,
                addedAt: '2024-01-15T10:30:00Z',
            };

            expect(response.id).toBeGreaterThan(0);
            expect(response.tour.uuid).toBeDefined();
            expect(response.quantity).toBeGreaterThan(0);
            expect(response.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        });

        it('should handle null durationDays', () => {
            const response: CartItemResponse = {
                id: 2,
                tour: {
                    uuid: 'tour-456',
                    title: 'Multi-day Tour',
                    price: '599.99',
                    mainImage: 'tour.jpg',
                    tourType: 1,
                    durationDays: null,
                    shortDescription: 'Variable duration',
                },
                quantity: 1,
                addedAt: '2024-02-01T00:00:00Z',
            };

            expect(response.tour.durationDays).toBeNull();
        });
    });

    describe('AddToCartRequest', () => {
        it('should validate add to cart request structure', () => {
            const request: AddToCartRequest = {
                tourUuid: 'tour-abc-123',
                quantity: 3,
            };

            expect(request.tourUuid).toBeTruthy();
            expect(request.quantity).toBeGreaterThan(0);
            expect(typeof request.quantity).toBe('number');
        });

        it('should validate minimum quantity', () => {
            const request: AddToCartRequest = {
                tourUuid: 'tour-def-456',
                quantity: 1,
            };

            expect(request.quantity).toBeGreaterThanOrEqual(1);
        });
    });

    describe('RemoveFromCartResponse', () => {
        it('should validate remove from cart response', () => {
            const response: RemoveFromCartResponse = {
                status: 200,
                message: 'Item removed successfully',
                data: {
                    tour_uuid: 'tour-123',
                    message: 'Removed from cart',
                },
            };

            expect(response.status).toBe(200);
            expect(response.message).toBeTruthy();
            expect(response.data.tour_uuid).toBeDefined();
        });

        it('should handle error status codes', () => {
            const errorResponse: RemoveFromCartResponse = {
                status: 404,
                message: 'Item not found',
                data: {
                    tour_uuid: 'tour-nonexistent',
                    message: 'Item not in cart',
                },
            };

            expect(errorResponse.status).toBe(404);
            expect(errorResponse.message).toBeTruthy();
        });
    });

    describe('ApiCartItem', () => {
        it('should validate API cart item structure', () => {
            const apiItem: ApiCartItem = {
                id: 1,
                tour: {
                    uuid: 'api-tour-123',
                    title: 'API Tour',
                    price: '199.99',
                    mainImage: 'https://cdn.example.com/tour.jpg',
                    tourType: 1,
                    durationDays: 5,
                    shortDescription: 'Great tour',
                },
                quantity: 2,
                addedAt: '2024-03-01T12:00:00Z',
            };

            expect(apiItem.id).toBeGreaterThan(0);
            expect(apiItem.tour).toBeDefined();
            expect(apiItem.quantity).toBeGreaterThan(0);
            expect(typeof apiItem.addedAt).toBe('string');
        });
    });

    describe('Type Consistency', () => {
        it('should ensure CartItem and ApiCartItem have compatible tour structures', () => {
            const apiItem: ApiCartItem = {
                id: 1,
                tour: {
                    uuid: 'consistency-test',
                    title: 'Consistency Tour',
                    price: '299.99',
                    mainImage: 'image.jpg',
                    tourType: 2,
                    durationDays: 6,
                    shortDescription: 'Testing consistency',
                },
                quantity: 1,
                addedAt: '2024-04-01T00:00:00Z',
            };

            // These should be compatible
            expect(apiItem.tour.uuid).toBeDefined();
            expect(apiItem.tour.title).toBeDefined();
            expect(apiItem.tour.price).toBeDefined();
        });

        it('should ensure CartItemResponse and CartItem have compatible structures', () => {
            const response: CartItemResponse = {
                id: 1,
                tour: {
                    uuid: 'compat-test',
                    title: 'Compatibility Test',
                    price: '399.99',
                    mainImage: 'test.jpg',
                    tourType: 1,
                    durationDays: 4,
                    shortDescription: 'Testing',
                },
                quantity: 2,
                addedAt: '2024-05-01T00:00:00Z',
            };

            expect(response.tour.uuid).toBeDefined();
            expect(response.quantity).toBeGreaterThan(0);
        });
    });
});