import styled from 'styled-components';

type SkeletonLoaderProps = {
    type: 'destination' | 'tour' | 'custom';
    count?: number;
    className?: string;
};

const Container = styled.div<{ type: string }>`
    display: ${({ type }) => (type === 'destination' ? 'flex' : 'grid')};
    gap: ${({ theme, type }) => (type === 'destination' ? theme.spacing['2xl'] : theme.spacing['2xl'])};
    max-width: ${({ type }) => (type === 'destination' ? '1200px' : '1200px')};
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};

    ${({ type }) =>
        type === 'tour' &&
        `
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); 
    `}

    ${({ theme }) => theme.responsive.maxMobile} {
        gap: ${({ theme, type }) => (type === 'destination' ? theme.spacing.sm : theme.spacing.xl)};
        padding: 0 ${({ theme }) => theme.spacing.lg};

        ${({ type }) =>
            type === 'tour' &&
            `
            grid-template-columns: 1fr; 
        `}
    }
`;

const DestinationSkeleton = styled.div`
    flex: 0 0 auto;
    width: 170px;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 90px;
    }

    .skeleton-image {
        width: 100%;
        height: 230px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 85px;
        margin-bottom: ${({ theme }) => theme.spacing.lg};

        ${({ theme }) => theme.responsive.maxMobile} {
            height: 120px;
            border-radius: 45px;
            margin-bottom: ${({ theme }) => theme.spacing.sm};
        }
    }

    .skeleton-text {
        height: 20px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }

    .skeleton-count {
        height: 16px;
        width: 70%;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;

const TourSkeleton = styled.div`
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.sm};

    .skeleton-image {
        height: 200px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }

    .skeleton-content {
        padding: ${({ theme }) => theme.spacing.xl};
    }

    .skeleton-title {
        height: 24px;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }

    .skeleton-description {
        height: 16px;
        width: 70%;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        margin-bottom: ${({ theme }) => theme.spacing.lg};
    }

    .skeleton-price {
        height: 20px;
        width: 50%;
        background: linear-gradient(
            90deg,
            ${({ theme }) => theme.colors.lightBackground} 25%,
            ${({ theme }) => theme.colors.border} 50%,
            ${({ theme }) => theme.colors.lightBackground} 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    @keyframes loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }
`;

export default function SkeletonLoader({ type, count = 6, className }: SkeletonLoaderProps) {
    const SkeletonItem = type === 'destination' ? DestinationSkeleton : TourSkeleton;

    return (
        <Container type={type} className={className}>
            {[...Array(count)].map((_, index) => (
                <SkeletonItem key={index}>
                    <div className="skeleton-image" />
                    {type === 'destination' ? (
                        <>
                            <div className="skeleton-text" />
                            <div className="skeleton-count" />
                        </>
                    ) : (
                        <div className="skeleton-content">
                            <div className="skeleton-title" />
                            <div className="skeleton-description" />
                            <div className="skeleton-price" />
                        </div>
                    )}
                </SkeletonItem>
            ))}
        </Container>
    );
}
