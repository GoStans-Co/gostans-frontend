import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div<{ variant?: 'default' | 'compact' }>`
    display: flex;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: white;
    overflow: hidden;
    padding: ${({ theme, variant }) => (variant === 'compact' ? theme.spacing.md : theme.spacing.lg)};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
    }
`;

const CardImage = styled.div<{ imageUrl: string; size?: 'default' | 'small' }>`
    width: ${({ size }) => (size === 'small' ? '80px' : '90px')};
    min-width: ${({ size }) => (size === 'small' ? '80px' : '90px')};
    height: ${({ size }) => (size === 'small' ? '80px' : '90px')};
    background-image: url(${(props) => props.imageUrl});
    background-size: cover;
    background-position: center;
    border-radius: ${({ theme }) => theme.borderRadius.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 90px;
        height: 90px;
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }
`;

const CardInfo = styled.div<{ hasActions?: boolean }>`
    padding-left: ${({ theme }) => theme.spacing.lg};
    flex: 1;
    display: flex;
    flex-direction: column;
    ${({ hasActions }) => hasActions && 'justify-content: space-between;'}
    min-height: ${({ hasActions }) => (hasActions ? '90px' : 'auto')};
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        flex-direction: column;
        gap: ${({ theme }) => theme.spacing.sm};
    }
`;

const CardTitle = styled.h3<{ size?: 'default' | 'large' }>`
    font-size: ${({ theme, size }) => (size === 'large' ? '1.25rem' : theme.fontSizes.lg)};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-weight: 600;
`;

const CardSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0;
    line-height: 1.3;
`;

const CardPrice = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
    margin-left: ${({ theme }) => theme.spacing.md};
    white-space: nowrap;
`;

const StatusPill = styled.div<{ status: string }>`
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: inline-block;
    font-weight: 500;

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
`;

const CardActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: auto;
    padding-top: ${({ theme }) => theme.spacing.md};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        justify-content: flex-end;
    }
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    button {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 1px solid ${({ theme }) => theme.colors.border};
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;

        &:hover {
            background-color: ${({ theme }) => theme.colors.lightBackground};
        }
    }
`;

export type TripCardProps = {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    date?: string;
    price?: number;
    status?: 'waiting' | 'booked' | 'complete' | 'cancelled' | 'all';
    variant?: 'default' | 'compact';
    imageSize?: 'default' | 'small';
    titleSize?: 'default' | 'large';
    showQuantityControls?: boolean;
    quantity?: number;
    onQuantityChange?: (quantity: number) => void;
    actions?: React.ReactNode;
    customContent?: React.ReactNode;
    shortDescription?: string;
};

export default function TripCard({
    image,
    title,
    subtitle,
    date,
    price,
    status,
    variant = 'default',
    imageSize = 'default',
    titleSize = 'default',
    showQuantityControls = false,
    quantity = 1,
    onQuantityChange,
    actions,
    customContent,
}: TripCardProps) {
    const hasActions = !!actions || !!status;

    return (
        <CardContainer variant={variant}>
            <CardImage imageUrl={image} size={imageSize} />
            <CardInfo hasActions={hasActions}>
                <div>
                    <CardHeader>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                width: '100%',
                            }}
                        >
                            <CardTitle size={titleSize}>{title}</CardTitle>
                            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
                            {date && <CardSubtitle>{date}</CardSubtitle>}
                        </div>
                        {showQuantityControls ? (
                            <QuantityControls>
                                <span>Adult</span>
                                <button onClick={() => onQuantityChange?.(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => onQuantityChange?.(quantity + 1)}>+</button>
                            </QuantityControls>
                        ) : price !== undefined ? (
                            <CardPrice>${price}</CardPrice>
                        ) : null}
                    </CardHeader>

                    {status && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <StatusPill status={status}>
                                {status === 'waiting' ? 'Awaiting' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </StatusPill>
                        </div>
                    )}

                    {customContent}
                </div>

                {actions && <CardActions>{actions}</CardActions>}
            </CardInfo>
        </CardContainer>
    );
}
