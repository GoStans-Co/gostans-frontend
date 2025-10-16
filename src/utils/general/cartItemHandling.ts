import { ApiCartItem, CartItem, CartItemResponse } from '@/services/api/cart';
import { Booking } from '@/services/api/user';

/**
 * Creates a CartItem from a Booking object
 * @param {Booking} booking - Booking object from which to create the cart item
 * @returns {CartItem} Cart item formatted for the cart
 */
export const createCartItemFromBooking = (booking: Booking): CartItem => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.gostans.com/api/v1';

    return {
        tourId: booking.uuid,
        tourData: {
            uuid: booking.uuid,
            title: booking.tourTitle,
            price: booking.amount,
            mainImage: booking.mainImage.startsWith('http') ? booking.mainImage : `${baseUrl}${booking.mainImage}`,
            duration: booking.tourType,
            about: '',
            tourType: parseInt(booking.tourType) || 0,
            shortDescription: '',
        },
        quantity: 1,
        selectedDate: booking.tripStartDate,
        adults: 1,
        addedAt: Date.now(),
        price: parseFloat(booking.amount),
    };
};

/**
 * Formats image URL to ensure proper display
 * @param {string} imageUrl - Image URL from API
 * @returns {string} Properly formatted image URL
 */
export const formatImageUrl = (imageUrl: string): string => {
    if (!imageUrl) return '/api/placeholder/400/300';

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    if (imageUrl.startsWith('/')) {
        return `${process.env.REACT_APP_API_BASE_URL || 'https://api.gostans.com'}${imageUrl}`;
    }

    return `${process.env.REACT_APP_API_BASE_URL || 'https://api.gostans.com'}/media/${imageUrl}`;
};

/**
 * Cleans and validates cart data to prevent corruption
 * @param {CartItem[]} cartData - Cart data to clean
 * @returns {CartItem[]} Cleaned cart data
 */
export const cleanCartData = (cartData: CartItem[]): CartItem[] => {
    if (!Array.isArray(cartData)) return [];

    return cartData
        .filter((item) => {
            return (
                item &&
                typeof item === 'object' &&
                item.tourId &&
                item.tourData &&
                item.tourData.uuid &&
                item.tourData.title &&
                item.quantity > 0
            );
        })
        .filter((item, index, self) => index === self.findIndex((t) => t.tourId === item.tourId));
};

/**
 * Maps API cart item response to internal CartItem format
 * @param {ApiCartItem} apiItem - Cart item data from API response
 * @returns {CartItem} Mapped cart item in internal format
 */
export const mapApiToCartItem = (apiItem: ApiCartItem): CartItem => {
    return {
        tourId: apiItem.tour.uuid,
        tourData: {
            uuid: apiItem.tour.uuid,
            title: apiItem.tour.title,
            price: apiItem.tour.price,
            mainImage: apiItem.tour.mainImage || formatImageUrl('placeholder/400/300'),
            duration: apiItem.tour.durationDays ? `${apiItem.tour.durationDays} days` : 'Multi-day',
            about: apiItem.tour.shortDescription,
            tourType: apiItem.tour.tourType,
            shortDescription: apiItem.tour.shortDescription,
        },
        quantity: apiItem.quantity,
        addedAt: new Date(apiItem.addedAt).getTime(),
        adults: 1,
        price: parseFloat(apiItem.tour.price),
        duration: apiItem.tour.durationDays ? `${apiItem.tour.durationDays} days` : 'Multi-day',
    };
};

/**
 * Maps CartItemResponse (from addToCart) to internal CartItem format
 * @param {CartItemResponse} apiItem - Cart item response from addToCart API
 * @returns {CartItem} Mapped cart item in internal format
 */
export const mapCartItemResponseToCartItem = (apiItem: CartItemResponse): CartItem => {
    return {
        tourId: apiItem.tour.uuid,
        tourData: {
            uuid: apiItem.tour.uuid,
            title: apiItem.tour.title,
            price: apiItem.tour.price,
            mainImage: formatImageUrl(apiItem.tour.mainImage),
            duration: apiItem.tour.durationDays ? `${apiItem.tour.durationDays} days` : 'Multi-day',
            about: apiItem.tour.shortDescription,
            tourType: apiItem.tour.tourType,
            shortDescription: apiItem.tour.shortDescription,
        },
        quantity: apiItem.quantity,
        addedAt: new Date(apiItem.addedAt).getTime(),
        adults: 1,
        price: parseFloat(apiItem.tour.price),
        duration: apiItem.tour.durationDays ? `${apiItem.tour.durationDays} days` : 'Multi-day',
    };
};
