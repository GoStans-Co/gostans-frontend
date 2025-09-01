import { useApiServices } from '@/services/api';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const usePayPalReturn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkout } = useApiServices();

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
    }, [searchParams, navigate]);

    const handlePayPalReturn = async (paymentId: string, PayerID: string) => {
        try {
            const response = await checkout.executePayment({ paymentId, PayerID });

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
};
