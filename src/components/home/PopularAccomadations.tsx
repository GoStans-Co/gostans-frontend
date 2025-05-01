import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AccommodationProps } from '@/types/index';
import Card from '@/components/common/Card';

const SectionContainer = styled.section`
    padding: 4rem 2rem;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        font-size: 1.75rem;
    }
`;

const ViewAllLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        text-decoration: underline;
    }
`;

const SectionSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 1200px;
    margin: 0 auto 2rem;
`;

const AccommodationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        grid-template-columns: 1fr;
    }
`;

const AccommodationCard = styled(Card)`
    overflow: hidden;
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

const CardImageContainer = styled.div`
    width: 100%;
    height: 200px;
    overflow: hidden;
`;

const CardImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;

    ${AccommodationCard}:hover & {
        transform: scale(1.05);
    }
`;

const CardContent = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    text-align: left;
`;

const AccommodationTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
`;

const AccommodationLocation = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const AccommodationDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: 1rem;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
`;

const Price = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
`;

const PriceLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
`;

type PopularAccommodationsProps = {
    accommodations: AccommodationProps[];
};

export default function PopularAccommodations({ accommodations }: PopularAccommodationsProps) {
    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>Popular accommodations</SectionTitle>
                <ViewAllLink to="/accommodations">
                    Explore All
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 18L15 12L9 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </ViewAllLink>
            </SectionHeader>
            <SectionSubtitle>Sorted by most purchases in the past week</SectionSubtitle>

            <AccommodationsGrid>
                {accommodations.map((accommodation) => (
                    <AccommodationCard key={accommodation.id} variant="default" padding={false}>
                        <CardImageContainer>
                            <CardImage src={accommodation.image} alt={accommodation.name} />
                        </CardImageContainer>
                        <CardContent>
                            <AccommodationTitle>{accommodation.name}</AccommodationTitle>
                            <AccommodationLocation>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <circle
                                        cx="12"
                                        cy="10"
                                        r="3"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {accommodation.location}
                            </AccommodationLocation>
                            <AccommodationDescription>{accommodation.description}</AccommodationDescription>
                            <PriceContainer>
                                <Price>${accommodation.price}</Price>
                                <PriceLabel>/Person</PriceLabel>
                            </PriceContainer>
                        </CardContent>
                    </AccommodationCard>
                ))}
            </AccommodationsGrid>
        </SectionContainer>
    );
}
