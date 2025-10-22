import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import Card from '@/components/common/Card';
import { message } from 'antd';

const PaymentMethodsContainer = styled.div`
    width: 100%;
    max-width: 100%;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
    }
`;

const PageHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
`;

const PaymentMethodsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const PaymentCard = styled(Card)<{ $isDefault?: boolean }>`
    padding: ${({ theme }) => theme.spacing.lg};
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid ${({ theme, $isDefault }) => ($isDefault ? theme.colors.primary : theme.colors.border)};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardBrand = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const CardIcon = styled.div`
    width: 40px;
    height: 40px;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
`;

const CardBrandName = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.lightBackground};
    }
`;

const CardNumber = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    margin: ${({ theme }) => theme.spacing.sm} 0;
    letter-spacing: 2px;
`;

const CardDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.md};
`;

const CardExpiry = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

const DefaultBadge = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 600;
`;

const AddCardButton = styled(Button)`
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    cursor: pointer;
    border: 2px dashed ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.lightBackground};
    transition: all 0.3s ease;

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
        background-color: white;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        min-height: 150px;
    }
`;

const AddCardIcon = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AddCardText = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem ${({ theme }) => theme.spacing['3xl']};
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 5rem ${({ theme }) => theme.spacing.xl};
    }
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.lightText};

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
    }
`;

const EmptyTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
`;

const EmptyText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

type PaymentMethod = {
    id: string;
    brand: string;
    last4: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
};

export default function ManagePayments() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const loadPaymentMethods = async () => {
            /**
             * i will soon replace this with actual endpoint
             * const data = await paymentService.getAll();
             */
            setPaymentMethods([]);
            setIsLoading(false);
        };
        loadPaymentMethods();
    }, []);

    const handleAddCard = () => {
        messageApi.info('Add card functionality coming soon!');
    };

    const handleDeleteCard = async (id: string) => {
        try {
            /* await paymentMethodsService.delete(id) */
            setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
            messageApi.success('Payment method removed successfully!');
        } catch (error) {
            console.error('Failed to delete payment method:', error);
            messageApi.error('Failed to remove payment method');
        }
    };

    if (isLoading) {
        return (
            <PaymentMethodsContainer>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading payment methods...</div>
            </PaymentMethodsContainer>
        );
    }

    return (
        <>
            {contextHolder}
            <PaymentMethodsContainer>
                <PageHeader>
                    <PageTitle>Payment methods</PageTitle>
                    <PageSubtitle>Manage your payment options</PageSubtitle>
                </PageHeader>

                {paymentMethods.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <CreditCard size={64} />
                        </EmptyIcon>
                        <EmptyTitle>No payment methods yet!</EmptyTitle>
                        <EmptyText>Add a payment method to make booking faster and easier.</EmptyText>
                        <Button variant="primary" onClick={handleAddCard}>
                            Add payment method
                        </Button>
                    </EmptyState>
                ) : (
                    <PaymentMethodsGrid>
                        {paymentMethods.map((method) => (
                            <PaymentCard key={method.id} $isDefault={method.isDefault}>
                                <CardHeader>
                                    <CardBrand>
                                        <CardIcon>
                                            <CreditCard size={20} />
                                        </CardIcon>
                                        <CardBrandName>{method.brand}</CardBrandName>
                                    </CardBrand>
                                    <DeleteButton onClick={() => handleDeleteCard(method.id)}>
                                        <Trash2 size={18} />
                                    </DeleteButton>
                                </CardHeader>
                                <CardNumber>•••• •••• •••• {method.last4}</CardNumber>
                                <CardDetails>
                                    <CardExpiry>
                                        Expires {method.expiryMonth}/{method.expiryYear}
                                    </CardExpiry>
                                    {method.isDefault && <DefaultBadge>Default</DefaultBadge>}
                                </CardDetails>
                            </PaymentCard>
                        ))}
                        <AddCardButton onClick={handleAddCard} variant="outline" size="sm">
                            <AddCardIcon>
                                <Plus size={24} />
                            </AddCardIcon>
                            <AddCardText>Add new card</AddCardText>
                        </AddCardButton>
                    </PaymentMethodsGrid>
                )}
            </PaymentMethodsContainer>
        </>
    );
}
