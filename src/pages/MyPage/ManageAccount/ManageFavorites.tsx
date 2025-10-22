import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/common/Button';
import { Heart, HeartOff } from 'lucide-react';
import Card from '@/components/common/Card';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { wishlistAtom } from '@/atoms/wishlist';
import { message } from 'antd';
import { useApiServices } from '@/services/api';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '@/assets/animation/loading.json';

const FavoritesContainer = styled.div`
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

const FavoritesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    margin-left: 0;
    padding-left: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        grid-template-columns: 1fr;
        gap: ${({ theme }) => theme.spacing.md};
    }
`;

const FavoriteImage = styled.div<{ imageUrl: string }>`
    background-image: url(${({ imageUrl }) => imageUrl});
    background-size: cover;
    background-position: center;
    height: 200px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    position: relative;
    overflow: hidden;

    &:hover {
        img {
            transform: scale(1.05);
        }
    }
`;

const HeartButton = styled.button`
    position: absolute;
    top: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.accent};
    z-index: 10;

    &:hover {
        background-color: white;
    }
`;

const FavoriteContent = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 0;
    padding-right: 0;
    width: 100%;
`;

const FavoriteTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
`;

const FavoriteLocation = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ToursCount = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 300;
    margin: 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem ${({ theme }) => theme.spacing['4xl']};
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

const WrappedCard = styled(Card)`
    padding-left: 0;
    transition: all 0.3s ease-in-out;
    transform: scale(1);

    &:hover {
        transform: scale(1.03);
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${({ theme }) => theme.spacing.md};
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: ${({ theme }) => theme.borderRadius.md};
    }
`;

const LoadingAnimationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    flex-direction: column;
    gap: 1rem;
`;

/**
 * FavoritesPage - Page Component
 * @description This component displays the user's favorite destinations.
 * It allows users to view and remove destinations from their favorites list.
 */
export default function ManageFavorites() {
    const wishlist = useRecoilValue(wishlistAtom);
    const { wishlist: wishlistService } = useApiServices();
    const setWishlist = useSetRecoilState(wishlistAtom);
    const [messageApi, contextHolder] = message.useMessage();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                await wishlistService.getWishlist();
            } catch (error) {
                console.error('Failed to load wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadWishlist();
    }, []);

    const removeFavorite = async (tourUuid: string) => {
        try {
            await wishlistService.removeFromWishlist(tourUuid);
            setWishlist((prev) => prev.filter((item) => item.uuid !== tourUuid));
            messageApi.success('Removed successfully!');
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
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
            <FavoritesContainer>
                <PageHeader>
                    <PageTitle>Favorites</PageTitle>
                    <PageSubtitle>Manage your payment options</PageSubtitle>
                </PageHeader>

                {wishlist.length === 0 ? (
                    <EmptyState>
                        <EmptyIcon>
                            <HeartOff size={64} />
                        </EmptyIcon>
                        <EmptyTitle>No favorites yet!</EmptyTitle>
                        <EmptyText>
                            You haven't added any destinations to your favorites yet. Explore our destinations and save
                            your favorites!
                        </EmptyText>
                        <Button variant="primary" onClick={() => (window.location.href = '/destinations')}>
                            Explore destinations
                        </Button>
                    </EmptyState>
                ) : (
                    <FavoritesGrid>
                        {wishlist.map((favorite) => (
                            <Link
                                to={`/searchTrips/${favorite.uuid}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                                key={favorite.id}
                            >
                                <WrappedCard key={favorite.uuid}>
                                    <FavoriteImage imageUrl={favorite.mainImage}>
                                        <HeartButton onClick={() => removeFavorite(favorite.uuid)}>
                                            <Heart fill="currentColor" />
                                        </HeartButton>
                                    </FavoriteImage>
                                    <FavoriteContent>
                                        <FavoriteTitle>{favorite.title}</FavoriteTitle>
                                        <FavoriteLocation>{favorite.city}</FavoriteLocation>
                                        <ToursCount>{favorite.tourType}</ToursCount>
                                    </FavoriteContent>
                                </WrappedCard>
                            </Link>
                        ))}
                    </FavoritesGrid>
                )}
            </FavoritesContainer>
        </>
    );
}
