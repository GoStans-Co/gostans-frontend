import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { message } from 'antd';
import { Booking } from '@/services/api/user';
import { cartAtom } from '@/atoms/cart';
import { createCartItemFromBooking } from '@/utils/general/cartItemHandling';

export const useTripActions = (bookings: { all: Booking[] }) => {
    const navigate = useNavigate();
    const setCart = useSetRecoilState(cartAtom);

    const handlePayment = async (tripId: string) => {
        const booking = bookings?.all.find((b) => `booking-${b.id}` === tripId);

        if (!booking) {
            message.error('Booking not found');
            return;
        }

        const cartItem = createCartItemFromBooking(booking);

        setCart((prev) => {
            const existingIndex = prev.findIndex((item) => item.tourId === booking.uuid);
            if (existingIndex >= 0) {
                message.info('This trip is already in your cart');
                return prev;
            }
            return [...prev, cartItem];
        });

        message.success('Trip added to cart');
        navigate('/cart');
    };

    const handleCancel = async (tripId: string) => {
        console.info('Cancel trip:', tripId);
        message.info('This feature will be added soon!');
    };

    const handleDelete = async (tripId: string) => {
        // TODO: later i should implement actual delete logic
        // when i get the endpoint for this
        console.info('Delete trip:', tripId);
        message.info('This feature will be added soon!');
    };

    const handleBookAgain = async (tripId: string) => {
        // TODO: for this logic as well, i will implement later
        console.info('Rebook trip:', tripId);
        message.info('This feature will be added soon!');
    };

    return {
        handlePayment,
        handleCancel,
        handleDelete,
        handleBookAgain,
    };
};
