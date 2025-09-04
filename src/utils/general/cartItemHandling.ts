import { CartItem } from '@/services/api/cart';
import { Booking } from '@/services/api/user';

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
