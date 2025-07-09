import styled from 'styled-components';

type PaymentReturnHandlerProps = {
    isProcessing: boolean;
    error: string;
    success: string;
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    padding: ${({ theme }) => theme.spacing.xl};
`;

const ProcessingCard = styled.div`
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

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top: 4px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto ${({ theme }) => theme.spacing.lg} auto;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ErrorMessage = styled.div`
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessMessage = styled.div`
    background-color: #efe;
    border: 1px solid #cfc;
    color: #3c3;
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export default function PaymentReturnHandler({ isProcessing, error, success }: PaymentReturnHandlerProps) {
    const renderContent = () => {
        if (isProcessing) {
            return (
                <>
                    <LoadingSpinner />
                    <Message>Processing your payment...</Message>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        Please wait while we confirm your transaction with PayPal.
                    </div>
                </>
            );
        }

        if (error) {
            return (
                <>
                    <ErrorMessage>
                        <strong>✗ Payment Failed</strong>
                        <br />
                        {error}
                    </ErrorMessage>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>
                        You will be redirected back to the payment page shortly.
                    </div>
                </>
            );
        }

        if (success) {
            return (
                <>
                    <SuccessMessage>
                        <strong>✓ Payment Successful!</strong>
                    </SuccessMessage>
                </>
            );
        }

        return null;
    };

    return (
        <Container>
            <ProcessingCard>
                <Title>Payment Processing</Title>
                {renderContent()}
            </ProcessingCard>
        </Container>
    );
}
