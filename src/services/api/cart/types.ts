export type CartItem = {
    tourId: string;
    tourData: {
        uuid: string;
        title: string;
        price: string;
        mainImage: string;
        duration: string;
        about: string;
        tourType: number;
        shortDescription: string;
    };
    quantity: number;
    selectedDate?: string;
    adults: number;
    addedAt: number;
    price?: number;
    duration?: string;
    trip_start_date?: string;
    trip_end_date?: string;
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

export type PaymentMethod = 'mastercard' | 'apple-pay' | 'visa-pay' | 'paypal' | 'google-pay' | 'bank-transfer';

export type PaymentDetails = {
    id: string;
    orderId: string;
    payerId: string;
    payerEmail?: string;
    payerName?: string;
    amount: string;
    currency: string;
    status: string;
    transactionId: string;
    paymentMethod?: PaymentMethod;
    createdAt?: string;
    updatedAt?: string;
    details?: any | null;
    booking?: number;
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

export type CartItemResponse = {
    id: number;
    tour: {
        uuid: string;
        title: string;
        price: string;
        mainImage?: string;
        tourType?: number;
        about: string;
    };
    quantity: number;
    addedAt: string;
};

export type AddToCartRequest = {
    tourUuid: string;
    quantity: number;
};

export type RemoveFromCartResponse = {
    status: number;
    message: string;
    data: {
        tour_uuid: string;
        message: string;
    };
};

export type CartListResponse = {
    status: number;
    message: string;
    data: CartItem[];
};

export type ApiCartItem = {
    id: number;
    tour: {
        uuid: string;
        title: string;
        price: string;
        mainImage: string;
        tourType: number;
        duration: string;
        shortDescription: string;
    };
    quantity: number;
    addedAt: string;
};

export type ApiCartResponse = {
    statusCode: number;
    message: string;
    data: ApiCartItem[];
};
