import { useBookingFetchService } from '@/services/api/useCheckoutService';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function usePayPalReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { executePayment } = useBookingFetchService();

    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        const PayerID = searchParams.get('PayerID');
        const token = searchParams.get('token');

        if (paymentId && PayerID) {
            handlePayPalReturn(paymentId, PayerID);
        } else if (token) {
            console.log('Payment cancelled');
            navigate('/cart/checkout/payment?error=cancelled');
        }
    }, [searchParams]);

    const handlePayPalReturn = async (payment_id: string, payer_id: string) => {
        try {
            const response = await executePayment({ payment_id, payer_id });

            if (response.statusCode === 200) {
                navigate('/cart/checkout/confirmation?success=true');
            } else {
                navigate(`/cart/checkout/payment?error=${encodeURIComponent(response.message)}`);
            }
        } catch (error: any) {
            console.error('Payment execution failed:', error);
            navigate(`/cart/checkout/payment?error=${encodeURIComponent(error.message)}`);
        }
    };
}
