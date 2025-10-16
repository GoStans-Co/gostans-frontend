import { useApiServices } from '@/services/api';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    padding: ${({ theme }) => theme.spacing.xl};
`;

const ProcessingCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    text-align: center;
    max-width: 500px;
    width: 100%;
`;

const Title = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Message = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top: 4px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto ${({ theme }) => theme.spacing.lg} auto;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ErrorMessage = styled.div`
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessMessage = styled.div`
    background-color: #efe;
    border: 1px solid #cfc;
    color: #3c3;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export default function PaymentReturn() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkout } = useApiServices();
    const hasExecuted = useRef(false);

    const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'cancelled'>('processing');
    const [message, setMessage] = useState('Processing your payment...');

    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        const PayerID = searchParams.get('PayerID');
        const token = searchParams.get('token');

        if (paymentId && PayerID) {
            handlePaymentExecution(paymentId, PayerID);
        } else if (token) {
            setStatus('cancelled');
            setMessage('Payment was cancelled');
            setTimeout(() => {
                navigate('/cart/checkout/payment?error=cancelled');
            }, 3000);
        } else {
            setStatus('error');
            setMessage('Invalid payment parameters');
            setTimeout(() => {
                navigate('/cart/checkout/payment?error=invalid_params');
            }, 3000);
        }
    }, [searchParams, navigate]);

    const handlePaymentExecution = async (paymentId: string, PayerID: string) => {
        if (hasExecuted.current) {
            console.info('Payment execution already in progress or completed');
            return;
        }

        hasExecuted.current = true;

        try {
            setMessage('Confirming your payment with PayPal...');

            const response = await checkout.executePayment({ paymentId, PayerID });

            if (response.statusCode === 200) {
                setStatus('success');
                setMessage('Payment successful! Redirecting to confirmation...');

                setTimeout(() => {
                    navigate('/cart/checkout/confirmation?success=true');
                }, 2000);
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error('Payment execution failed:', error);
            setStatus('error');
            setMessage(error.message || 'Payment processing failed');
            hasExecuted.current = false;

            setTimeout(() => {
                navigate(`/cart/checkout/payment?error=${encodeURIComponent(error.message)}`);
            }, 5000);
        }
    };
    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <>
                        <LoadingSpinner />
                        <Message>{message}</Message>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            Please wait while we confirm your transaction with PayPal.
                        </div>
                    </>
                );

            case 'success':
                return (
                    <>
                        <SuccessMessage>
                            <strong>✓ Payment Successful!</strong>
                        </SuccessMessage>
                        <Message>{message}</Message>
                    </>
                );

            case 'error':
                return (
                    <>
                        <ErrorMessage>
                            <strong>✗ Payment Failed</strong>
                            <br />
                            {message}
                        </ErrorMessage>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            You will be redirected back to the payment page shortly.
                        </div>
                    </>
                );

            case 'cancelled':
                return (
                    <>
                        <ErrorMessage>
                            <strong>Payment Cancelled</strong>
                            <br />
                            {message}
                        </ErrorMessage>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                            You will be redirected back to the payment page shortly.
                        </div>
                    </>
                );
        }
    };

    return (
        <Container>
            <ProcessingCard>
                <Title>Payment Processing</Title>
                {renderContent()}
            </ProcessingCard>
        </Container>
    );
}
