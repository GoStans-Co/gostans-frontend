import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { TourProps } from '@/types/index';
import Button from '@/components/Common/Button';

const CardContainer = styled.div`
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
`;

const ImageContainer = styled.div`
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
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
    padding: 1.5rem 1.5rem 1rem;
    align-items: flex-start;
    text-align: left;
`;
const Title = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.3;
`;

const Description = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
`;

const PriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Price = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const PriceValue = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1;
`;

const PriceLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.lightText};
    line-height: 1;
`;
const CardWrapper = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
`;

export default function TourCard({
    id,
    title,
    description,
    price,
    image,
    variant = 'button',
    buttonText = 'Book Now',
}: TourProps) {
    const content = (
        <CardContainer>
            <ImageContainer>
                <Image src={image} alt={title} />
            </ImageContainer>
            <CardContent>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <PriceRow>
                    <Price>
                        <PriceValue>${price}</PriceValue>
                        <PriceLabel>/Person</PriceLabel>
                    </Price>
                    {variant === 'button' && (
                        <Button variant="light" size="mini" as={Link} to={`/tours/${id}`}>
                            {buttonText}
                        </Button>
                    )}
                </PriceRow>
            </CardContent>
        </CardContainer>
    );
    return variant === 'link' ? <CardWrapper to={`/tours/${id}`}>{content}</CardWrapper> : content;
}
