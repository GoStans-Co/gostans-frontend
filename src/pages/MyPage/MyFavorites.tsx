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

const FavoritesContainer = styled.div`
    width: 100%;
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing.xl};
    padding-left: ${({ theme }) => theme.spacing.xl};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 1rem;
        padding-left: 1rem;
    }
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    text-align: left;
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
    padding: ${({ theme }) => theme.spacing['3xl']};
    background-color: white;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    text-align: center;
`;

const EmptyIcon = styled.div`
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.lightText};
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
    background-color: ${({ theme }) => theme.colors.grayBackground};
    padding-left: 0;
    transition: all 0.3s ease-in-out;
    transform: scale(1);

    &:hover {
        transform: scale(1.03);
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
        padding: ${({ theme }) => theme.spacing.md};
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: ${({ theme }) => theme.borderRadius.md};
    }
`;

export default function FavoritesPage() {
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
            <FavoritesContainer>
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading favorites...</div>
            </FavoritesContainer>
        );
    }

    return (
        <>
            {contextHolder}
            <FavoritesContainer>
                <PageTitle>Favorites</PageTitle>

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
