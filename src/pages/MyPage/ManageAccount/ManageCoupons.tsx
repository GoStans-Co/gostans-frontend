import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { Tag, Copy, Check } from 'lucide-react';
import Card from '@/components/common/Card';
import { message } from 'antd';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loading.json';

type Coupon = {
    id: string;
    code: string;
    discount: string;
    title: string;
    description: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'upcoming';
};

const CouponsContainer = styled.div`
    width: 100%;
    max-width: 100%;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 0;
    }
`;

const PageHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${({ theme }) => theme.fontSizes.xl};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const PageSubtitle = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.muted};
    margin: 0;
`;

const CouponsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const CouponCard = styled(Card)<{ $isExpired?: boolean }>`
    padding: ${({ theme }) => theme.spacing.xl};
    position: relative;
    transition: all 0.3s ease;
    opacity: ${({ $isExpired }) => ($isExpired ? 0.6 : 1)};
    background: ${({ theme, $isExpired }) =>
        $isExpired ? theme.colors.lightBackground : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
    color: white;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.xl};
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: translate(30%, -30%);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.lg};
    }
`;

const CouponHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CouponIcon = styled.div`
    width: 48px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borderRadius.md};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CouponBadge = styled.span<{ $type: 'active' | 'expired' | 'upcoming' }>`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    background-color: ${({ $type }) => ($type === 'active' ? '#10b981' : $type === 'expired' ? '#ef4444' : '#f59e0b')};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-weight: 600;
    text-transform: uppercase;
`;

const CouponDiscount = styled.h2`
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
    font-weight: 700;
    margin: ${({ theme }) => theme.spacing.md} 0;
    color: white;
`;

const CouponTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: 600;
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: white;
`;

const CouponDescription = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
    line-height: 1.5;
`;

const CouponFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.lg};
    border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const CouponCode = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const CodeText = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: 600;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
    color: white;
`;

const CopyButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
`;

const ExpiryText = styled.span`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: rgba(255, 255, 255, 0.8);
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem ${({ theme }) => theme.spacing['3xl']};
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 5rem ${({ theme }) => theme.spacing.xl};
    }
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.lightText};

    ${({ theme }) => theme.responsive.maxMobile} {
        margin-bottom: 0;
    }
`;

const EmptyTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.primary};
`;

const EmptyText = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.lightText};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const LoadingAnimationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    flex-direction: column;
    gap: 1rem;
`;

export default function ManageCoupons() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const loadCoupons = async () => {
            /**
             * i will soon replace this with actual endpoint
             * const data = await couponsService.getAll();
             */
            setCoupons([]);
            setIsLoading(false);
        };
        loadCoupons();
    }, []);

    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            messageApi.success('Coupon code copied!');
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
            messageApi.error('Failed to copy code');
        }
    };

    if (isLoading) {
        return (
            <LoadingAnimationContainer>
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ width: 120, height: 120, marginBottom: 24 }}
                />
            </LoadingAnimationContainer>
        );
    }

    return (
        <>
            {contextHolder}
            <CouponsContainer>
                <PageHeader>
                    <PageTitle>Coupons</PageTitle>
                    <PageSubtitle>Check your available discounts</PageSubtitle>
                </PageHeader>

                {coupons.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <Tag size={64} />
                        </EmptyIcon>
                        <EmptyTitle>No coupons available!</EmptyTitle>
                        <EmptyText>You don't have any coupons at the moment. Check back later!</EmptyText>
                        <Button variant="primary" onClick={() => (window.location.href = '/searchTrips')}>
                            Explore destinations
                        </Button>
                    </EmptyState>
                ) : (
                    <CouponsGrid>
                        {coupons.map((coupon) => (
                            <CouponCard key={coupon.id} $isExpired={coupon.status === 'expired'}>
                                <CouponHeader>
                                    <CouponIcon>
                                        <Tag size={24} />
                                    </CouponIcon>
                                    <CouponBadge $type={coupon.status}>{coupon.status}</CouponBadge>
                                </CouponHeader>
                                <CouponDiscount>{coupon.discount}</CouponDiscount>
                                <CouponTitle>{coupon.title}</CouponTitle>
                                <CouponDescription>{coupon.description}</CouponDescription>
                                <CouponFooter>
                                    <CouponCode>
                                        <CodeText>{coupon.code}</CodeText>
                                        <CopyButton onClick={() => handleCopyCode(coupon.code)}>
                                            {copiedCode === coupon.code ? <Check size={16} /> : <Copy size={16} />}
                                        </CopyButton>
                                    </CouponCode>
                                    <ExpiryText>Exp: {coupon.expiryDate}</ExpiryText>
                                </CouponFooter>
                            </CouponCard>
                        ))}
                    </CouponsGrid>
                )}
            </CouponsContainer>
        </>
    );
}
