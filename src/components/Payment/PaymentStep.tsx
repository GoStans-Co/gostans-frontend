import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import masterCard from '@/assets/cards/mastercard.svg';
import visaCard from '@/assets/cards/visa.svg';
import paypalIcon from '@/assets/cards/paypal.svg';
import GuestForm from '@/components/Payment/GuestForm';
import { StripePaymentResponse } from '@/services/api/checkout/types';
import stripePromise from '@/services/stripe';
import { Elements } from '@stripe/react-stripe-js';
import StripeCardForm, { BillingInfo, StripeCardFormRef } from '@/components/Payment/StripeCardForm';
import { useNavigate } from 'react-router-dom';

type ApiResponse<T> = {
    data: T;
    statusCode: number;
    message?: string;
    success: boolean;
};

type PaymentStepUIProps = {
    isProcessing: boolean;
    error: string;
    success: string;
    paymentCreated: any;
    onPayPalClick: () => Promise<void>;
    onCardClick: () => Promise<ApiResponse<StripePaymentResponse> | null>;
    onBack: () => void;
    total: number;
};

const PaymentContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    position: relative;

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        border-radius: ${({ theme }) => theme.borderRadius.md};
        margin: 0;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    width: 100%;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: column;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.xs};
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const SectionTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        text-align: center;
    }
`;

const TimerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    width: auto;
    text-align: right;

    ${({ theme }) => theme.responsive.mobile} {
        text-align: center;
        justify-content: space-between;
        width: 100%;
    }
`;

const TimerText = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    white-space: nowrap;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        white-space: normal;
        text-align: center;
    }
`;

const TimerValue = styled.div<{ $isUrgent: boolean }>`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $isUrgent }) => ($isUrgent ? '#dc3545' : '#007bff')};

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
    }
`;

const PaymentButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PaymentOption = styled.button<{ variant: 'paypal' | 'card' | 'visa'; selected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    border: 2px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.background};
    min-height: 60px;
    width: 100%;

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        min-height: 70px;
        border-radius: ${({ theme }) => theme.borderRadius.lg};
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }

    ${({ variant, theme, selected }) => {
        if (selected) return '';
        switch (variant) {
            case 'paypal':
                return `
                    &:hover {
                        border-color: #ffc439;
                        background-color: ${theme.colors.lightBackground};
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(255, 196, 57, 0.2);
                    }
                `;
            case 'card':
                return `
                    &:hover {
                        border-color: #6c757d;
                        background-color: ${theme.colors.lightBackground};
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(108, 117, 125, 0.2);
                    }
                `;
            case 'visa':
                return `
                    &:hover {
                        border-color: #1a1f71;
                        background-color: ${theme.colors.lightBackground};
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(26, 31, 113, 0.2);
                    }
                `;
        }
    }}

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const PaymentOptionContent = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const PaymentRadio = styled.div<{ selected?: boolean }>`
    width: 20px;
    height: 20px;
    border: 2px solid ${({ selected, theme }) => (selected ? '#007bff' : theme.colors.border)};
    border-radius: 50%;
    position: relative;

    ${({ selected }) =>
        selected &&
        `
        &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: #007bff;
            border-radius: 50%;
        }
    `}
`;

const PaymentLabel = styled.span`
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PaymentIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 24px;
    margin-left: auto;
    min-width: 80px;

    ${({ theme }) => theme.responsive.mobile} {
        min-width: 60px;

        img {
            max-height: 40px;
            width: auto;
        }
    }
`;

const LoadingMessage = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing.xl};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorMessage = styled.div`
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        text-align: center;
    }
`;

const SuccessMessage = styled.div`
    background-color: #efe;
    border: 1px solid #cfc;
    color: #3c3;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 110px;
    margin-top: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
        align-items: stretch;
        margin-top: ${({ theme }) => theme.spacing.lg};
    }
`;

const PayNowButtonWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    margin-left: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.mobile} {
        margin-left: 0;
        width: 100%;

        button {
            width: 100%;
            padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
            font-size: ${({ theme }) => theme.fontSizes.lg};
        }
    }
`;

const SecuritySection = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    text-align: center;
`;

const SecurityText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    text-align: left;
`;

const CardIconsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    img {
        height: 30px;
        width: auto;
        border-radius: 2px;
    }

    ${({ theme }) => theme.responsive.mobile} {
        gap: 2px;

        img {
            height: 24px;
        }
    }
`;

const InfoMessage = styled.div`
    background-color: #eef;
    border: 1px solid #ccf;
    color: #33c;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        text-align: left;
    }
`;

export default function PaymentStepUI({
    isProcessing,
    error,
    paymentCreated,
    onPayPalClick,
    onCardClick,
    onBack,
}: PaymentStepUIProps) {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'card' | null>(null);
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [showSuccessTimer, setShowSuccessTimer] = useState(0);
    const [isPaymentInitializing, setIsPaymentInitializing] = useState(false);
    const [guestFormValidation, setGuestFormValidation] = useState<(() => boolean) | null>(null);
    const [validationError, setValidationError] = useState<string>('');
    const [guestFormData, setGuestFormData] = useState<{ billingInfo: BillingInfo }>();
    const [isBillingValid, setIsBillingValid] = useState(false);
    const [clientSecret, setClientSecret] = useState<string>('');
    const [isCardReady, setIsCardReady] = useState(false);
    const stripeCardFormRef = useRef<StripeCardFormRef>(null);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (showSuccessTimer > 0) {
            const timer = setInterval(() => {
                setShowSuccessTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showSuccessTimer]);

    useEffect(() => {
        if (validationError && guestFormValidation?.()) {
            setValidationError('');
        }
    }, [guestFormValidation]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePaymentSelect = async (method: 'paypal' | 'card') => {
        try {
            setValidationError('');

            if (!isBillingValid || !guestFormData?.billingInfo) {
                setValidationError('Please complete all billing information first');
                return;
            }

            if (guestFormValidation && !guestFormValidation()) {
                setValidationError('Please correct all billing information errors');
                return;
            }

            setSelectedMethod(method);

            if (method === 'paypal' && !paymentCreated) {
                setIsPaymentInitializing(true);
                await onPayPalClick();
                setIsPaymentInitializing(false);
                setShowSuccessTimer(10);
            } else if (method === 'card' && !clientSecret) {
                if (!guestFormData?.billingInfo) {
                    setValidationError('Please complete billing information first');
                    return;
                }

                setIsPaymentInitializing(true);
                const response = await onCardClick();

                if (response?.data?.clientSecret) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setValidationError('Failed to initialize payment. Please try again.');
                }
                setIsPaymentInitializing(false);
            }
        } catch (error) {
            setIsPaymentInitializing(false);
            setValidationError('An error occurred. Please try again.');
            console.info('Payment selection error:', error);
        }
    };

    const handleStripeSuccess = (paymentIntent: any) => {
        navigate(`/cart/checkout/confirmation?payment_intent=${paymentIntent.id}`);
    };

    const handleLeadGuestSubmit = (guestData: any) => {
        setGuestFormData(guestData);

        const { billingInfo } = guestData;
        const isComplete = !!(
            billingInfo.firstName &&
            billingInfo.lastName &&
            billingInfo.email &&
            billingInfo.phone &&
            billingInfo.address &&
            billingInfo.city &&
            billingInfo.state &&
            billingInfo.postalCode &&
            billingInfo.country
        );

        setIsBillingValid(isComplete);
    };
    const handleGuestFormValidationReady = useCallback((validateFn: () => boolean, fieldsComplete: boolean) => {
        setGuestFormValidation(() => validateFn);
        setIsBillingValid(fieldsComplete);
    }, []);

    const isUrgent = timeLeft < 5 * 60;

    return (
        <PaymentContainer>
            <GuestForm onSubmit={handleLeadGuestSubmit} onValidationReady={handleGuestFormValidationReady} />
            <HeaderContainer>
                <SectionTitle>Select a Payment Method</SectionTitle>
                <TimerContainer>
                    <TimerText>Please secure your booking within</TimerText>
                    <TimerValue $isUrgent={isUrgent}>{formatTime(timeLeft)}</TimerValue>
                </TimerContainer>
            </HeaderContainer>
            {!isBillingValid && (
                <InfoMessage style={{ marginBottom: '1rem', color: '#666' }}>
                    Please complete all billing information fields before selecting a payment method
                </InfoMessage>
            )}

            {(error || validationError) && <ErrorMessage>{error || validationError}</ErrorMessage>}
            {showSuccessTimer > 0 && <SuccessMessage>Payment initialized successfully</SuccessMessage>}

            {isProcessing && (
                <LoadingMessage>{paymentCreated ? 'Processing payment...' : 'Initializing payment...'}</LoadingMessage>
            )}

            {!isProcessing && (
                <PaymentButtonsContainer>
                    <PaymentOption
                        variant="paypal"
                        onClick={() => handlePaymentSelect('paypal')}
                        disabled={isProcessing || isPaymentInitializing || !isBillingValid}
                    >
                        <PaymentOptionContent>
                            <PaymentRadio selected={selectedMethod === 'paypal'} />
                            <PaymentLabel>PayPal</PaymentLabel>
                        </PaymentOptionContent>
                        <PaymentIcon>
                            <img src={paypalIcon} alt="PayPal" style={{ height: '60px', width: 'auto' }} />
                        </PaymentIcon>
                    </PaymentOption>

                    <PaymentOption
                        variant="card"
                        selected={selectedMethod === 'card'}
                        onClick={() => handlePaymentSelect('card')}
                        disabled={isProcessing || isPaymentInitializing || !isBillingValid}
                        style={{
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            padding: selectedMethod === 'card' ? '0' : undefined,
                        }}
                    >
                        <div
                            style={{
                                padding: selectedMethod === 'card' ? '1.5rem' : '0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <PaymentOptionContent>
                                <PaymentRadio selected={selectedMethod === 'card'} />
                                <PaymentLabel>Debit or Credit Card</PaymentLabel>
                            </PaymentOptionContent>
                            <PaymentIcon>
                                <CardIconsContainer>
                                    <img src={visaCard} alt="Visa" />
                                    <img src={masterCard} alt="Mastercard" />
                                </CardIconsContainer>
                            </PaymentIcon>
                        </div>
                        {selectedMethod === 'card' && (
                            <div style={{ padding: '2rem', borderTop: '1px solid #e5e5e5' }}>
                                {!clientSecret ? (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <p>Initializing secure payment...</p>
                                    </div>
                                ) : guestFormData?.billingInfo ? (
                                    <Elements stripe={stripePromise}>
                                        <StripeCardForm
                                            ref={stripeCardFormRef}
                                            clientSecret={clientSecret}
                                            billingInfo={guestFormData.billingInfo}
                                            onSuccess={handleStripeSuccess}
                                            onError={(error) => setValidationError(error)}
                                            onCardReady={setIsCardReady}
                                        />
                                    </Elements>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                                        <p>Please complete billing information first</p>
                                    </div>
                                )}

                                <SecuritySection>
                                    <SecurityText>
                                        Your payment is secured by Stripe with PCI-compliant encryption.
                                    </SecurityText>
                                </SecuritySection>
                            </div>
                        )}
                    </PaymentOption>
                </PaymentButtonsContainer>
            )}

            <ButtonsContainer>
                <Button variant="outline" onClick={onBack} disabled={isProcessing} size="md">
                    Back
                </Button>
                {selectedMethod === 'paypal' && (
                    <PayNowButtonWrapper>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (paymentCreated?.approvalUrl) {
                                    window.location.href = paymentCreated.approvalUrl;
                                }
                            }}
                            disabled={isProcessing || !selectedMethod || isPaymentInitializing || !paymentCreated}
                            fullWidth
                            size="lg"
                            style={{
                                background: isPaymentInitializing ? '#ccc' : 'linear-gradient(90deg, #007bff, #0056b3)',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                padding: '16px 32px',
                                borderRadius: '12px',
                            }}
                        >
                            {isPaymentInitializing ? 'Initializing...' : '🔒 Confirm & Pay'}
                        </Button>
                    </PayNowButtonWrapper>
                )}
                {selectedMethod === 'card' && clientSecret && isCardReady && (
                    <PayNowButtonWrapper>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                if (stripeCardFormRef.current) {
                                    await stripeCardFormRef.current.handleSubmit();
                                }
                            }}
                            disabled={
                                isProcessing || stripeCardFormRef.current?.isProcessing || !isCardReady || !clientSecret
                            }
                            fullWidth
                            size="lg"
                            style={{
                                background: 'linear-gradient(90deg, #007bff, #0056b3)',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                padding: '16px 32px',
                                borderRadius: '12px',
                            }}
                        >
                            {stripeCardFormRef.current?.isProcessing ? 'Processing...' : '🔒 Pay Now'}
                        </Button>
                    </PayNowButtonWrapper>
                )}
            </ButtonsContainer>
        </PaymentContainer>
    );
}
