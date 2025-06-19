import { useState } from 'react';
import styled from 'styled-components';
import Card from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { BookingFormData, CartItem } from '@/types/cart';

const StepContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const SidebarCard = styled(Card)`
    background-color: white;
    position: sticky;
    top: 2rem;
    height: fit-content;
`;

const PaymentMethodCard = styled(Card)`
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PaymentOptions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const PaymentOption = styled.label<{ selected: boolean }>`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.border)};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

const PaymentIcon = styled.div`
    width: 40px;
    height: 25px;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
`;

const CardDetailsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FormRow = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const CheckboxRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: space-between;
`;

const SidebarContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const OrderSummary = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const TotalSection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    padding: 1rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

type PaymentStepProps = {
    cartItems: CartItem[];
    formData: BookingFormData;
    onComplete: (data: Partial<BookingFormData>) => void;
    onBack: () => void;
};

export default function PaymentStep({ cartItems, formData, onComplete, onBack }: PaymentStepProps) {
    const [paymentMethod, setPaymentMethod] = useState<'mastercard' | 'apple-pay' | 'visa-pay'>(
        formData.paymentMethod || 'mastercard',
    );
    const [cardDetails, setCardDetails] = useState({
        number: formData.cardDetails?.number || '',
        expiryMonth: formData.cardDetails?.expiryMonth || '',
        expiryYear: formData.cardDetails?.expiryYear || '',
        cvv: formData.cardDetails?.cvv || '',
        saveCard: formData.cardDetails?.saveCard || false,
    });

    const handleCardDetailChange = (field: string, value: string | boolean) => {
        setCardDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleComplete = () => {
        const paymentData: Partial<BookingFormData> = {
            paymentMethod,
            ...(paymentMethod === 'mastercard' && { cardDetails }),
        };

        onComplete(paymentData);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const isCardPayment = paymentMethod === 'mastercard';

    const isFormValid =
        !isCardPayment || (cardDetails.number && cardDetails.expiryMonth && cardDetails.expiryYear && cardDetails.cvv);

    return (
        <StepContainer>
            <MainContent>
                {/* <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Payment Information</h2> */}

                <PaymentMethodCard>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                        Choose Payment Method
                    </h3>

                    <PaymentOptions>
                        <PaymentOption
                            selected={paymentMethod === 'mastercard'}
                            onClick={() => setPaymentMethod('mastercard')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'mastercard'}
                                onChange={() => setPaymentMethod('mastercard')}
                            />
                            <PaymentIcon>MC</PaymentIcon>
                            <span>Credit/Debit Card</span>
                        </PaymentOption>

                        <PaymentOption
                            selected={paymentMethod === 'apple-pay'}
                            onClick={() => setPaymentMethod('apple-pay')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'apple-pay'}
                                onChange={() => setPaymentMethod('apple-pay')}
                            />
                            <PaymentIcon>🍎</PaymentIcon>
                            <span>Apple Pay</span>
                        </PaymentOption>

                        <PaymentOption
                            selected={paymentMethod === 'visa-pay'}
                            onClick={() => setPaymentMethod('visa-pay')}
                        >
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'visa-pay'}
                                onChange={() => setPaymentMethod('visa-pay')}
                            />
                            <PaymentIcon>VISA</PaymentIcon>
                            <span>Visa Pay</span>
                        </PaymentOption>
                    </PaymentOptions>

                    {isCardPayment && (
                        <CardDetailsSection>
                            <Input
                                label="Card Number *"
                                value={cardDetails.number}
                                onChange={(e) => handleCardDetailChange('number', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                            />

                            <FormRow>
                                <Input
                                    label="Expiry Month *"
                                    value={cardDetails.expiryMonth}
                                    onChange={(e) => handleCardDetailChange('expiryMonth', e.target.value)}
                                    placeholder="MM"
                                    maxLength={2}
                                />
                                <Input
                                    label="Expiry Year *"
                                    value={cardDetails.expiryYear}
                                    onChange={(e) => handleCardDetailChange('expiryYear', e.target.value)}
                                    placeholder="YY"
                                    maxLength={2}
                                />
                                <Input
                                    label="CVV *"
                                    value={cardDetails.cvv}
                                    onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                                    placeholder="123"
                                    maxLength={4}
                                />
                            </FormRow>

                            <CheckboxRow>
                                <input
                                    type="checkbox"
                                    id="saveCard"
                                    checked={cardDetails.saveCard}
                                    onChange={(e) => handleCardDetailChange('saveCard', e.target.checked)}
                                />
                                <label htmlFor="saveCard">Save card for future payments</label>
                            </CheckboxRow>
                        </CardDetailsSection>
                    )}
                </PaymentMethodCard>

                <ButtonGroup>
                    <Button variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleComplete} disabled={!isFormValid}>
                        Complete Booking
                    </Button>
                </ButtonGroup>
            </MainContent>

            <SidebarCard>
                <SidebarContent>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Order Summary</h3>

                    <OrderSummary>
                        {cartItems.map((item) => (
                            <SummaryItem key={item.id}>
                                <span>
                                    {item.name} x{item.quantity}
                                </span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </SummaryItem>
                        ))}
                    </OrderSummary>

                    <TotalSection>
                        <span>Total:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </TotalSection>

                    <div
                        style={{
                            padding: '1rem',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            color: '#666',
                        }}
                    >
                        Your booking will be confirmed immediately after payment
                    </div>
                </SidebarContent>
            </SidebarCard>
        </StepContainer>
    );
}
