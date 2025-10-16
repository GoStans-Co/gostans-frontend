import styled from 'styled-components';
import { AccommodationProps } from '@/types/index';
import Card from '@/components/common/Card';
import { message } from 'antd';
import Button from '@/components/common/Button';
import { ArrowRightIcon } from 'lucide-react';

const SectionContainer = styled.section`
    padding-top: 2rem;
    padding-bottom: 2rem;

    padding: 4rem 2rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    gap: 1rem;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
        margin-bottom: 0.2rem;
        gap: 2rem;
    }
`;

const SectionTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 1.5rem;
    }
`;

const ViewAllButton = styled(Button)`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        text-decoration: underline;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.875rem;

        svg {
            width: 14px;
            height: 14px;
        }
    }
`;

const SectionSubtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightText};
    max-width: 1200px;
    margin: 0 auto 2rem;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.875rem;
        text-align: left;
    }
`;

const AccommodationsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    ${({ theme }) => theme.responsive.tablet} {
        grid-template-columns: repeat(2, 1fr);
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
    position: relative;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

const HoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;
    font-weight: 600;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    padding: 1rem;
    z-index: 2;
    pointer-events: none;

    ${AccommodationCard}:hover & {
        opacity: 1;
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
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: flex-start;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
    }
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

/**
 * Renders the "Popular accommodations" section with a header, subtitle, and a responsive grid of accommodation cards.
 *
 * Displays each accommodation's image, name, location, short description, and price. Clicking the "Explore All" button
 * shows an informational toast stating the feature is coming soon.
 *
 * @param accommodations - Array of accommodation items to render in the grid.
 * @returns The component's React element tree for the popular accommodations section.
 */
export default function PopularAccommodations({ accommodations }: PopularAccommodationsProps) {
    const [messageApi, contextHolder] = message.useMessage();

    const handleComingSoonClick = (feature: string) => {
        messageApi.info({
            content: `${feature} is coming soon!`,
            duration: 3,
        });
    };
    return (
        <>
            {contextHolder}
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Popular accommodations</SectionTitle>
                    <ViewAllButton
                        size="md"
                        variant="text"
                        onClick={() => handleComingSoonClick('Accommodation features')}
                    >
                        Explore All
                        <ArrowRightIcon size={18} />
                    </ViewAllButton>
                </SectionHeader>
                <SectionSubtitle>Sorted by most purchases in the past week</SectionSubtitle>

                <AccommodationsGrid>
                    {accommodations.map((accommodation) => (
                        <AccommodationCard key={accommodation.id} variant="default" padding={false}>
                            <HoverOverlay>Accommodation features is coming soon!</HoverOverlay>
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
                                    <PriceLabel>/ Person</PriceLabel>
                                </PriceContainer>
                            </CardContent>
                        </AccommodationCard>
                    ))}
                </AccommodationsGrid>
            </SectionContainer>
        </>
    );
}