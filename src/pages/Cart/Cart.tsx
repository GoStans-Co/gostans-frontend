import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Button from '@/components/Common/Button';
import EnterInfoStep from '@/components/Cart/EnterInfoStep';
import { BookingFormData, PaymentDetails } from '@/types/cart';
import { StepsWrapper } from '@/components/Steps';
import TripCard from '@/components/Card/TripCard';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import { useBookingFetchService } from '@/services/api/useCheckoutService';
import OrderSummary from '@/components/Payment/OrderSummary';
import BookingConfirmation from '@/components/Payment/BookingConfirmation';
import PaymentReturnHandler from '@/components/Payment/PaymentReturnHandle';
import PaymentStep from '@/components/Payment/PaymentStep';
import { DatePicker } from 'antd';
import { AlertCircle } from 'lucide-react';

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem;
    min-height: 100vh;
    // overflow-x: hidden;
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

const PaymentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const CartItemsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const EmptyCart = styled.div`
    text-align: center;
    padding: 14rem 2rem;
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

const GuestSelectionCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const GuestSelectionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
    }
`;

const SectionTitle = styled.h4`
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.text};
`;

const GuestRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    &:last-child {
        margin-bottom: 0;
    }
`;

const GuestInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;

const GuestLabel = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GuestAgeRange = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const GuestControls = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const GuestCount = styled.span`
    min-width: 20px;
    text-align: center;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
`;

const ControlButton = styled(Button)`
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const FamilyPackageNotice = styled.div`
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    text-align: center;
`;

const LeftAlignedSection = styled.div`
    text-align: left;
`;

const DatePickerContainer = styled.div`
    text-align: left;
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

    const [searchParams] = useSearchParams();
    const { createPayment, executePayment } = useBookingFetchService();

    const [cartItems, setCartItems] = useRecoilState(cartAtom);
    const [currentStep, setCurrentStep] = useState<CheckoutStep>(getCurrentStep());
    const [formData, setFormData] = useState<BookingFormData>({
        participants: [],
        cardDetails: undefined,
        paymentMethod: undefined,
        paymentDetails: undefined,
    });
    const [paymentCreated, setPaymentCreated] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [guestCounts, setGuestCounts] = useState<{
        [itemId: string]: { adults: number; children: number; infants: number };
    }>({});
    const [isFamilyPackage, setIsFamilyPackage] = useState(false);

    const hasInitialized = useRef(false);

    useEffect(() => {
        const newStep = getCurrentStep();
        setCurrentStep(newStep);

        /* here we only handle payment return if we're on the payment step */
        if (newStep === 'payment') {
            const paymentId = searchParams.get('paymentId');
            const PayerID = searchParams.get('PayerID');
            const errorParam = searchParams.get('error');
            const successParam = searchParams.get('success');

            if (paymentId && PayerID) {
                handlePaymentReturn(paymentId, PayerID);
            } else if (errorParam) {
                setError(decodeURIComponent(errorParam));
            } else if (successParam === 'true') {
                setSuccess('Payment completed successfully!');
            }
        }
    }, [location.pathname, searchParams]);

    useEffect(() => {
        /* then we reset payment initialization when leaving payment step */
        if (currentStep !== 'payment') {
            hasInitialized.current = false;
            setPaymentCreated(null);
        }
    }, [currentStep]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const initializePayment = async () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        try {
            setError('');
            setIsProcessing(true);

            const mainTour = cartItems[0];
            const total = calculateTotal();

            const paymentRequest = {
                amount: Number(total.toFixed(2)),
                currency: 'USD',
                tour_uuid: mainTour.tourId,
                participants: formData.participants.map((participant: any) => ({
                    firstName: participant.firstName || participant.first_name,
                    lastName: participant.lastName || participant.last_name,
                    idType: participant.idType || participant.id_type || 'passport',
                    idNumber: participant.idNumber || participant.id_number,
                    dateOfBirth: participant.dateOfBirth || participant.date_of_birth,
                })),
            };

            const response = await createPayment(paymentRequest);

            if (response.statusCode === 200) {
                setPaymentCreated(response.data);
                console.log('Payment initialized:', response.data);
                setSuccess('Payment initialized successfully');
            } else {
                throw new Error(response.message);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to initialize payment');
            hasInitialized.current = false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentReturn = async (payment_id: string, payer_id: string) => {
        try {
            setIsProcessing(true);
            setError('');

            const calculatedTotal = calculateTotal();

            const executeResponse = await executePayment({ payment_id, payer_id });

            if (executeResponse.statusCode === 200) {
                const paymentDetails: PaymentDetails = {
                    orderId: executeResponse.data.id,
                    payerId: payer_id,
                    payerEmail: executeResponse.data.payer.payer_info?.email || '',
                    payerName:
                        `${executeResponse.data.payer.payer_info?.first_name || ''} ${executeResponse.data.payer.payer_info?.last_name || ''}`.trim(),
                    amount: calculatedTotal.toFixed(2),
                    currency: executeResponse.data.transactions?.[0]?.amount?.currency || 'USD',
                    status: executeResponse.data.state,
                    transactionId: executeResponse.data.id,
                };

                const cartItemsForConfirmation = [...cartItems];

                setFormData((prev) => ({
                    ...prev,
                    paymentDetails: paymentDetails,
                    paymentMethod: 'paypal',
                    cartItems: cartItemsForConfirmation,
                    totalAmount: calculatedTotal,
                }));

                setCartItems([]);
                navigate('/cart/checkout/confirmation');
            } else {
                throw new Error(executeResponse.message);
            }
        } catch (err: any) {
            setError(err.message || 'Payment execution failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePayPalPayment = async () => {
        if (!paymentCreated) {
            await initializePayment();
            return;
        }

        if (!paymentCreated?.approvalUrl) {
            setError('Payment not initialized. Please try again.');
            return;
        }
        window.location.href = paymentCreated.approvalUrl;
    };

    const handleCardPayment = () => {
        if (!paymentCreated?.approvalUrl) {
            setError('Payment not initialized. Please try again.');
            return;
        }
        window.location.href = paymentCreated.approvalUrl;
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => {
            if (isFamilyPackage && item.tourId === cartItems[0]?.tourId) {
                /* just for the family package, we just use the base price but apply guest-based pricing to total */
                const counts = guestCounts[item.tourId] || { adults: 1, children: 0, infants: 0 };
                const basePrice = parseFloat(item.tourData.price);
                const familyTotal = counts.adults * basePrice + counts.children * basePrice * 0.5;
                return sum + familyTotal * item.quantity;
            }
            return sum + calculateItemTotal(item) * item.quantity;
        }, 0);
        const tax = subtotal * 0.1;
        return subtotal + tax;
    };

    const removeItem = (tourId: string) => {
        setCartItems((prev) => prev.filter((item) => item.tourId !== tourId));
    };

    const handleCheckout = () => {
        navigate('/cart/checkout');
    };

    const handleInfoNext = (data: Partial<BookingFormData>) => {
        const totalGuests = cartItems.reduce((total, item) => {
            const counts = guestCounts[item.tourId] || { adults: 1, children: 0, infants: 0 };
            return total + counts.adults + counts.children;
        }, 0);

        setFormData((prev) => ({
            ...prev,
            ...data,
            totalGuests,
            guestCounts,
        }));
        navigate('/cart/checkout/payment');
    };

    const handleInfoBack = () => {
        navigate('/cart');
    };

    const handlePaymentBack = () => {
        setPaymentCreated(null);
        setError('');
        setSuccess('');
        hasInitialized.current = false;
        setIsProcessing(false);

        setCurrentStep('checkout');

        navigate('/cart/checkout');
    };

    const updateGuestCount = (itemId: string, type: 'adults' | 'children' | 'infants', change: number) => {
        setGuestCounts((prev) => {
            const current = prev[itemId] || { adults: 1, children: 0, infants: 0 };
            const newCount = Math.max(0, current[type] + change);

            if (isFamilyPackage && itemId === cartItems[0]?.tourId) {
                const totalPeople =
                    (type === 'adults' ? newCount : current.adults) +
                    (type === 'children' ? newCount : current.children) +
                    (type === 'infants' ? newCount : current.infants);

                /* here we do not allow more than 5 people in family package */
                if (totalPeople > 5) return prev;
            }

            return {
                ...prev,
                [itemId]: {
                    ...current,
                    [type]: newCount,
                },
            };
        });
    };

    const getGuestCount = (itemId: string, type: 'adults' | 'children' | 'infants') => {
        return guestCounts[itemId]?.[type] || (type === 'adults' ? 1 : 0);
    };

    const getTotalPeople = (itemId: string) => {
        const counts = guestCounts[itemId] || { adults: 1, children: 0, infants: 0 };
        return counts.adults + counts.children + counts.infants;
    };

    const calculateItemTotal = (item: any) => {
        const counts = guestCounts[item.tourId] || { adults: 1, children: 0, infants: 0 };
        const basePrice = parseFloat(item.tourData.price);

        if (isFamilyPackage && item.tourId === cartItems[0]?.tourId) {
            return basePrice;
        }

        return counts.adults * basePrice + counts.children * basePrice * 0.5;
    };

    if (searchParams.get('paymentId') && searchParams.get('PayerID')) {
        return (
            <Container>
                <PaymentReturnHandler isProcessing={isProcessing} error={error} success={success} />
            </Container>
        );
    }

    if (cartItems.length === 0) {
        if (currentStep === 'payment' || currentStep === 'checkout') {
            return (
                <Container>
                    <EmptyCart>
                        <AlertCircle size={48} style={{ marginBottom: '1rem', color: '#666' }} />
                        <h2>Payment Session Expired</h2>
                        <p>
                            Your payment session has been interrupted. For your convenience and security, please start
                            the booking process from the beginning.
                        </p>
                        <Button variant="primary" onClick={() => navigate('/tours')}>
                            Go to Tour Packages
                        </Button>
                    </EmptyCart>
                </Container>
            );
        }

        if (currentStep === 'cart') {
            return (
                <Container>
                    <EmptyCart>
                        <AlertCircle size={48} style={{ marginBottom: '1rem', color: '#666' }} />
                        <h2>No items in your cart</h2>
                        <p>Start exploring and add some amazing experiences!</p>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Continue Discovering
                        </Button>
                    </EmptyCart>
                </Container>
            );
        }
    }

    switch (currentStep) {
        case 'checkout':
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <EnterInfoStep
                        cartItems={cartItems}
                        formData={formData}
                        guestCounts={guestCounts}
                        calculateTotal={calculateTotal}
                        onNext={handleInfoNext}
                        onBack={handleInfoBack}
                    />
                </Container>
            );

        case 'payment':
            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <PaymentGrid>
                        <PaymentStep
                            isProcessing={isProcessing}
                            error={error}
                            success={success}
                            paymentCreated={paymentCreated}
                            onPayPalClick={handlePayPalPayment}
                            onCardClick={handleCardPayment}
                            onBack={handlePaymentBack}
                            total={calculateTotal()}
                        />
                        <OrderSummary
                            cartItems={cartItems}
                            paymentCreated={paymentCreated}
                            total={calculateTotal()}
                            showItemDetails={true}
                        />
                    </PaymentGrid>
                </Container>
            );

        case 'confirmation':
            const displayTotal = formData.totalAmount || calculateTotal();
            const displayCartItems = formData.cartItems || [];
            return (
                <Container>
                    {/* <StepsWrapper currentStep={currentStep} showConfirmation={true} /> */}
                    <div style={{ marginTop: '7rem' }}>
                        <BookingConfirmation
                            formData={formData}
                            totalAmount={displayTotal}
                            cartItems={displayCartItems}
                            onReturnHome={() => navigate('/')}
                        />
                    </div>
                </Container>
            );

        default:
            const subtotal = cartItems.reduce((sum, item) => sum + calculateItemTotal(item) * item.quantity, 0);
            const tax = subtotal * 0.1;
            const total = subtotal + tax;

            return (
                <Container>
                    <StepsWrapper currentStep={currentStep} />
                    <CartGrid>
                        <CartItemsSection>
                            {cartItems.map((item) => (
                                <div key={item.tourId}>
                                    <TripCard
                                        id={item.tourId}
                                        image={item.tourData.mainImage || '/api/placeholder/100/100'}
                                        title={item.tourData.title}
                                        subtitle={item.tourData.shortDescription}
                                        date={item.selectedDate || 'Date not specified'}
                                        variant="default"
                                        customContent={
                                            <div
                                                style={{
                                                    marginTop: '0.5rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-end',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                                                    {item.tourData.duration} • {getTotalPeople(item.tourId)} people
                                                </span>
                                            </div>
                                        }
                                        actions={
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
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
                                                        style={{
                                                            fontSize: '1.25rem',
                                                            fontWeight: '600',
                                                            color: '#0F2846',
                                                        }}
                                                    >
                                                        ${(parseFloat(item.tourData.price) * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    />
                                    <div style={{ marginBottom: '1rem', textAlign: 'end' }}>
                                        <button
                                            style={{
                                                backgroundColor: isFamilyPackage ? '#ffc107' : '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.2rem 0.3rem ',
                                                fontSize: '0.7rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setIsFamilyPackage(!isFamilyPackage)}
                                        >
                                            {isFamilyPackage ? 'Disable' : 'Enable'} Family Package Test
                                        </button>
                                    </div>

                                    {isFamilyPackage && item.tourId === cartItems[0]?.tourId && (
                                        <FamilyPackageNotice>
                                            🎉 Family Package: This tour is designed for 3-5 people with special group
                                            pricing!
                                            {getTotalPeople(item.tourId) < 3 && ' (Minimum 3 people required)'}
                                            {getTotalPeople(item.tourId) >= 5 && ' (Maximum 5 people)'}
                                        </FamilyPackageNotice>
                                    )}

                                    <GuestSelectionCard>
                                        <GuestSelectionGrid>
                                            <LeftAlignedSection>
                                                <SectionTitle>Info</SectionTitle>

                                                <GuestRow>
                                                    <GuestInfo>
                                                        <GuestLabel>Adult</GuestLabel>
                                                        <GuestAgeRange>(12 - 64 years old)</GuestAgeRange>
                                                    </GuestInfo>
                                                    <GuestControls>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateGuestCount(item.tourId, 'adults', -1)}
                                                            disabled={getGuestCount(item.tourId, 'adults') <= 1}
                                                        >
                                                            -
                                                        </ControlButton>
                                                        <GuestCount>{getGuestCount(item.tourId, 'adults')}</GuestCount>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateGuestCount(item.tourId, 'adults', 1)}
                                                            disabled={
                                                                isFamilyPackage &&
                                                                item.tourId === cartItems[0]?.tourId &&
                                                                getTotalPeople(item.tourId) >= 5
                                                            }
                                                        >
                                                            +
                                                        </ControlButton>
                                                    </GuestControls>
                                                </GuestRow>

                                                <GuestRow>
                                                    <GuestInfo>
                                                        <GuestLabel>Child</GuestLabel>
                                                        <GuestAgeRange>(3 - 11 years old)</GuestAgeRange>
                                                    </GuestInfo>
                                                    <GuestControls>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateGuestCount(item.tourId, 'children', -1)
                                                            }
                                                            disabled={getGuestCount(item.tourId, 'children') <= 0}
                                                        >
                                                            -
                                                        </ControlButton>
                                                        <GuestCount>
                                                            {getGuestCount(item.tourId, 'children')}
                                                        </GuestCount>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateGuestCount(item.tourId, 'children', 1)}
                                                            disabled={
                                                                isFamilyPackage &&
                                                                item.tourId === cartItems[0]?.tourId &&
                                                                getTotalPeople(item.tourId) >= 5
                                                            }
                                                        >
                                                            +
                                                        </ControlButton>
                                                    </GuestControls>
                                                </GuestRow>

                                                <GuestRow>
                                                    <GuestInfo>
                                                        <GuestLabel>Infant</GuestLabel>
                                                        <GuestAgeRange>(1 - 2 years old)</GuestAgeRange>
                                                    </GuestInfo>
                                                    <GuestControls>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateGuestCount(item.tourId, 'infants', -1)}
                                                            disabled={getGuestCount(item.tourId, 'infants') <= 0}
                                                        >
                                                            -
                                                        </ControlButton>
                                                        <GuestCount>{getGuestCount(item.tourId, 'infants')}</GuestCount>
                                                        <ControlButton
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => updateGuestCount(item.tourId, 'infants', 1)}
                                                            disabled={
                                                                isFamilyPackage &&
                                                                item.tourId === cartItems[0]?.tourId &&
                                                                getTotalPeople(item.tourId) >= 5
                                                            }
                                                        >
                                                            +
                                                        </ControlButton>
                                                    </GuestControls>
                                                </GuestRow>
                                            </LeftAlignedSection>

                                            <DatePickerContainer>
                                                <SectionTitle>Date</SectionTitle>
                                                <DatePicker
                                                    value={selectedDate}
                                                    style={{ width: '100%', height: '48px' }}
                                                    placeholder="04.13.2025"
                                                    onChange={setSelectedDate}
                                                />
                                            </DatePickerContainer>
                                        </GuestSelectionGrid>
                                    </GuestSelectionCard>
                                </div>
                            ))}
                        </CartItemsSection>

                        <OrderSummary
                            cartItems={cartItems}
                            total={total}
                            showButton={true}
                            onButtonClick={handleCheckout}
                        />
                    </CartGrid>
                </Container>
            );
    }
}
