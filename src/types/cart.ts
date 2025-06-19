export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency: string;
    image: string;
    description?: string;
    date?: string;
    duration?: string;
};

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

type PaymentMethod = 'mastercard' | 'apple-pay' | 'visa-pay';

export type BookingFormData = {
    participants: Participant[];
    cardDetails?: CardDetails;
    email?: string;
    phone?: string;
    specialRequests?: string;
    paymentMethod?: PaymentMethod;
};

export type EnterInfoStepProps = {
    cartItems: CartItem[];
    formData: BookingFormData;
    onNext: (data: Partial<BookingFormData>) => void;
    onBack: () => void;
};
