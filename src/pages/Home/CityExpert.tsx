import styled from 'styled-components';
import Button from '@/components/Common/Button';

const ExpertSectionContainer = styled.section`
    display: flex;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    margin: 3rem 0;
`;

const ExpertContent = styled.div`
    flex: 1;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: 2rem;
    }
`;

const ExpertTitle = styled.h2`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 2rem;
    }
`;

const ExpertDescription = styled.p`
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 2rem;
    max-width: 90%;
`;

const ExpertImage = styled.div`
    flex: 1;
    background-image: url('https://images.unsplash.com/photo-1528127269322-539801943592');
    background-size: cover;
    background-position: center;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        display: none;
    }
`;

const ButtonWrapper = styled.div`
    width: 180px;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 100%;
    }
`;

export default function CityExpertSection() {
    return (
        <ExpertSectionContainer>
            <ExpertContent>
                <ExpertTitle>Know your city?</ExpertTitle>
                <ExpertDescription>Join 2000+ locals & 1200+ contributors from 3000 cities</ExpertDescription>
                <ButtonWrapper>
                    <Button variant="secondary" size="xs">
                        Become a Local Expert
                    </Button>
                </ButtonWrapper>
            </ExpertContent>
            <ExpertImage />
        </ExpertSectionContainer>
    );
}
