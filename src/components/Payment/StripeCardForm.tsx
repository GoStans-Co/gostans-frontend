import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import styled from 'styled-components';

export type BillingInfo = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};

export type StripeCardFormRef = {
    handleSubmit: () => Promise<void>;
    isProcessing: boolean;
};

type StripeCardFormProps = {
    clientSecret: string;
    billingInfo: BillingInfo;
    onSuccess: (paymentIntent: any) => void;
    onError: (error: string) => void;
    onCardReady?: (isReady: boolean) => void;
};

const CardElementContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    border: 0.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: 1rem 0;
`;

/**
 * Stripe Card Form - Organism Component
 * @description A form component for collecting and processing credit card information using Stripe.
 * @param {string} clientSecret - The client secret for the payment intent.
 * @param {BillingInfo} billingInfo - The billing information for the payment.
 * @param {function} onSuccess - Callback function to be called on successful payment.
 * @param {function} onError - Callback function to be called on payment error.
 * @param {function} onCardReady - Callback function to be called when the card element is ready.
 */
export default forwardRef<StripeCardFormRef, StripeCardFormProps>(function StripeCardForm(
    { clientSecret, billingInfo, onSuccess, onError, onCardReady },
    ref,
) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (stripe && elements && clientSecret) {
            onCardReady?.(true);
        }
    }, [stripe, elements, clientSecret, onCardReady]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            onError('Payment system not ready. Please refresh and try again.');
            return;
        }

        setIsProcessing(true);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                onError('Card information not found. Please refresh and try again.');
                return;
            }

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: billingInfo
                        ? {
                              name: `${billingInfo.firstName} ${billingInfo.lastName}`,
                              email: billingInfo.email,
                              phone: billingInfo.phone,
                              address: {
                                  line1: billingInfo.address || '',
                                  city: billingInfo.city || '',
                                  state: billingInfo.state || '',
                                  postal_code: billingInfo.postalCode || '',
                                  country: billingInfo.country || 'US',
                              },
                          }
                        : undefined,
                },
            });

            if (error) {
                const errorMessage =
                    error.type === 'card_error'
                        ? 'Card payment failed. Please check your card details and try again.'
                        : 'Payment could not be processed. Please try again.';
                onError(errorMessage);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            onError('An unexpected error occurred. Please try again.');
            console.error('Payment error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            await handleSubmit();
        },
        isProcessing,
    }));

    return (
        <div>
            <CardElementContainer>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                        },
                    }}
                    onReady={() => {
                        onCardReady?.(true);
                    }}
                    onChange={(event) => {
                        if (event.complete && onCardReady && !event.error) {
                            onCardReady(true);
                        } else if (!event.complete && onCardReady) {
                            onCardReady(false);
                        }
                    }}
                />
            </CardElementContainer>
        </div>
    );
});
