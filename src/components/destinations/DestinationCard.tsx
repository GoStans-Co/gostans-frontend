import styled from 'styled-components';
import { Link } from 'react-router-dom';

type CardShape = 'square' | 'rounded' | 'oval';

export type DestinationProps = {
    id: string;
    name: string;
    image: string;
    toursCount?: number;
    shape?: CardShape;
    location?: string;
};

const CardContainer = styled(Link)<{ $shape?: CardShape }>`
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: visible;
    text-decoration: none;

    &:hover img {
        transform: scale(1.05);
    }
`;

const ImageContainer = styled.div<{ $shape?: CardShape }>`
    overflow: hidden;
    border-radius: ${({ $shape, theme }) =>
        $shape === 'oval' ? '85px' : $shape === 'rounded' ? theme.borderRadius.lg : '0'};
    aspect-ratio: ${({ $shape }) => ($shape === 'oval' ? '170 / 230' : '1')};
    margin-bottom: 1rem;
    width: 100%;
    max-width: ${({ $shape }) => ($shape === 'oval' ? '170px' : 'none')};
    height: ${({ $shape }) => ($shape === 'oval' ? '230px' : 'auto')};
`;

// Update Image to be inside ImageContainer
const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
`;

// Remove Overlay and update text styles
const DestinationName = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    color: black;
    margin-bottom: 0.25rem;
    text-align: center;
`;

const ToursCount = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.primary};
    text-align: center;
`;

export default function DestinationCard({ id, name, image, toursCount, shape = 'square' }: DestinationProps) {
    return (
        <CardContainer to={`/destinations/${id}`}>
            <ImageContainer $shape={shape}>
                <Image src={image} alt={name} />
            </ImageContainer>
            <DestinationName>{name}</DestinationName>
            {toursCount !== undefined && <ToursCount>{toursCount}+ Tours</ToursCount>}
        </CardContainer>
    );
}
