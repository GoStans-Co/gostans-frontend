import { ShoppingCart, X } from 'lucide-react';
import { ModalHeader, ModalTitle } from '@/components/Common/DropdownElemStyles';
import Button from '@/components/Common/Button';
import { theme } from '@/styles/theme';
import styled from 'styled-components';
import AtomicDropdownModal from '@/components/Common/AtomicDropdownElements';
import { useEffect } from 'react';
import { CartItem } from '@/services/api/cart';

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
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        gap: ${theme.spacing.sm};
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
    width: 60px;
    height: 60px;
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.lightBackground};
    background-size: cover;
    background-position: center;
    flex-shrink: 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 50px;
        height: 50px;
    }
`;

const CartItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xs};
`;

const CartItemName = styled.span`
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text};
`;

const CartItemPrice = styled.span`
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.primary};
    font-weight: ${theme.typography.fontWeight.bold};
`;

const RemoveButton = styled.button`
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: ${theme.colors.lightText};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.default};
    flex-shrink: 0;
    margin-top: 2px;

    &:hover {
        color: #d32f2f;
    }
`;

const CartFooter = styled.div`
    padding: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.lightBackground};

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.md};
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
`;

const EmptyCartMessage = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.lightText};
    font-size: ${theme.fontSizes.sm};
`;

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
            width="400px"
            modalWidth={400}
            modalHeight={550}
            gap={20}
            alignment="right"
        >
            <ModalHeader>
                <ModalTitle>
                    <ShoppingCart size={18} style={{ marginRight: theme.spacing.sm }} />
                    Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </ModalTitle>
            </ModalHeader>
            {cartItems.length === 0 ? (
                <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
            ) : (
                <>
                    {cartItems.slice(0, 1).map((item) => (
                        <CartItemContainer key={item.tourId}>
                            <CartItemImage src={item.tourData?.mainImage ?? ''} />
                            <CartItemDetails>
                                <CartItemName>{item.tourData?.title ?? 'No title'}</CartItemName>
                                <CartItemPrice>
                                    ${item.tourData?.price ? parseFloat(item.tourData.price).toFixed(2) : '0.00'}
                                </CartItemPrice>
                            </CartItemDetails>
                            <RemoveButton onClick={() => onRemoveItem(item.tourId)}>
                                <X size={16} />
                            </RemoveButton>
                        </CartItemContainer>
                    ))}

                    {cartItems.length > 1 && (
                        <div style={{ textAlign: 'center', padding: '6px 0', borderBottom: '0.5px solid #eee' }}>
                            <Button
                                variant="text"
                                size="sm"
                                onClick={handleGoToCart}
                                style={{ fontSize: '14px', color: theme.colors.primary }}
                            >
                                Show More ({cartItems.length - 1} more items)
                            </Button>
                        </div>
                    )}

                    <CartFooter>
                        <CartTotal>
                            <span>Subtotal ({totalItems} items)</span>
                            <span>${totalPrice.toFixed(2)}</span>
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
