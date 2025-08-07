import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useValidation } from '@/hooks/utils/useValidation';
import securitySvg from '@/assets/cards/security.svg';
import masterCard from '@/assets/cards/mastercard.svg';
import visaCard from '@/assets/cards/visa.svg';
import paypalIcon from '@/assets/cards/paypal.svg';
import GuestForm from '@/components/Payment/GuestForm';
import { BillingInfo, CardInfo } from '@/services/api/checkout/types';

type PaymentStepUIProps = {
    isProcessing: boolean;
    error: string;
    success: string;
    paymentCreated: any;
    onPayPalClick: () => Promise<void>;
    onCardClick: (cardInfo: CardInfo, billingInfo: BillingInfo, saveCard: boolean) => Promise<void>;
    onBack: () => void;
    total: number;
};

const PaymentContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    position: relative;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    width: 100%;
`;

const SectionTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    text-align: left;
`;

const TimerContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.md};
    width: auto;
    text-align: right;
`;

const TimerText = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    white-space: nowrap;
`;

const TimerValue = styled.div<{ $isUrgent: boolean }>`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $isUrgent }) => ($isUrgent ? '#dc3545' : '#007bff')};
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
`;

const PayNowButtonWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    margin-left: ${({ theme }) => theme.spacing.md};
`;

const CardNumberInput = styled.div`
    position: relative;

    .card-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        pointer-events: none;

        img {
            height: 24px;
            width: auto;
            border-radius: 2px;
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

const SecurityBadge = styled.div`
    img {
        height: 24px;
        width: auto;
        opacity: 0.8;
    }
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
`;

const SaveCardSection = styled.div`
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e5e5;
`;

const SaveCardCheckbox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input[type='checkbox'] {
        width: 16px;
        height: 16px;
        accent-color: #007bff;
    }

    label {
        font-size: 14px;
        color: #666;
        cursor: pointer;
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
    const { cardDetails, errors, handleCardDetailsChange, detectCardType, validateAllFields } = useValidation('card');
    const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'card' | 'visa' | null>(null);
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [showSuccessTimer, setShowSuccessTimer] = useState(0);
    const [isPaymentInitializing, setIsPaymentInitializing] = useState(false);
    const [guestFormValidation, setGuestFormValidation] = useState<(() => boolean) | null>(null);
    const [validationError, setValidationError] = useState<string>('');
    const [saveCard, setSaveCard] = useState(false);
    const [guestFormData, setGuestFormData] = useState<any>(null);

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
        setSelectedMethod(method);

        if (method === 'paypal' && !paymentCreated) {
            setIsPaymentInitializing(true);
            await onPayPalClick();
            setIsPaymentInitializing(false);
            setShowSuccessTimer(10);
        }
    };

    const handlePayNow = () => {
        if (!selectedMethod) return;

        if (guestFormValidation && !guestFormValidation()) {
            setValidationError('Please fill in all required billing details');
            return;
        }

        setValidationError('');

        if (selectedMethod === 'card') {
            const isValid = validateAllFields();
            if (!isValid) {
                return;
            }
        }

        setValidationError('');

        switch (selectedMethod) {
            case 'paypal':
                onPayPalClick();
                break;
            case 'card':
                const cardInfo: CardInfo = {
                    number: cardDetails.cardNumber.replace(/\s/g, ''),
                    exp_month: cardDetails.expiry.split('/')[0],
                    exp_year: `20${cardDetails.expiry.split('/')[1]}`,
                    cvv: cardDetails.cvv,
                    type: detectCardType(cardDetails.cardNumber),
                };
                onCardClick(cardInfo, guestFormData?.billingInfo, saveCard);
                break;
        }
    };

    const handleLeadGuestSubmit = (guestData: any) => {
        setGuestFormData(guestData);
        console.log('Billing data submitted:', guestData);
    };

    const handleGuestFormValidationReady = useCallback((validateFn: () => boolean) => {
        setGuestFormValidation(() => validateFn);
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
                        disabled={isProcessing || isPaymentInitializing}
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
                        disabled={isProcessing || isPaymentInitializing}
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
                            <div
                                style={{
                                    padding: '2rem',
                                    borderTop: '1px solid #e5e5e5',
                                }}
                            >
                                <CardNumberInput>
                                    <Input
                                        label="Card number"
                                        placeholder="0000-0000-0000-0000"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
                                        error={errors.cardNumber}
                                        inputConfig={{ variant: 'outlined', size: 'md' }}
                                    />
                                    {detectCardType(cardDetails.cardNumber) !== 'unknown' && (
                                        <div className="card-icon">
                                            {detectCardType(cardDetails.cardNumber) === 'visa' && (
                                                <img src={visaCard} alt="Visa" />
                                            )}
                                            {detectCardType(cardDetails.cardNumber) === 'mastercard' && (
                                                <img src={masterCard} alt="Mastercard" />
                                            )}
                                        </div>
                                    )}
                                </CardNumberInput>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <Input
                                        label="Expiry"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiry}
                                        onChange={(e) => handleCardDetailsChange('expiry', e.target.value)}
                                        error={errors.expiry}
                                        inputConfig={{ variant: 'outlined', size: 'md' }}
                                    />
                                    <Input
                                        label="CVV"
                                        placeholder="123"
                                        value={cardDetails.cvv}
                                        onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
                                        error={errors.cvv}
                                        inputConfig={{ variant: 'outlined', size: 'md' }}
                                    />
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <Input
                                        label="Name on card"
                                        placeholder="Full name"
                                        value={cardDetails.nameOnCard}
                                        onChange={(e) => handleCardDetailsChange('nameOnCard', e.target.value)}
                                        error={errors.nameOnCard}
                                        inputConfig={{ variant: 'outlined', size: 'md' }}
                                    />
                                </div>

                                <SecuritySection>
                                    <SecurityText>
                                        Your card details are secured using 2048-bit SSL encryption.
                                    </SecurityText>
                                    <SecurityBadge>
                                        <img src={securitySvg} alt="SafeKey" />
                                    </SecurityBadge>
                                </SecuritySection>

                                <SaveCardSection>
                                    <SaveCardCheckbox>
                                        <input
                                            type="checkbox"
                                            id="saveCard"
                                            checked={saveCard}
                                            onChange={(e) => setSaveCard(e.target.checked)}
                                        />
                                        <label htmlFor="saveCard">Save card details for future payments</label>
                                    </SaveCardCheckbox>
                                </SaveCardSection>
                            </div>
                        )}
                    </PaymentOption>
                </PaymentButtonsContainer>
            )}

            <ButtonsContainer>
                <Button variant="outline" onClick={onBack} disabled={isProcessing} size="lg">
                    Back
                </Button>

                <PayNowButtonWrapper>
                    <Button
                        variant="primary"
                        onClick={handlePayNow}
                        disabled={isProcessing || !selectedMethod || isPaymentInitializing}
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
            </ButtonsContainer>
        </PaymentContainer>
    );
}
