import { useRecoilState } from 'recoil';
import { ApiResponse } from '@/types/common/fetch';
import { useMemo, useRef } from 'react';
import { useFetch } from '@/hooks/api/useFetch';
import { activeBookingsAtom, bookingCacheAtom } from '@/atoms/booking';
import {
    BookingDetails,
    BookingListResponse,
    CardPaymentRequest,
    CardPaymentResponse,
    CheckoutPromise,
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

    const activeRequests = useRef<Map<string, Promise<CheckoutPromise>>>(new Map());

    const isCacheValid = (lastFetch: number | null): boolean => {
        if (!lastFetch) return false;
        const currentTime = Date.now();

        return currentTime - lastFetch < BOOKING_CACHE_DURATION;
    };

    const updateBookingsCache = (bookings: BookingDetails[]): void => {
        const now = Date.now();
        setActiveBookings(bookings);
        setBookingCache({ loaded: true, lastFetch: now });
    };

    return useMemo(
        () => ({
            /**
             * Create PayPal payment for tour booking
             * @param paymentData - Payment creation data
             * @returns Promise with payment creation response
             */
            createPayment: async (paymentData: CardPaymentRequest): Promise<ApiResponse<CardPaymentResponse>> => {
                const accessToken = localStorage.getItem('access_token');

                const responseData = {
                    amount: paymentData.amount,
                    currency: paymentData.currency || 'USD',
                    tour_uuid: paymentData.tour_uuid,
                    participants: paymentData.participants,
                    trip_start_date: paymentData.trip_start_date,
                    trip_end_date: paymentData.trip_end_date,
                };

                const response = await fetchData({
                    url: '/user/payments/create/',
                    method: 'POST',
                    data: responseData,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                return {
                    data: response.data,
                    statusCode: 200,
                    message: response.message || 'Payment created successfully',
                };
            },

            /**
             * Execute PayPal payment after user approval
             * @param executeData - Payment execution data
             * @returns Promise with payment execution response url
             */
            executePayment: async (
                executeData: PaymentExecuteRequest,
            ): Promise<ApiResponse<PaymentExecuteResponse>> => {
                const requestKey = `execute-${executeData.paymentId}-${executeData.PayerID}`;

                const existingPromise = activeRequests.current.get(requestKey);
                if (existingPromise) {
                    return (await existingPromise) as ApiResponse<PaymentExecuteResponse>;
                }

                const requestPromise = (async () => {
                    const accessToken = localStorage.getItem('access_token');

                    const response = await fetchData({
                        url: '/user/payments/execute/',
                        method: 'POST',
                        data: {
                            paymentId: executeData.paymentId,
                            PayerID: executeData.PayerID,
                        },
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    activeRequests.current.delete(requestKey);
                    setBookingCache({ loaded: false, lastFetch: null });

                    return {
                        data: response.data,
                        statusCode: 200,
                        message: response.message || 'Payment completed successfully',
                    };
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

                return {
                    data: response.data,
                    statusCode: 200,
                    message: response.message || 'Payment completed successfully',
                };
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
                    return {
                        data: {
                            results: activeBookings,
                            count: activeBookings.length,
                        },
                        statusCode: 200,
                        message: 'success',
                    };
                }

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
            },

            /**
             * Get specific booking details
             * @param bookingId - Booking ID
             * @returns Promise with booking details
             */
            getBookingDetails: async (bookingId: string): Promise<ApiResponse<BookingDetails>> => {
                const response = await fetchData({
                    url: `/bookings/${bookingId}/`,
                    method: 'GET',
                });

                return {
                    data: response.data,
                    statusCode: 200,
                    message: 'success',
                };
            },

            /**
             * Cancel a booking
             * @param bookingId - Booking ID to cancel
             * @returns Promise with cancellation response
             */
            cancelBooking: async (bookingId: string): Promise<ApiResponse<void>> => {
                await fetchData({
                    url: `/bookings/${bookingId}/cancel/`,
                    method: 'POST',
                });

                setBookingCache({ loaded: false, lastFetch: null });

                return {
                    data: undefined,
                    statusCode: 200,
                    message: 'Booking cancelled successfully',
                };
            },

            /**
             * Request refund for a booking
             * @param bookingId - Booking ID to refund
             * @param reason - Refund reason
             * @returns Promise with refund response
             */
            requestRefund: async (bookingId: string, reason?: string): Promise<ApiResponse<void>> => {
                await fetchData({
                    url: `/bookings/${bookingId}/refund/`,
                    method: 'POST',
                    data: { reason },
                });

                setBookingCache({ loaded: false, lastFetch: null });

                return {
                    data: undefined,
                    statusCode: 200,
                    message: 'Refund requested successfully',
                };
            },

            /**
             * Send booking confirmation email
             * @param bookingId - Booking ID
             * @returns Promise with email response
             */
            sendConfirmationEmail: async (bookingId: string): Promise<ApiResponse<void>> => {
                const response = await fetchData({
                    url: `/bookings/${bookingId}/send-confirmation/`,
                    method: 'POST',
                });

                return {
                    data: response.data,
                    statusCode: 200,
                    message: 'Confirmation email sent successfully',
                };
            },

            /**
             * Clear bookings cache
             */
            clearCache: () => {
                setActiveBookings([]);
                setBookingCache({ loaded: false, lastFetch: null });
            },

            /**
             * Force refresh bookings
             */
            forceRefresh: async () => {
                setBookingCache({ loaded: false, lastFetch: null });
            },

            activeBookings,
            bookingCache,
        }),
        [fetchData, activeBookings, bookingCache, setActiveBookings, setBookingCache],
    );
};
