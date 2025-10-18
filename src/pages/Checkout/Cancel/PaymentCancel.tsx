import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    padding: ${({ theme }) => theme.spacing.xl};
`;

const CancelCard = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => theme.spacing['2xl']};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    text-align: center;
    max-width: 500px;
    width: 100%;
`;

const Title = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Message = styled.div`
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    border: 2px solid ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.background};

    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

/**
 * PaymentCancel - Page Component
 * @description This component informs the user that the
 * payment process has been cancelled
 * and redirects them back to the payment page after a short delay.
 */
export default function PaymentCancel() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/cart/checkout/payment?error=cancelled');
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleRetryPayment = () => {
        navigate('/cart/checkout/payment');
    };

    return (
        <Container>
            <CancelCard>
                <Title>Payment Cancelled</Title>
                <Message>You have cancelled the payment process. No charges have been made to your account.</Message>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
                    You will be automatically redirected back to the payment page in a few seconds, or you can click the
                    button below to retry immediately.
                </div>
                <Button onClick={handleRetryPayment}>Try Payment Again</Button>
            </CancelCard>
        </Container>
    );
}
