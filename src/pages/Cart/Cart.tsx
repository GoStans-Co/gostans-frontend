import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@/components/Common/Card';
import Button from '@/components/Common/Button';
import EnterInfoStep from '@/components/Cart/EnterInfoStep';
import PaymentStep from '@/components/Cart/PaymentStep';
import { BookingFormData } from '@/types/cart';
import { StepsWrapper } from '@/components/Steps';
import TripCard from '@/components/Card/TripCard';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.lightBackground || '#f8f9fa'};
`;

const CartGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const CartItemsSection = styled.div`
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

const SidebarContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const SummarySection = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
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

const EmptyCart = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 600px;
    margin: 0 auto;

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 1rem;
    }

    p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: ${({ theme }) => theme.colors.lightText};
    }
`;

const ConfirmationContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const OrderTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
    text-align: left;
    align-self: flex-start;
    width: 100%;
`;

export default function CartPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const getCurrentStep = (): CheckoutStep => {
        const path = location.pathname;
        if (path.includes('/cart/checkout/payment')) return 'payment';
        if (path.includes('/cart/checkout/confirmation')) return 'confirmation';
        if (path.includes('/cart/checkout')) return 'checkout';
        return 'cart';
    };

    const [currentStep, setCurrentStep] = useState<CheckoutStep>(getCurrentStep());

    useEffect(() => {
        setCurrentStep(getCurrentStep());
    }, [location.pathname]);

    const [cartItems, setCartItems] = useRecoilState(cartAtom);

    const [formData, setFormData] = useState<BookingFormData>({
        participants: [],
        cardDetails: undefined,
        paymentMethod: undefined,
    });

    const removeItem = (tourId: string) => {
        setCartItems((prev) => prev.filter((item) => item.tourId !== tourId));
    };

    const handleCheckout = () => {
        navigate('/cart/checkout');
    };

    const handleInfoNext = (data: Partial<BookingFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        navigate('/cart/checkout/payment');
    };

    const handleInfoBack = () => {
        navigate('/cart');
    };

    const handlePaymentComplete = (data: Partial<BookingFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        /* here i should process the payment flow */
        navigate('/cart/checkout/confirmation');
    };

    const handlePaymentBack = () => {
        navigate('/cart/checkout');
    };

    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.tourData.price) * item.quantity, 0);
    const tax = subtotal * 0.1; /* 10% tax rate */
    const total = subtotal + tax;

    if (cartItems.length === 0 && currentStep === 'cart') {
        return (
            <Container>
                <EmptyCart>
                    <h2>No items in your cart</h2>
                    <p>Start exploring and add some amazing experiences!</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Continue Discovering
                    </Button>
                </EmptyCart>
            </Container>
        );
    }

    switch (currentStep) {
        case 'checkout':
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <EnterInfoStep
                        cartItems={cartItems}
                        formData={formData}
                        onNext={handleInfoNext}
                        onBack={handleInfoBack}
                    />
                </Container>
            );

        case 'payment':
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <PaymentStep
                        cartItems={cartItems}
                        formData={formData}
                        onComplete={handlePaymentComplete}
                        onBack={handlePaymentBack}
                    />
                </Container>
            );

        case 'confirmation':
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} showConfirmation={true} />
                    <ConfirmationContainer>
                        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>
                            ✓ Booking Confirmed!
                        </h1>
                        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
                            Thank you for your booking. You will receive a confirmation email shortly.
                        </p>
                        <div
                            style={{
                                marginBottom: '2rem',
                                textAlign: 'left',
                                background: '#f8f9fa',
                                padding: '1.5rem',
                                borderRadius: '8px',
                            }}
                        >
                            <OrderTitle>Order Summary</OrderTitle>
                            {cartItems.map((item) => (
                                <div key={item.tourId} style={{ marginBottom: '0.5rem' }}>
                                    {item.tourData.title} x{item.quantity} - $
                                    {(parseFloat(item.tourData.price) * item.quantity).toFixed(2)}
                                </div>
                            ))}
                            <div
                                style={{
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #e5e7eb',
                                    fontWeight: 'bold',
                                }}
                            >
                                Total: ${total.toFixed(2)}
                            </div>
                        </div>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Return to Home
                        </Button>
                    </ConfirmationContainer>
                </Container>
            );

        /* cart step */
        default:
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <CartGrid>
                        <CartItemsSection>
                            {cartItems.map((item) => (
                                <TripCard
                                    key={item.tourId}
                                    id={item.tourId}
                                    image={item.tourData.mainImage || '/api/placeholder/100/100'}
                                    title={item.tourData.title}
                                    subtitle={item.tourData.shortDescription}
                                    date={item.selectedDate || 'Date not specified'}
                                    variant="default"
                                    customContent={
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: '#666' }}>
                                                {item.tourData.duration} • {item.adults} adults
                                            </span>
                                        </div>
                                    }
                                    actions={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                width: '100%',
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <Button variant="text" size="sm">
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    size="sm"
                                                    onClick={() => removeItem(item.tourId)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ color: '#666' }}>Qty: {item.quantity}</span>
                                                <span
                                                    style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0F2846' }}
                                                >
                                                    ${(parseFloat(item.tourData.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                />
                            ))}
                        </CartItemsSection>

                        <SidebarCard>
                            <SidebarContent>
                                <h3
                                    style={{
                                        margin: '0 0 1rem 0',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        alignSelf: 'flex-start',
                                        display: 'flex',
                                    }}
                                >
                                    Order Summary
                                </h3>
                                <SummarySection>
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </SummarySection>
                                <SummarySection>
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </SummarySection>
                                <TotalSection>
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </TotalSection>
                                <Button variant="primary" fullWidth onClick={handleCheckout}>
                                    Proceed to Checkout
                                </Button>
                                {/* <Button variant="outline" fullWidth onClick={() => navigate('/')}>
                                    Continue Shopping
                                </Button> */}
                            </SidebarContent>
                        </SidebarCard>
                    </CartGrid>
                </Container>
            );
    }
}
