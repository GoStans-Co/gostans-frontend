import { ShoppingCart, X } from 'lucide-react';
import { ModalHeader, ModalTitle } from '@/components/common/DropdownElemStyles';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';
import styled from 'styled-components';
import AtomicDropdownModal from '@/components/common/AtomicDropdownElements';
import { useEffect } from 'react';
import { CartItem } from '@/services/api/cart';
import { formatCurrency } from '@/utils/general/formatCurrency';

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    cartItems: CartItem[];
    onRemoveItem: (tourId: string) => void;
    onGoToCart: () => void;
};

const CartItemContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.sm};
    border-bottom: 1px solid #f0f0f0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        gap: ${theme.spacing.sm};
    }

    ${({ theme }) => theme.responsive.minTablet} {
        padding: 0.8rem;
        gap: 0.6rem;
    }

    &:last-child {
        border-bottom: none;
    }
`;

const CartItemImage = styled.div.attrs<{ src?: string }>((props) => ({
    style: {
        backgroundImage: props.src ? `url(${props.src})` : 'none',
    },
}))`
    width: 80px;
    height: 80px;
    border-radius: ${theme.borderRadius.md};
    background: #f5f5f5;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 50px;
        height: 50px;
    }

    ${({ theme }) => theme.responsive.minTablet} {
        width: 60px;
        height: 60px;
    }
`;

const CartItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
`;

const CartItemName = styled.span`
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text};
    line-height: 1.4;
    text-align: left;
    margin-bottom: ${theme.spacing.xs};
    padding-top: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 13px;
    }
`;

const CartItemPrice = styled.span`
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.primary};
    font-weight: ${theme.typography.fontWeight.bold};
    align-self: flex-end;

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: 13px;
    }
`;

const RemoveButton = styled.button`
    width: 24px;
    border: none;
    background: transparent;
    color: #999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.default};
    flex-shrink: 0;

    &:hover {
        color: #d32f2f;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 20px;
        height: 20px;
    }
`;

const ShowMoreSection = styled.div`
    text-align: center;
    padding: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: 4px 0;
    }
`;

const CartFooter = styled.div`
    padding: 0.8rem;
    background: transparent;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.md};
    }

    ${({ theme }) => theme.responsive.minTablet} {
        padding: 0.8rem;
    }
`;

const CartTotal = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.fontSizes.md};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${theme.fontSizes.sm};
        margin-bottom: ${theme.spacing.sm};
    }
`;

const EmptyCartMessage = styled.div`
    padding: ${theme.spacing['2xl']};
    text-align: center;
    color: #999;
    font-size: ${theme.fontSizes.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.lg};
        font-size: 13px;
    }
`;

/**
 * Cart Modal Component
 * This component renders a modal displaying the user's cart items.
 * It shows a summary of items, total price, and provides options to remove items or go to the cart page.
 * @param {CartModalProps} props - Props for the CartModal component
 * @returns {JSX.Element} The rendered CartModal component
 */
export default function CartModal({
    isOpen,
    onClose,
    anchorElement,
    cartItems,
    onRemoveItem,
    onGoToCart,
}: CartModalProps) {
    useEffect(() => {
        const handleScrollOrResize = () => {
            if (isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('scroll', handleScrollOrResize);
            window.addEventListener('resize', handleScrollOrResize);
        }

        return () => {
            window.removeEventListener('scroll', handleScrollOrResize);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen, onClose]);

    const totalPrice = cartItems.reduce((sum, item) => {
        const itemPrice = item.tourData?.price ? parseFloat(item.tourData.price) : 0;
        return sum + itemPrice * (item?.quantity ?? 0);
    }, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleGoToCart = () => {
        onGoToCart();
        onClose();
    };

    return (
        <AtomicDropdownModal
            isOpen={isOpen}
            onClose={onClose}
            anchorElement={anchorElement}
            width="350px"
            modalWidth={350}
            modalHeight={490}
            gap={20}
            alignment="right"
        >
            <ModalHeader>
                <ModalTitle>
                    <ShoppingCart size={14} style={{ marginRight: theme.spacing.sm }} />
                    Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </ModalTitle>
            </ModalHeader>
            {cartItems.length === 0 ? (
                <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
            ) : (
                <>
                    {cartItems.slice(0, 3).map((item) => (
                        <CartItemContainer key={item.tourId}>
                            <CartItemImage src={item.tourData?.mainImage ?? ''} />
                            <CartItemDetails>
                                <CartItemName>{item.tourData?.title ?? 'No title'}</CartItemName>
                                <CartItemPrice>{formatCurrency(item.tourData?.price)}</CartItemPrice>
                            </CartItemDetails>
                            <RemoveButton onClick={() => onRemoveItem(item.tourId)}>
                                <X size={16} />
                            </RemoveButton>
                        </CartItemContainer>
                    ))}

                    {cartItems.length > 3 && (
                        <ShowMoreSection>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={handleGoToCart}
                                style={{ fontSize: '14px', color: theme.colors.primary }}
                            >
                                Show More ({cartItems.length - 3} more items)
                            </Button>
                        </ShowMoreSection>
                    )}

                    <CartFooter>
                        <CartTotal>
                            <span>Subtotal ({totalItems} items)</span>
                            <span>{formatCurrency(totalPrice)}</span>
                        </CartTotal>
                        <Button variant="primary" size="md" onClick={handleGoToCart} style={{ width: '100%' }}>
                            Go to cart
                        </Button>
                    </CartFooter>
                </>
            )}
        </AtomicDropdownModal>
    );
}
