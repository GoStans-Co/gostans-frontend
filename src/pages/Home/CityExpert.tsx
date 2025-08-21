import styled from 'styled-components';
import Button from '@/components/common/Button';
import { Link } from 'react-router-dom';

const ExpertSectionContainer = styled.section`
    display: flex;
    background-color: ${({ theme }) => theme.colors.lightBackground};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    margin: 3rem 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        margin: 2rem 1rem;
    }
`;

const ExpertContent = styled.div`
    flex: 1;
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        text-align: center;
        align-items: center;
        padding-top: 2rem;
    }

    ${({ theme }) => theme.responsive.tablet} {
        padding: 2rem;
        padding-top: 2.5rem;
    }
`;

const ExpertTitle = styled.h2`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 2rem;
        text-align: center;
    }

    ${({ theme }) => theme.responsive.tablet} {
        font-size: 2.2rem;
    }
`;

const ExpertDescription = styled.p`
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 1.5rem;
    max-width: 90%;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 1rem;
        text-align: center;
        max-width: 100%;
        margin-bottom: 1rem;
    }
`;

const ExpertImage = styled.div`
    flex: 1;
    background-image: url('https://images.unsplash.com/photo-1528127269322-539801943592');
    background-size: cover;
    background-position: center;
    min-height: 300px;

    ${({ theme }) => theme.responsive.maxMobile} {
        min-height: 200px;
        order: -1;
    }

    ${({ theme }) => theme.responsive.tablet} {
        min-height: 250px;
    }
`;

const ButtonWrapper = styled.div`
    width: 180px;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        text-align: center;
    }
`;

export default function CityExpertSection() {
    return (
        <ExpertSectionContainer>
            <ExpertContent>
                <ExpertTitle>Know your city?</ExpertTitle>
                <ExpertDescription>
                    Join 2000+ locals & 1200+ contributors from 3000 cities where you can share your knowledge and help
                    others discover the best of your city and earn money while doing it.
                </ExpertDescription>
                <ButtonWrapper>
                    <Button variant="secondary" size="xs">
                        <Link to="become-partner">Become a Local Expert</Link>
                    </Button>
                </ButtonWrapper>
            </ExpertContent>
            <ExpertImage />
        </ExpertSectionContainer>
    );
}
