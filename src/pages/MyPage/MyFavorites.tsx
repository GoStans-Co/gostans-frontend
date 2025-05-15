import { useState } from 'react';
import styled from 'styled-components';
import Button from '@/components/Common/Button';
import { destinations } from '@/data/mockData';
import { Heart, HeartOff } from 'lucide-react';
import Card from '@/components/Common/Card';

type FavoriteDestination = {
    id: string;
    name: string;
    image: string;
    location: string;
    toursCount: number;
};

const FavoritesContainer = styled.div`
    width: 100%;
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    text-align: left;
`;

const FavoritesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: ${({ theme }) => theme.spacing.xs};
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
    justify-content: center;
    align-items: flex-start;
    padding-left: 0;
`;

const FavoriteTitle = styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text};
`;

const FavoriteLocation = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.lightText};
    margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

const ToursCount = styled.p`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    margin: 0;
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

const initialFavorites = destinations.map((destination) => ({
    ...destination,
    location: destination.location || destination.name,
    toursCount: destination.toursCount || 0,
}));

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteDestination[]>(initialFavorites);
    const [showEmptyState, setShowEmptyState] = useState(false);

    const removeFavorite = (id: string) => {
        setFavorites(favorites.filter((fav) => fav.id !== id));
        if (favorites.length <= 1) {
            setShowEmptyState(true);
        }
    };

    return (
        <FavoritesContainer>
            <PageTitle>Favorites</PageTitle>

            {showEmptyState || favorites.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>
                        <HeartOff size={64} />
                    </EmptyIcon>
                    <EmptyTitle>No favorites yet!</EmptyTitle>
                    <EmptyText>
                        You haven't added any destinations to your favorites yet. Explore our destinations and save your
                        favorites!
                    </EmptyText>
                    <Button variant="primary">Explore destinations</Button>
                </EmptyState>
            ) : (
                <FavoritesGrid>
                    {favorites.map((favorite) => (
                        <Card key={favorite.id} style={{ backgroundColor: '#f0f3f5' }}>
                            <FavoriteImage imageUrl={favorite.image}>
                                <HeartButton onClick={() => removeFavorite(favorite.id)}>
                                    <Heart fill="currentColor" />
                                </HeartButton>
                            </FavoriteImage>
                            <FavoriteContent>
                                <FavoriteTitle>{favorite.name}</FavoriteTitle>
                                <FavoriteLocation>{favorite.location}</FavoriteLocation>
                                <ToursCount>{favorite.toursCount}+ Tours</ToursCount>
                            </FavoriteContent>
                        </Card>
                    ))}
                </FavoritesGrid>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button
                    variant="outline"
                    onClick={() => setShowEmptyState(!showEmptyState)}
                    style={{ marginTop: '20px' }}
                >
                    Toggle Empty State (Demo)
                </Button>
            </div>
        </FavoritesContainer>
    );
}
