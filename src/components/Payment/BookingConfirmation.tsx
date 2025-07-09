import styled from 'styled-components';
import Button from '@/components/Common/Button';
import { BookingFormData } from '@/types/cart';
import { CartItem } from '@/atoms/cart';

type BookingConfirmationProps = {
    formData: BookingFormData;
    totalAmount: number;
    cartItems?: CartItem[];
    onReturnHome: () => void;
};

const ConfirmationContainer = styled.div`
    max-width: 450px;
    margin: 0 auto;
    text-align: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const SuccessTitle = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: #10b981;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PaymentDetailsCard = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    padding: ${({ theme }) => theme.spacing.lg};
    background-color: #e8f5e8;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid #10b981;
    text-align: left;
`;

const PaymentDetailsTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: #10b981;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PaymentDetailRow = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;

    &:last-child {
        margin-bottom: 0;
    }

    strong {
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
        color: ${({ theme }) => theme.colors.primary};
    }
`;

const OrderSummaryCard = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const OrderTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const OrderMessage = styled.p`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
`;

const TotalSection = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
`;

export default function BookingConfirmation({
    formData,
    totalAmount,
    cartItems = [],
    onReturnHome,
}: BookingConfirmationProps) {
    return (
        <ConfirmationContainer>
            <SuccessTitle>✓ Booking Confirmed!</SuccessTitle>
            <SuccessMessage>Thank you for your booking. You will receive a confirmation email shortly.</SuccessMessage>

            {formData.paymentDetails && (
                <PaymentDetailsCard>
                    <PaymentDetailsTitle>Payment Details</PaymentDetailsTitle>
                    <PaymentDetailRow>
                        <strong>Transaction ID:</strong> {formData.paymentDetails.transactionId}
                    </PaymentDetailRow>
                    <PaymentDetailRow>
                        <strong>Order ID:</strong> {formData.paymentDetails.orderId}
                    </PaymentDetailRow>
                    <PaymentDetailRow>
                        <strong>Amount Paid:</strong> ${formData.paymentDetails.amount}
                    </PaymentDetailRow>
                    <PaymentDetailRow>
                        <strong>Payment Method:</strong>{' '}
                        {formData.paymentMethod === 'paypal' ? 'PayPal' : 'Credit/Debit Card'}
                    </PaymentDetailRow>
                    <PaymentDetailRow>
                        <strong>Status:</strong> {formData.paymentDetails.status}
                    </PaymentDetailRow>
                </PaymentDetailsCard>
            )}

            <OrderSummaryCard>
                <OrderTitle>Order Summary</OrderTitle>
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <OrderMessage key={item.tourId} style={{ marginBottom: '0.5rem' }}>
                            {item.tourData.title} x{item.quantity} - $
                            {(parseFloat(item.tourData.price) * item.quantity).toFixed(2)}
                        </OrderMessage>
                    ))
                ) : (
                    <OrderMessage>Your booking has been processed successfully.</OrderMessage>
                )}
                <TotalSection>Total: ${formData.paymentDetails?.amount || totalAmount.toFixed(2)}</TotalSection>
            </OrderSummaryCard>

            <Button variant="primary" onClick={onReturnHome}>
                Return to Home
            </Button>
        </ConfirmationContainer>
    );
}
