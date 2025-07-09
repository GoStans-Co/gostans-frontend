import { CartItem } from '@/atoms/cart';

export type Participant = {
    id: string;
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    dateOfBirth: string;
};

export type CardDetails = {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard: boolean;
};

type PaymentMethod = 'mastercard' | 'apple-pay' | 'visa-pay' | 'paypal' | 'google-pay' | 'bank-transfer';

export type PaymentDetails = {
    orderId: string;
    payerId: string;
    payerEmail: string;
    payerName: string;
    amount: string;
    currency: string;
    status: string;
    transactionId: string;
};

export type BookingFormData = {
    participants: any[];
    cardDetails?: any;
    paymentMethod?: PaymentMethod;
    paymentDetails?: PaymentDetails;
    cartItems?: CartItem[];
    totalAmount?: number;
};

export type EnterInfoStepProps = {
    cartItems: CartItem[];
    formData: BookingFormData;
    onNext: (data: Partial<BookingFormData>) => void;
    onBack: () => void;
    totalGuests?: number;
    guestCounts?: { [itemId: string]: { adults: number; children: number; infants: number } };
    calculateTotal: () => number;
};
