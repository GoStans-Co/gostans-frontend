import styled from 'styled-components';
import Button from '@/components/common/Button';
import { CartItem } from '@/services/api/cart';
import { formatCurrency } from '@/utils/general/formatCurrency';

type OrderSummaryProps = {
    cartItems: CartItem[];
    paymentCreated?: any;
    total: number;
    showItemDetails?: boolean;
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: () => void;
    buttonDisabled?: boolean;
    validationErrors?: { [key: string]: string };
};

const OrderSummaryCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        border-radius: ${({ theme }) => theme.borderRadius.md};
        box-shadow: ${({ theme }) => theme.shadows.sm};
    }
`;

const OrderTitle = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
        margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    }
`;

const OrderItems = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const OrderItem = styled.div`
    &:last-child {
        border-bottom: none;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm} 0;
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

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        padding-right: ${({ theme }) => theme.spacing.sm};
    }
`;

const ItemPrice = styled.span`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const ItemDetails = styled.div`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        gap: ${({ theme }) => theme.spacing.xs};
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        padding: ${({ theme }) => theme.spacing.xs} 0;
    }
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.md} 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin: ${({ theme }) => theme.spacing.sm} 0;
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
        margin-top: ${({ theme }) => theme.spacing.sm};
    }
`;

const PaymentInfo = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.secondary};

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-top: ${({ theme }) => theme.spacing.md};
        padding: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
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

    ${({ theme }) => theme.responsive.maxMobile} {
        position: relative;
        top: auto;
    }
`;

const ButtonWrapper = styled.div`
    margin-top: 1.5rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-top: 1rem;
    }
`;

export default function OrderSummary({
    cartItems,
    paymentCreated,
    total,
    showItemDetails = false,
    showButton = false,
    buttonText = 'Proceed to Checkout',
    onButtonClick,
    buttonDisabled = false,
    validationErrors = {},
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
                                    <ItemPrice>{formatCurrency(item.tourData.price)}</ItemPrice>
                                </ItemRow>
                                <ItemDetails>
                                    <DetailItem>{item.tourData.durationDays}</DetailItem>
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
                            <span>{formatCurrency(subtotal)}</span>
                        </SummaryRow>
                        <SummaryRow>
                            <span>Tax</span>
                            <span>{formatCurrency(tax)}</span>
                        </SummaryRow>
                    </>
                )}

                {showItemDetails && (
                    <>
                        <Divider />
                        <SummaryRow>
                            <span>Tax (10%)</span>
                            <span>{formatCurrency(tax)}</span>
                        </SummaryRow>
                    </>
                )}

                <TotalRow>
                    <span>{showItemDetails ? 'Total' : 'Total:'}</span>
                    <span>{formatCurrency(total)}</span>
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
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            onClick={onButtonClick}
                            disabled={buttonDisabled || Object.keys(validationErrors).length > 0}
                            fullWidth
                            size="lg"
                        >
                            {buttonText}
                        </Button>
                    </ButtonWrapper>
                )}
            </OrderSummaryCard>
        </OrderSummaryWrapper>
    );
}
