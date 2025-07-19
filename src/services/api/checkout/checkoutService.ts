import { useRecoilState } from 'recoil';
import { ApiResponse } from '@/types/common/fetch';
import { useMemo, useRef } from 'react';
import { useFetch } from '@/hooks/api/useFetch';
import { activeBookingsAtom, bookingCacheAtom } from '@/atoms/booking';
import {
    BookingDetails,
    BookingListResponse,
    BookingValidationError,
    CardPaymentRequest,
    CardPaymentResponse,
    PaymentCreateRequest,
    PaymentCreateResponse,
    PaymentExecuteRequest,
    PaymentExecuteResponse,
} from '@/services/api/checkout/types';

export const BOOKING_CACHE_DURATION = 10 * 60 * 1000;

/**
 * Booking Fetch Service - For PayPal Payment and Booking Operations
 * @module useBookingFetchService
 * @description This module provides functions for booking and payment operations
 */
export const useCheckoutService = () => {
    const { execute: fetchData } = useFetch();
    const [bookingCache, setBookingCache] = useRecoilState(bookingCacheAtom);
    const [activeBookings, setActiveBookings] = useRecoilState(activeBookingsAtom);

    const activeRequests = useRef<Map<string, Promise<any>>>(new Map());

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        const currentTime = Date.now();
        return currentTime - lastFetch < BOOKING_CACHE_DURATION;
    };

    const updateBookingsCache = (bookings: BookingDetails[]): void => {
        const now = Date.now();
        setActiveBookings(bookings);
        setBookingCache({ loaded: true, lastFetch: now });
        console.log('Bookings cache updated successfully');
    };

    return useMemo(
        () => ({
            /**
             * Create PayPal payment for tour booking
             * @param paymentData - Payment creation data
             * @returns Promise with payment creation response
             */
            createPayment: async (paymentData: PaymentCreateRequest): Promise<ApiResponse<PaymentCreateResponse>> => {
                try {
                    console.log('Creating PayPal payment:', paymentData);
                    const accessToken = localStorage.getItem('access_token');

                    const response = await fetchData({
                        url: '/user/payments/create/',
                        method: 'POST',
                        data: {
                            amount: paymentData.amount,
                            currency: paymentData.currency || 'USD',
                            tour_uuid: paymentData.tour_uuid,
                            participants: paymentData.participants,
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log('Payment created successfully:', response.data);

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: response.message || 'Payment created successfully',
                    };
                } catch (error: any) {
                    console.error('Payment creation failed:', error);

                    if (error.response?.status === 400) {
                        const validationErrors: BookingValidationError = error.response?.data?.data || {};
                        const errorMessages = Object.entries(validationErrors)
                            .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                            .join('; ');

                        return {
                            data: null as any,
                            statusCode: 400,
                            message: errorMessages || error.message || 'Validation failed',
                        };
                    }

                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to create payment',
                    };
                }
            },

            /**
             * Execute PayPal payment after user approval
             * @param executeData - Payment execution data
             * @returns Promise with payment execution response url
             */
            executePayment: async (
                executeData: PaymentExecuteRequest,
            ): Promise<ApiResponse<PaymentExecuteResponse>> => {
                const requestKey = `execute-${executeData.payment_id}-${executeData.payer_id}`;

                if (activeRequests.current.has(requestKey)) {
                    console.log('Returning existing payment execution request');
                    return activeRequests.current.get(requestKey);
                }

                const requestPromise = (async () => {
                    try {
                        const accessToken = localStorage.getItem('access_token');

                        const response = await fetchData({
                            url: '/user/payments/execute/',
                            method: 'POST',
                            data: {
                                payment_id: executeData.payment_id,
                                payer_id: executeData.payer_id,
                            },
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        setBookingCache({ loaded: false, lastFetch: null });

                        return {
                            data: response.data,
                            statusCode: 200,
                            message: response.message || 'Payment completed successfully',
                        };
                    } catch (error: any) {
                        throw error;
                    } finally {
                        activeRequests.current.delete(requestKey);
                    }
                })();

                activeRequests.current.set(requestKey, requestPromise);
                return requestPromise;
            },

            /**
             * Create card payment for tour booking
             * @param paymentData - Card payment creation data
             * @returns Promise with card payment response
             */
            createVisaPayment: async (paymentData: CardPaymentRequest): Promise<ApiResponse<CardPaymentResponse>> => {
                try {
                    console.log('Creating card payment:', paymentData);
                    const accessToken = localStorage.getItem('access_token');

                    const response = await fetchData({
                        url: '/user/payments/card/',
                        method: 'POST',
                        data: paymentData,
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log('Card payment created successfully:', response.data);

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: response.message || 'Payment completed successfully',
                    };
                } catch (error: any) {
                    console.error('Card payment creation failed:', error);

                    if (error.response?.status === 400) {
                        const validationErrors: BookingValidationError = error.response?.data?.data || {};
                        const errorMessages = Object.entries(validationErrors)
                            .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
                            .join('; ');

                        return {
                            data: null as any,
                            statusCode: 400,
                            message: errorMessages || error.message || 'Validation failed',
                        };
                    }

                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to process card payment',
                    };
                }
            },

            /**
             * Get user's booking history
             * @param page - Page number for pagination
             * @param pageSize - Number of items per page
             * @returns Promise with booking list response
             */
            getUserBookings: async (
                page: number = 1,
                pageSize: number = 10,
            ): Promise<ApiResponse<BookingListResponse>> => {
                /* we first check cache for first page */
                if (
                    page === 1 &&
                    bookingCache.loaded &&
                    isCacheValid(bookingCache.lastFetch) &&
                    activeBookings.length > 0
                ) {
                    console.log('Using cached bookings');
                    return {
                        data: {
                            results: activeBookings,
                            count: activeBookings.length,
                        },
                        statusCode: 200,
                        message: 'success',
                    };
                }

                try {
                    const response = await fetchData({
                        url: `/bookings/?page=${page}&page_size=${pageSize}`,
                        method: 'GET',
                    });

                    if (page === 1) {
                        updateBookingsCache(response.data.results);
                    }

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: 'success',
                    };
                } catch (error: any) {
                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to fetch bookings',
                    };
                }
            },

            /**
             * Get specific booking details
             * @param bookingId - Booking ID
             * @returns Promise with booking details
             */
            getBookingDetails: async (bookingId: string): Promise<ApiResponse<BookingDetails>> => {
                try {
                    const response = await fetchData({
                        url: `/bookings/${bookingId}/`,
                        method: 'GET',
                    });

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: 'success',
                    };
                } catch (error: any) {
                    return {
                        data: null as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to fetch booking details',
                    };
                }
            },

            /**
             * Cancel a booking
             * @param bookingId - Booking ID to cancel
             * @returns Promise with cancellation response
             */
            cancelBooking: async (bookingId: string): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: `/bookings/${bookingId}/cancel/`,
                        method: 'POST',
                    });

                    setBookingCache({ loaded: false, lastFetch: null });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Booking cancelled successfully',
                    };
                } catch (error: any) {
                    return {
                        data: undefined as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to cancel booking',
                    };
                }
            },

            /**
             * Request refund for a booking
             * @param bookingId - Booking ID to refund
             * @param reason - Refund reason
             * @returns Promise with refund response
             */
            requestRefund: async (bookingId: string, reason?: string): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: `/bookings/${bookingId}/refund/`,
                        method: 'POST',
                        data: { reason },
                    });

                    setBookingCache({ loaded: false, lastFetch: null });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Refund requested successfully',
                    };
                } catch (error: any) {
                    return {
                        data: undefined as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to request refund',
                    };
                }
            },

            /**
             * Send booking confirmation email
             * @param bookingId - Booking ID
             * @returns Promise with email response
             */
            sendConfirmationEmail: async (bookingId: string): Promise<ApiResponse<void>> => {
                try {
                    await fetchData({
                        url: `/bookings/${bookingId}/send-confirmation/`,
                        method: 'POST',
                    });

                    return {
                        data: undefined as any,
                        statusCode: 200,
                        message: 'Confirmation email sent successfully',
                    };
                } catch (error: any) {
                    console.error('Failed to send confirmation email:', error);
                    return {
                        data: undefined as any,
                        statusCode: error.response?.status || 500,
                        message: error.message || 'Failed to send confirmation email',
                    };
                }
            },

            /**
             * Clear bookings cache
             */
            clearCache: () => {
                setActiveBookings([]);
                setBookingCache({ loaded: false, lastFetch: null });
                console.log('Bookings cache cleared');
            },

            /**
             * Force refresh bookings
             */
            forceRefresh: async () => {
                setBookingCache({ loaded: false, lastFetch: null });
                console.log('Bookings force refresh triggered');
            },

            activeBookings,
            bookingCache,
        }),
        [fetchData, activeBookings, bookingCache, setActiveBookings, setBookingCache],
    );
};
