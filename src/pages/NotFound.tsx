import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';

const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    min-height: 90vh;
`;

const ErrorCode = styled.h1`
    font-size: 6rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 4rem;
    }
`;

const ErrorTitle = styled.h2`
    font-size: 2rem;
    margin-bottom: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.5rem;
    }
`;

const ErrorDescription = styled.p`
    max-width: 500px;
    margin: 0 auto 2rem;
    color: ${({ theme }) => theme.colors.lightText};
    font-size: 1.1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1rem;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

export default function NotFoundPage() {
    return (
        <NotFoundContainer>
            <ErrorCode>404</ErrorCode>
            <ErrorTitle>Page Not Found</ErrorTitle>
            <ErrorDescription>
                The page you're looking for might have been removed, had its name changed, or is temporarily
                unavailable.
            </ErrorDescription>
            <ButtonsContainer>
                <Button variant="primary" as={Link} to="/">
                    Go to Homepage
                </Button>
                <Button variant="outline" as={Link} to="/destinations">
                    Explore Destinations
                </Button>
            </ButtonsContainer>
        </NotFoundContainer>
    );
}
