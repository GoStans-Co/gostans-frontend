import { ApiResponse } from '@/types/common/fetch';
import { CartItem } from '../cart';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type IdType = 'passport' | 'license' | 'national_id';
export type PaymentMethod = 'mastercard' | 'apple-pay' | 'visa-pay' | 'paypal' | 'google-pay' | 'bank-transfer';

export type Participant = {
    firstName: string;
    lastName: string;
    idType: IdType | string;
    idNumber: string;
    dateOfBirth: string;
};

export type Payment = {
    id: number;
    paymentId: string;
    amount: string;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod | string;
    payerId: string | null;
    createdAt: string;
    updatedAt: string;
    details: any | null;
    booking: number;
};

export type BookingDetail = {
    id: number;
    uuid: string;
    tourTitle: string;
    tourType: string | null;
    mainImage: string;
    amount: string;
    currency: string;
    status: BookingStatus;
    tripStartDate: string | null;
    tripEndDate: string | null;
    createdAt: string;
    payments: Payment[];
    participants: Participant[];
};

export type BookingDetailResponse = {
    statusCode: number;
    message: string;
    data: BookingDetail;
};

export type PaymentDetails = {
    orderId: number;
    id: number;
    paymentId: string;
    amount: string;
    currency: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod | string;
    payerId: string | null;
    createdAt: string;
    updatedAt: string;
    details: any | null;
    booking: number;
    transactionId?: string;
};

export type BookingFormData = {
    participants: Participant[];
    cardDetails?: CardDetails;
    paymentMethod?: PaymentMethod;
    paymentDetails?: PaymentDetails;
    cartItems?: CartItem[];
    totalAmount?: number;
};

export type CardDetails = {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    saveCard: boolean;
};

export type BookingDetails = {
    id: number;
    booking_id: string;
    tour_uuid: string;
    tour_title: string;
    amount: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_id?: string;
    participants: Participant[];
    booking_date: string;
    created_at: string;
    updated_at: string;
};

export type BookingListResponse = {
    results: BookingDetails[];
    count: number;
    next?: string;
    previous?: string;
};

export type BookingError = {
    field?: string;
    message: string;
    code?: string;
};

export type BookingValidationError = {
    amount?: string[];
    participants?: string[];
    tourUuid?: string[];
    paymentId?: string[];
    PayerID?: string[];
    [key: string]: string[] | undefined;
};

export type CardInfo = {
    number: string;
    exp_month: string;
    exp_year: string;
    cvv: string;
    type: string;
};

export type BillingInfo = {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phone: string;
};

export type CardPaymentRequest = {
    amount: number;
    currency?: string;
    tour_uuid: string;
    participants: Participant[];
    trip_start_date: string;
    trip_end_date: string;
    card_info?: CardInfo;
    billing_info?: BillingInfo;
    save_card?: boolean;
};

export type CardPaymentResponse = {
    booking_id: number;
    payment_id: string;
    amount: number;
    currency: string;
    status: string;
    approvalUrl?: string;
};

export type PaymentExecuteRequest = {
    paymentId: string;
    PayerID: string;
};

export type PaymentExecuteResponse = {
    id: string;
    state: string;
    payer: { payment_method: PaymentMethod | string; status: string };
    status: string;
};

export type CheckoutPromise = ApiResponse<PaymentExecuteResponse> | ApiResponse<void>;

export type StripePaymentRequest = {
    amount: number;
    currency: string;
    tour_uuid: string;
    trip_start_date: string;
    trip_end_date: string;
    participants: Array<{
        firstName: string;
        lastName: string;
        idType: string;
        idNumber: string;
        dateOfBirth: string;
    }>;
};

export type StripePaymentResponse = {
    client_secret: string;
    payment_intent_id: string;
    amount: number;
    currency: string;
    status: string;
};
