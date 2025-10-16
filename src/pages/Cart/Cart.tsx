import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import EnterInfoStep from '@/components/Cart/EnterInfoStep';
import { StepsWrapper } from '@/components/Steps';
import TripCard from '@/components/Card/TripCard';
import { useRecoilState } from 'recoil';
import { cartAtom } from '@/atoms/cart';
import OrderSummary from '@/components/Payment/OrderSummary';
import BookingConfirmation from '@/components/Payment/BookingConfirmation';
import PaymentReturnHandler from '@/components/Payment/PaymentReturnHandle';
import PaymentStep from '@/components/Payment/PaymentStep';
import { AlertCircle } from 'lucide-react';
import { useValidation } from '@/hooks/utils/useValidation';
import { useApiServices } from '@/services/api';
import { BookingFormData, CartItem, PaymentDetails } from '@/services/api/cart';
import { CardPaymentResponse, Participant, PaymentStatus } from '@/services/api/checkout';

type CheckoutStep = 'cart' | 'checkout' | 'payment' | 'confirmation';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 2rem;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.lightBackground || '#f8f9fa'};

    ${({ theme }) => theme.responsive.tablet} {
        padding: ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        padding: 1rem 1rem 2.5rem 1rem;
    }
`;

const CartGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 2rem;

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const PaymentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;

    ${({ theme }) => theme.responsive.laptop} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
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

    ${({ theme }) => theme.responsive.tablet} {
        padding: 8rem ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        padding: 6rem ${({ theme }) => theme.spacing.lg};
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text};
        margin-bottom: 1rem;

        ${({ theme }) => theme.responsive.mobile} {
            font-size: ${({ theme }) => theme.fontSizes.xl};
        }
    }

    p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: ${({ theme }) => theme.colors.lightText};

        ${({ theme }) => theme.responsive.mobile} {
            font-size: ${({ theme }) => theme.fontSizes.md};
            margin-bottom: ${({ theme }) => theme.spacing.xl};
        }
    }
`;

const GuestSelectionCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.xl};
    border: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    margin-top: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        margin-top: ${({ theme }) => theme.spacing.sm};
    }
`;

const GuestSelectionGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: start;

    ${({ theme }) => theme.responsive.tablet} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.lg};
    }

    ${({ theme }) => theme.responsive.mobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const GuestRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    &:last-child {
        margin-bottom: 0;
    }

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: row;
        align-items: flex-start;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const GuestInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    text-align: left;
`;

const GuestLabel = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: 500;
        margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
`;

const GuestAgeRange = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        line-height: 1.3;
    }
`;

const GuestControls = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: left;

    ${({ theme }) => theme.responsive.mobile} {
        align-self: flex-end;
        margin-top: ${({ theme }) => theme.spacing.xs};
    }
`;

const GuestCount = styled.span`
    min-width: 20px;
    text-align: center;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.mobile} {
        min-width: 28px;
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: 600;
    }
`;

const ControlButton = styled(Button)`
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.responsive.mobile} {
        width: 35px;
        height: 35px;
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
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

const GuestSelectionTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.9rem;
    text-align: left;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
        font-weight: 500;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const LeftAlignedSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    padding-left: 0;

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const CalendarContainer = styled.div`
    background: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    padding: 1rem;

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.xs};
        margin-top: ${({ theme }) => theme.spacing.md};
    }
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: row;
        gap: ${({ theme }) => theme.spacing.sm};
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const CalendarTitle = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

const SelectedDateText = styled.div`
    margin-top: 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.lightText};
`;

const CalendarNav = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const CalendarNavButton = styled.button`
    background: none;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 4px;
    padding: 0.25rem 0.7rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
    transition: all 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.lightBackground};
        color: ${({ theme }) => theme.colors.border};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;

    ${({ theme }) => theme.responsive.mobile} {
        gap: 0.125rem;
    }
`;

const CalendarWeekday = styled.div`
    text-align: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #666;
    padding: 0.5rem 0;
`;

const CalendarDay = styled.button<{ $isSelected?: boolean; $isToday?: boolean; $isDisabled?: boolean }>`
    aspect-ratio: 1;
    border: 1px solid ${(props) => (props.$isSelected ? '#007bff' : props.$isToday ? '#007bff' : 'transparent')};
    background: ${(props) => (props.$isSelected ? '#007bff' : props.$isToday ? '#e6f2ff' : '#fff')};
    color: ${(props) => (props.$isSelected ? '#fff' : props.$isDisabled ? '#ccc' : '#333')};
    border-radius: 4px;
    cursor: ${(props) => (props.$isDisabled ? 'not-allowed' : 'pointer')};
    font-size: 0.875rem;
    transition: all 0.2s;
    min-height: 32px;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        min-height: 28px;
    }

    &:hover:not(:disabled) {
        background: ${(props) => (props.$isSelected ? '#0056b3' : '#f0f0f0')};
    }

    &:disabled {
        opacity: 0.5;
    }
`;

const TestButton = styled.button<{ $active?: boolean }>`
    display: none;
    background-color: ${(props) => (props.$active ? '#ffc107' : '#007bff')};
    color: white;
    border: none;
    padding: 0.2rem 0.3rem;
    font-size: 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
    float: right;
`;

const ValidationError = styled.div`
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
    text-align: center;
    background-color: rgb(246, 227, 229);
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
        margin-top: ${({ theme }) => theme.spacing.xs};
        line-height: 1.3;
    }

    &:focus {
        outline-offset: 2px;
        animation: pulse 0.5s ease-in-out;
    }
`;

/**
 * Cart - Page Component
 * @description This component renders the shopping cart page and its contents
 * @returns JSX.Element
 */
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
    const { checkout } = useApiServices();

    const [cartItems, setCartItems] = useRecoilState(cartAtom);
    const [paymentCreated, setPaymentCreated] = useState<CardPaymentResponse | null>(null);

    const [currentStep, setCurrentStep] = useState<CheckoutStep>(getCurrentStep());
    const [formData, setFormData] = useState<BookingFormData>({
        participants: [],
        cardDetails: undefined,
        paymentMethod: undefined,
        paymentDetails: undefined,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [guestCounts, setGuestCounts] = useState<{
        [itemId: string]: { adults: number; children: number; infants: number };
    }>({});
    const [isFamilyPackage, setIsFamilyPackage] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ [itemId: string]: Date | null }>({});
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { cartValidationErrors, validateCart } = useValidation('cart');
    const hasInitialized = useRef(false);
    const errorRefs = useRef<{ [itemId: string]: HTMLDivElement | null }>({});
    const isValidating = useRef(false);

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
        if (!isValidating.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
                participants: formData.participants.map((participant: Participant) => ({
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    idType: participant.idType || 'passport',
                    idNumber: participant.idNumber,
                    dateOfBirth: participant.dateOfBirth,
                })),
                trip_start_date: formatDateToYMD(mainTour.trip_start_date || new Date()),
                trip_end_date: formatDateToYMD(mainTour.trip_end_date || new Date()),
            };

            const response = await checkout.createPayment(paymentRequest);

            if (response.statusCode === 200) {
                setPaymentCreated(response.data);
                setSuccess('Payment initialized successfully');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to initialize payment');
            hasInitialized.current = false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentReturn = async (paymentId: string, PayerID: string) => {
        try {
            setIsProcessing(true);
            setError('');

            const calculatedTotal = calculateTotal();

            const executeResponse = await checkout.executePayment({ paymentId, PayerID });

            if (executeResponse.statusCode === 200) {
                const paymentDetails: PaymentDetails = {
                    id: executeResponse.data.id,
                    orderId: executeResponse.data.id,
                    amount: calculatedTotal.toFixed(2),
                    currency: 'USD',
                    status: executeResponse.data.status as PaymentStatus,
                    paymentMethod: 'paypal',
                    payerId: PayerID,
                    transactionId: executeResponse.data.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    details: executeResponse.data,
                    booking: 0,
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
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Payment execution failed');
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

    const handleStripeCardPayment = async () => {
        try {
            setError('');
            setIsProcessing(true);

            const mainTour = cartItems[0];
            const total = calculateTotal();

            const paymentIntentRequest = {
                amount: Math.floor(total * 100),
                currency: 'USD',
                tour_uuid: mainTour.tourId,
                participants: formData.participants.map((participant: Participant) => ({
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    idType: participant.idType || 'passport',
                    idNumber: participant.idNumber,
                    dateOfBirth: participant.dateOfBirth,
                })),
                trip_start_date: formatDateToYMD(selectedDates[mainTour.tourId] || new Date()),
                trip_end_date: formatDateToYMD(mainTour.trip_end_date || new Date()),
            };

            const response = await checkout.createStripePayment(paymentIntentRequest);

            if (response.statusCode === 200) {
                setSuccess('Payment initialized');
                setIsProcessing(false);
                return {
                    ...response,
                    success: true,
                };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Payment initialization failed');
            setIsProcessing(false);
            return null;
        }
    };

    const validateCartItems = () => {
        return validateCart(cartItems, selectedDates, guestCounts, isFamilyPackage);
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

    function formatDateToYMD(date: string | Date): string {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toISOString().slice(0, 10);
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const formatMonth = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const isToday = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isPastDate = (date: Date | null) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateSelect = (itemId: string, date: Date) => {
        setSelectedDates((prev) => ({ ...prev, [itemId]: date }));

        if (cartValidationErrors[itemId]) {
            validateCart(cartItems, { ...selectedDates, [itemId]: date }, guestCounts, isFamilyPackage);
        }
    };

    const navigateMonth = (direction: number) => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const removeItem = (tourId: string) => {
        setCartItems((prev) => prev.filter((item) => item.tourId !== tourId));
    };

    const handleCheckout = () => {
        const isValid = validateCartItems();
        if (!isValid) {
            isValidating.current = true;

            setTimeout(() => {
                const firstErrorItemId = Object.keys(cartValidationErrors).find(
                    (itemId) => cartValidationErrors[itemId],
                );
                if (firstErrorItemId && errorRefs.current[firstErrorItemId]) {
                    errorRefs.current[firstErrorItemId]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                    errorRefs.current[firstErrorItemId]?.focus();
                }

                isValidating.current = false;
            }, 200);
            return;
        }
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
            selectedDates,
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

    const calculateItemTotal = (item: CartItem) => {
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
                        <Button variant="primary" onClick={() => navigate('/searchTrips')}>
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
                            onCardClick={handleStripeCardPayment}
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
                                        variant="compact"
                                        meta={{
                                            duration: item.tourData.durationDays,
                                            peopleCount: getTotalPeople(item.tourId),
                                        }}
                                        price={parseFloat(item.tourData.price)}
                                        quantity={item.quantity}
                                        showQuantity={true}
                                        onRemove={() => removeItem(item.tourId)}
                                    />
                                    <TestButton
                                        $active={isFamilyPackage}
                                        onClick={() => setIsFamilyPackage(!isFamilyPackage)}
                                    >
                                        {isFamilyPackage ? 'Disable' : 'Enable'} Family Package Test
                                    </TestButton>

                                    {isFamilyPackage && item.tourId === cartItems[0]?.tourId && (
                                        <FamilyPackageNotice>
                                            🎉 Family Package: This tour is designed for 3-5 people with special group
                                            pricing!
                                            {getTotalPeople(item.tourId) < 3 && ' (Minimum 3 people required)'}
                                            {getTotalPeople(item.tourId) >= 5 && ' (Maximum 5 people)'}
                                        </FamilyPackageNotice>
                                    )}

                                    <GuestSelectionCard>
                                        <GuestSelectionTitle>Guest Selecting</GuestSelectionTitle>
                                        {cartValidationErrors[item.tourId] && (
                                            <ValidationError
                                                ref={(el) => {
                                                    errorRefs.current[item.tourId] = el;
                                                }}
                                                tabIndex={-1}
                                            >
                                                Please select a date and number of adults{' '}
                                            </ValidationError>
                                        )}
                                        <GuestSelectionGrid>
                                            <LeftAlignedSection>
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

                                            <CalendarContainer>
                                                <CalendarHeader>
                                                    <CalendarTitle>{formatMonth(currentMonth)}</CalendarTitle>
                                                    <CalendarNav>
                                                        <CalendarNavButton onClick={() => navigateMonth(-1)}>
                                                            &#8249;
                                                        </CalendarNavButton>
                                                        <CalendarNavButton onClick={() => navigateMonth(1)}>
                                                            &#8250;
                                                        </CalendarNavButton>
                                                    </CalendarNav>
                                                </CalendarHeader>

                                                <CalendarGrid>
                                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                                        <CalendarWeekday key={day}>{day}</CalendarWeekday>
                                                    ))}

                                                    {getDaysInMonth(currentMonth).map((date, index) => (
                                                        <CalendarDay
                                                            key={index}
                                                            $isSelected={
                                                                !!date &&
                                                                selectedDates[item.tourId]?.toDateString() ===
                                                                    date.toDateString()
                                                            }
                                                            $isToday={isToday(date)}
                                                            $isDisabled={isPastDate(date) || isToday(date)}
                                                            disabled={!date || isPastDate(date) || isToday(date)}
                                                            onClick={() =>
                                                                date &&
                                                                !isPastDate(date) &&
                                                                !isToday(date) &&
                                                                handleDateSelect(item.tourId, date)
                                                            }
                                                        >
                                                            {date?.getDate()}
                                                        </CalendarDay>
                                                    ))}
                                                </CalendarGrid>

                                                {selectedDates[item.tourId] && (
                                                    <SelectedDateText>
                                                        Selected: {selectedDates[item.tourId]?.toLocaleDateString()}
                                                    </SelectedDateText>
                                                )}
                                            </CalendarContainer>
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
                            validationErrors={cartValidationErrors}
                            buttonDisabled={false}
                        />
                    </CartGrid>
                </Container>
            );
    }
}
