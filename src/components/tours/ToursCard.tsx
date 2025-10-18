import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { TourPropsResponse } from '@/services/api/tours';
import { formatCurrency } from '@/utils/general/formatCurrency';

const ImageContainer = styled.div`
    width: 100%;
    height: 160px;
    overflow: hidden;
    position: relative;

    ${({ theme }) => theme.responsive.minTablet} {
        height: 180px;
    }

    ${({ theme }) => theme.responsive.mobile} {
        height: 140px;
    }
`;

const CardContainer = styled.div`
    border: 0.5px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    background-color: white;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
    padding-bottom: 0;
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    min-width: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        max-width: none;
        width: 100%;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;

    ${CardContainer}:hover & {
        transform: scale(1.05);
    }
`;

const CardContent = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    align-items: flex-start;
    text-align: left;
    min-width: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const Title = styled.h3`
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 2.6em;
    word-wrap: break-word;
    word-break: break-word;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        line-height: 1.2;
        min-height: 2.4em;
        -webkit-line-clamp: 2;
    }

    ${({ theme }) => theme.responsive.minTablet} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

const Description = styled.p`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    flex: 1;
    word-wrap: break-word;
    word-break: break-word;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 0.63rem;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        line-height: 1.3;
        -webkit-line-clamp: 2;
    }

    ${({ theme }) => theme.responsive.minTablet} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const PriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: wrap;
    min-width: 0;
    margin-top: auto;
    width: 100%;
    box-sizing: border-box;

    > :last-child {
        flex-shrink: 0;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        flex-direction: column;
        align-items: stretch;
        gap: ${({ theme }) => theme.spacing.sm};

        > :last-child {
            width: 100%;
            display: flex;
            justify-content: flex-start;
        }
    }
`;

const Price = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.xs};
    align-items: baseline;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: 4px;
        flex-shrink: 0;
        justify-content: flex-start;
        width: 100%;
        text-align: left;
        align-items: baseline;
    }
`;

const PriceValue = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
    white-space: nowrap;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 1rem;
    }

    ${({ theme }) => theme.responsive.minTablet} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
    }
`;

const PriceLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.lightText};
    line-height: 1;
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 10px;
    }

    ${({ theme }) => theme.responsive.minTablet} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }
`;

const CardWrapper = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
`;

/**
 * TourCard - Molecule Component
 * @description A card component to display tour information
 * with an image, title, description, price, and a call-to-action button or link.
 * @param {TourPropsResponse} props - The properties of the tour card.
 */
export default function TourCard({
    title,
    shortDescription: description,
    price,
    mainImage: image,
    variant = 'button',
    buttonText = 'Book Now',
    uuid,
}: TourPropsResponse) {
    const content = (
        <CardContainer>
            <ImageContainer>
                <Image src={image ?? undefined} alt={title} />
            </ImageContainer>
            <CardContent>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <PriceRow>
                    <Price>
                        <PriceValue>{formatCurrency(Number(price))}</PriceValue>
                        <PriceLabel>/ Person</PriceLabel>
                    </Price>
                    {variant === 'button' && (
                        <Button variant="light" size="mini" as={Link} to={`/searchTrips/${uuid}`}>
                            {buttonText}
                        </Button>
                    )}
                </PriceRow>
            </CardContent>
        </CardContainer>
    );
    return variant === 'link' ? <CardWrapper to={`/searchTrips/${uuid}`}>{content}</CardWrapper> : content;
}
