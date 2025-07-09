import styled from 'styled-components';
import { CartItem } from '@/atoms/cart';
import Button from '@/components/Common/Button';

type OrderSummaryProps = {
    cartItems: CartItem[];
    paymentCreated?: any;
    total: number;
    showItemDetails?: boolean;
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
};

const OrderSummaryCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
`;

const OrderTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    text-align: left;
`;

const OrderItems = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const OrderItem = styled.div`
    padding: ${({ theme }) => theme.spacing.md} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:last-child {
        border-bottom: none;
    }
`;

const ItemRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ItemTitle = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text};
    flex: 1;
    padding-right: ${({ theme }) => theme.spacing.md};
    text-align: left;
`;

const ItemPrice = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text};
`;

const ItemDetails = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const DetailItem = styled.span`
    &:not(:last-child)::after {
        content: '•';
        margin-left: ${({ theme }) => theme.spacing.sm};
    }
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.text};
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.md} 0;
`;

const TotalRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const PaymentInfo = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.secondary};
`;

const PaymentInfoRow = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-align: left;
    &:last-child {
        margin-bottom: 0;
    }
`;

const OrderSummaryWrapper = styled.div<{ sticky?: boolean }>`
    position: sticky;
    top: 100px;
    height: fit-content;
`;

export default function OrderSummary({
    cartItems,
    paymentCreated,
    total,
    showItemDetails = false,
    showButton = false,
    buttonText = 'Proceed to Checkout',
    onButtonClick,
}: OrderSummaryProps) {
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.tourData.price) * item.quantity, 0);
    const tax = subtotal * 0.1;

    return (
        <OrderSummaryWrapper>
            <OrderSummaryCard>
                <OrderTitle>Order Summary</OrderTitle>

                {showItemDetails && (
                    <OrderItems>
                        {cartItems.map((item) => (
                            <OrderItem key={item.tourId}>
                                <ItemRow>
                                    <ItemTitle>{item.tourData.title}</ItemTitle>
                                    <ItemPrice>
                                        ${(parseFloat(item.tourData.price) * item.quantity).toFixed(2)}
                                    </ItemPrice>
                                </ItemRow>
                                <ItemDetails>
                                    <DetailItem>{item.tourData.duration}</DetailItem>
                                    <DetailItem>{item.adults || 1} adults</DetailItem>
                                    <DetailItem>Quantity: {item.quantity}</DetailItem>
                                </ItemDetails>
                            </OrderItem>
                        ))}
                    </OrderItems>
                )}

                {!showItemDetails && (
                    <>
                        <SummaryRow>
                            <span>Subtotal ({cartItems.length} items)</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </SummaryRow>
                        <SummaryRow>
                            <span>Tax</span>
                            <span>${tax.toFixed(2)}</span>
                        </SummaryRow>
                    </>
                )}

                {showItemDetails && (
                    <>
                        <Divider />
                        <SummaryRow>
                            <span>Tax (10%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </SummaryRow>
                    </>
                )}

                <TotalRow>
                    <span>{showItemDetails ? 'Total' : 'Total:'}</span>
                    <span>${total.toFixed(2)}</span>
                </TotalRow>

                {paymentCreated && (
                    <PaymentInfo>
                        <PaymentInfoRow>
                            <strong>Booking ID:</strong> {paymentCreated.bookingId}
                        </PaymentInfoRow>
                        <PaymentInfoRow>
                            <strong>Payment ID:</strong> {paymentCreated.paymentId}
                        </PaymentInfoRow>
                    </PaymentInfo>
                )}

                {showButton && onButtonClick && buttonText !== 'none' && (
                    <Button variant="primary" fullWidth onClick={onButtonClick} style={{ marginTop: '1.5rem' }}>
                        {buttonText}
                    </Button>
                )}
            </OrderSummaryCard>
        </OrderSummaryWrapper>
    );
}
