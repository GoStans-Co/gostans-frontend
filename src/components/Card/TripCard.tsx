import styled from 'styled-components';
import Button from '@/components/common/Button';
import type { TripCardProps } from '@/components/Card/types';

const CardContainer = styled.div<{ variant?: 'default' | 'compact' }>`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: white;
    overflow: hidden;
    padding: ${({ theme, variant }) => (variant === 'compact' ? theme.spacing.md : theme.spacing.lg)};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    transition: box-shadow 0.2s ease;

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.md};
    }

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: column;
        padding: 0;
        border-radius: ${({ theme }) => theme.borderRadius.lg};
    }
`;

const CardImage = styled.div<{ $imageUrl: string; $size?: 'default' | 'small' | 'large' }>`
    width: ${({ $size }) => ($size === 'small' ? '95px' : $size === 'large' ? '160px' : '120px')};
    min-width: ${({ $size }) => ($size === 'small' ? '100px' : $size === 'large' ? '160px' : '120px')};
    height: ${({ $size }) => ($size === 'small' ? '100px' : $size === 'large' ? '180px' : '125px')};
    background-image: url(${(props) => props.$imageUrl});
    background-size: cover;
    background-position: center;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.mobile} {
        width: 100%;
        height: 200px;
        min-width: unset;
        margin-bottom: 0;
        border-radius: ${({ theme }) => `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`};
    }
`;

const CardInfo = styled.div<{ $hasActions?: boolean }>`
    padding-left: ${({ theme }) => theme.spacing.lg};
    flex: 1;
    display: flex;
    flex-direction: column;
    ${({ $hasActions }) => $hasActions && 'justify-content: space-between;'}
    min-height: ${({ $hasActions }) => ($hasActions ? '100px' : 'auto')};

    ${({ theme }) => theme.responsive.mobile} {
        padding: ${({ theme }) => theme.spacing.md};
        min-height: auto;
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: row;
        gap: ${({ theme }) => theme.spacing.sm};
        align-items: stretch;
    }
`;

const CardTitle = styled.h3<{ size?: 'default' | 'large' | 'small' }>`
    font-size: ${({ theme, size }) => {
        if (size === 'large') return theme.fontSizes.xl;
        if (size === 'small') return theme.fontSizes.sm;
        return theme.fontSizes.lg;
    }};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-weight: 600;
    line-height: 1.4;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.md};
        line-height: 1.3;
        margin-bottom: ${({ theme }) => theme.spacing.sm};
        flex: 1;
    }
`;

const LeftContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    justify-content: center;
    overflow: hidden;
    align-items: flex-start;
    text-align: left;
`;

const RightContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.mobile} {
        align-items: flex-end;
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.xs};
    }
`;

const CardPrice = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    white-space: nowrap;
    padding-bottom: ${({ theme }) => theme.spacing.sm};

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: 700;
        margin-top: 0;
    }
`;

const CardActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: auto;
    padding-top: ${({ theme }) => theme.spacing.md};

    ${({ theme }) => theme.responsive.mobile} {
        justify-content: stretch;
        flex-wrap: wrap;
        margin-top: ${({ theme }) => theme.spacing.md};
        gap: ${({ theme }) => theme.spacing.sm};
        padding-top: ${({ theme }) => theme.spacing.sm};

        > * {
            flex: 1;
            min-width: 0;
        }
    }
`;

const CardSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0;
    line-height: 1.3;
`;

const StatusPill = styled.div<{ status: string }>`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: inline-block;
    font-weight: 500;
    margin-top: ${({ theme }) => theme.spacing.xs};

    ${({ status, theme }) => {
        switch (status) {
            case 'awaiting':
            case 'waiting':
                return `
                    background-color: #FFF4DE;
                    color: #FFB82E;
                `;
            case 'booked':
                return `
                    background-color: #E6F7E6;
                    color: #28A745;
                `;
            case 'all':
                return `
                    background-color: #E6F4FF;
                    color: #0D7BFF;
                `;
            default:
                return `
                    background-color: ${theme.colors.lightBackground};
                    color: ${theme.colors.text};
                `;
        }
    }}

    ${({ theme }) => theme.responsive.mobile} {
        font-size: 11px;
        padding: 4px 8px;
        margin-top: ${({ theme }) => theme.spacing.xs};
    }
`;

const CardWrapper = styled.div`
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
    }
`;

const TourActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    ${({ theme }) => theme.responsive.mobile} {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.md};
        align-items: stretch;
    }
`;

const TourActionButtons = styled.div`
    display: flex;
    gap: 1rem;

    ${({ theme }) => theme.responsive.mobile} {
        gap: ${({ theme }) => theme.spacing.md};
        justify-content: flex-start;
    }
`;

const CustomContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

const TourDetails = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.lightText};
    line-height: 1.4;

    ${({ theme }) => theme.responsive.mobile} {
        font-size: ${({ theme }) => theme.fontSizes.xs};
    }
`;

/**
 * TripCard - A versatile Molecule Component for displaying trip or tour information.
 * @param {TripCardProps} props - Props for configuring the TripCard
 * @param {string} props.image - URL of the image to display
 * @param {string} props.title - Title of the trip or tour
 * @param {string} [props.subtitle] - Subtitle or brief description
 * @param {string} [props.date] - Date or date range for the trip
 * @param {object} [props.meta] - Additional metadata like duration and people count
 * @param {() => void} [props.onEdit] - Callback when edit action is triggered
 * @param {() => void} [props.onRemove] - Callback when remove action is triggered
 */
export default function TripCard(props: TripCardProps) {
    const { image, title, subtitle, date, meta, onEdit, onRemove, price, status } = props;
    const { variant = 'default', imageSize = 'default', titleSize = 'default', onClick } = props;

    const hasActions =
        !!props.actions ||
        !!props.actionButtons?.length ||
        !!status ||
        !!onEdit ||
        !!onRemove ||
        !!price ||
        !!props.pricing;

    const renderActionButtons = () => {
        const hasEditOrRemove = onEdit || onRemove;
        const hasLegacyButtons = props.actionButtons?.length;

        if (!hasEditOrRemove && !hasLegacyButtons) return null;

        return (
            <TourActionButtons>
                {onEdit && (
                    <Button variant="text" size="sm" onClick={onEdit}>
                        Edit
                    </Button>
                )}
                {onRemove && (
                    <Button variant="text" size="sm" onClick={onRemove}>
                        Remove
                    </Button>
                )}
                {hasLegacyButtons &&
                    props.actionButtons!.map((button, index) => (
                        <Button key={index} variant={button.variant || 'text'} size={'md'} onClick={button.onClick}>
                            {button.label}
                        </Button>
                    ))}
            </TourActionButtons>
        );
    };

    const renderCustomContent = () => {
        if (meta?.duration || meta?.peopleCount) {
            const parts = [];
            if (meta.duration) parts.push(meta.duration);
            if (meta.peopleCount) parts.push(`${meta.peopleCount} people`);

            return (
                <CustomContent>
                    <TourDetails>{parts.join(' • ')}</TourDetails>
                </CustomContent>
            );
        }

        if (props.customContentData?.details) {
            return (
                <CustomContent>
                    <TourDetails>{props.customContentData.details}</TourDetails>
                </CustomContent>
            );
        }

        return null;
    };

    const renderNewActions = () => {
        const hasNewActions = onEdit || onRemove || props.actionButtons?.length || price || props.pricing;

        if (!hasNewActions) return null;

        return <TourActions>{renderActionButtons()}</TourActions>;
    };

    return (
        <CardWrapper onClick={onClick}>
            <CardContainer variant={variant}>
                <CardImage $imageUrl={image} $size={imageSize} />
                <CardInfo $hasActions={hasActions}>
                    <div>
                        <CardHeader>
                            <LeftContent>
                                <CardTitle size={titleSize}>{title}</CardTitle>
                                {subtitle && (
                                    <CardSubtitle>
                                        {subtitle.length > 150 ? `${subtitle.slice(0, 150)}...` : subtitle}
                                    </CardSubtitle>
                                )}
                                {date && <CardSubtitle>{date}</CardSubtitle>}
                            </LeftContent>

                            <RightContent>
                                {price !== undefined && (
                                    <>
                                        <CardPrice>${Math.round(price)}</CardPrice>
                                        {status && (
                                            <StatusPill status={status}>
                                                {status === 'waiting'
                                                    ? 'Awaiting'
                                                    : status.charAt(0).toUpperCase() + status.slice(1)}
                                            </StatusPill>
                                        )}
                                    </>
                                )}
                            </RightContent>
                        </CardHeader>

                        {/* render custom content at top if specified */}
                        {props.customContentData?.position === 'top' && renderCustomContent()}

                        {/* legacy custom content support */}
                        {props.customContent}

                        {/* render custom content at bottom (default) */}
                        {(!props.customContentData?.position || props.customContentData?.position === 'bottom') &&
                            renderCustomContent()}
                    </div>

                    {/* legacy actions support */}
                    {props.actions && <CardActions>{props.actions}</CardActions>}

                    {/* new structured actions */}
                    {renderNewActions()}
                </CardInfo>
            </CardContainer>
        </CardWrapper>
    );
}
