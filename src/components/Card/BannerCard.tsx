import styled from 'styled-components';
import { Link } from 'react-router-dom';

type BannerCardProps = {
    id: number;
    title: string;
    shortDescription: string;
    price: string;
    mainImage: string;
    country: string;
    currency: string;
    uuid: string;
    tourType?: {
        id: number;
        name: string;
    };
};

const BannerContainer = styled.div`
    position: relative;
    width: 100%;
    height: 280px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    box-shadow: ${({ theme }) => theme.shadows.md};

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.xl};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        height: 300px;
    }
`;

const ImageSection = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const BackgroundImage = styled.div<{ $backgroundImage: string }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${(props) => props.$backgroundImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform ${({ theme }) => theme.transitions.slow};

    ${BannerContainer}:hover & {
        transform: scale(1.05);
    }
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.6) 100%);
    z-index: 1;
`;

const ImageContent = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const TopImageContent = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
`;

const PriceBadge = styled.div`
    background: ${({ theme }) => theme.colors.accent};
    color: white;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    box-shadow: ${({ theme }) => theme.shadows.md};
    white-space: nowrap;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    }
`;

const BottomImageContent = styled.div`
    display: flex;
    align-items: flex-end;
`;

const LocationInfo = styled.div`
    color: white;
`;

const LocationBadge = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    &::before {
        content: '✈️';
        font-size: ${({ theme }) => theme.fontSizes.sm};
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const LocationTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    line-height: 1.2;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    color: white;
    max-width: 80%;
    display: block;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

const InfoPanel = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    background: white;
    padding: ${({ theme }) => theme.spacing.md};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateY(100%);
    transition: transform ${({ theme }) => theme.transitions.default};
    z-index: 3;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);

    ${BannerContainer}:hover & {
        transform: translateY(0);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.sm};
        height: 40%;
    }
`;

const PanelHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0;
`;

const RouteInfo = styled.div`
    flex: 1;
`;

const RouteText = styled.div`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

const DestinationTitle = styled.h4`
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    font-family: ${({ theme }) => theme.typography.fontFamily.display};
    line-height: 1.2;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
    }
`;

const NextArrow = styled.div`
    color: ${({ theme }) => theme.colors.lightText};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    display: flex;
    align-items: center;
    transition: ${({ theme }) => theme.transitions.fast};

    ${BannerContainer}:hover & {
        color: ${({ theme }) => theme.colors.primary};
        transform: translateX(4px);
    }
`;

const PriceInfo = styled.div`
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    margin-top: 0;
    text-align: left;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        margin-top: ${({ theme }) => theme.spacing.xs};
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    display: block;
    width: 100%;
    height: 100%;
`;

/**
 * BannerCard -  Atom Component
 * @description A card component that displays
 * a banner with an image, title, price, and location information.
 * @param {BannerCardProps} props - The properties for the BannerCard component.
 */
export default function BannerCard({ title, price, mainImage, currency, uuid }: BannerCardProps) {
    const formatPrice = (price: string, currency: string) => {
        const currencySymbols: { [key: string]: string } = {
            USD: '$',
            EUR: '€',
            KRW: '₩',
            JPY: '¥',
            GBP: '£',
        };

        const symbol = currencySymbols[currency] || currency;

        if (
            price.includes('$') ||
            price.includes('€') ||
            price.includes('₩') ||
            price.includes('¥') ||
            price.includes('£')
        ) {
            return price;
        }

        const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''));
        if (!isNaN(numericPrice)) {
            return `${symbol}${numericPrice.toLocaleString()}`;
        }

        return `${symbol}${price}`;
    };

    /* we get city from title if it contains comma */
    const getLocationParts = () => {
        if (title.includes(',')) {
            const parts = title.split(',');
            return {
                city: parts[0].trim(),
                country: parts[1].trim(),
            };
        }
        return {
            city: title,
            country: title,
        };
    };

    const { city } = getLocationParts();

    return (
        <StyledLink to={`/searchTrips/${uuid}`}>
            <BannerContainer>
                <ImageSection>
                    <BackgroundImage $backgroundImage={mainImage || ''} />
                    <ImageOverlay />

                    <ImageContent>
                        <TopImageContent>
                            <PriceBadge>Tickets from {formatPrice(price, currency)}</PriceBadge>
                        </TopImageContent>

                        <BottomImageContent>
                            <LocationInfo>
                                <LocationBadge>{title}</LocationBadge>
                                <LocationTitle>{city}</LocationTitle>
                            </LocationInfo>
                        </BottomImageContent>
                    </ImageContent>

                    <InfoPanel>
                        <PanelHeader>
                            <RouteInfo>
                                <RouteText>{title}</RouteText>
                                <DestinationTitle>{city}</DestinationTitle>
                            </RouteInfo>
                            <NextArrow>›</NextArrow>
                        </PanelHeader>

                        <PriceInfo>Tickets from {formatPrice(price, currency)}</PriceInfo>
                    </InfoPanel>
                </ImageSection>
            </BannerContainer>
        </StyledLink>
    );
}
