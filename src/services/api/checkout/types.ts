export type Participant = {
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    dateOfBirth: string;
};

export type PaymentCreateRequest = {
    amount: number;
    currency?: string;
    tour_uuid: string;
    participants: Participant[];
};

export type PaymentCreateResponse = {
    bookingId: number;
    approvalUrl: string;
    paymentId: string;
};

export type PaymentExecuteRequest = {
    payment_id: string;
    payer_id: string;
};

export type PaymentExecuteResponse = {
    id: string;
    state: string;
    payer: {
        payment_method: string;
        status: string;
        payer_info?: {
            email?: string;
            first_name?: string;
            last_name?: string;
            payer_id?: string;
        };
    };
    transactions?: Array<{
        amount: {
            total: string;
            currency: string;
        };
        description?: string;
    }>;
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
    card_info: CardInfo;
    billing_info: BillingInfo;
    save_card: boolean;
};

export type CardPaymentResponse = {
    booking_id: number;
    payment_id: string;
    amount: number;
    currency: string;
    status: string;
};
