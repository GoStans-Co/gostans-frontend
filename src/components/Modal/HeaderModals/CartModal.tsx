import { ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { ModalHeader, ModalTitle } from '@/components/Common/DropdownElemStyles';
import Button from '@/components/Common/Button';
import { theme } from '@/styles/theme';
import styled from 'styled-components';
import AtomicDropdownModal from '@/components/Common/AtomicDropdownElements';
import { CartItem } from '@/atoms/cart';

type CartModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    cartItems: CartItem[];
    onUpdateQuantity: (tourId: string, quantity: number) => void;
    onRemoveItem: (tourId: string) => void;
    onGoToCart: () => void;
};

const CartItemContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};

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

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
`;

const QuantityButton = styled.button`
    width: 24px;
    height: 24px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background: ${theme.colors.lightBackground};
        border-color: ${theme.colors.primary};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const QuantityDisplay = styled.span`
    min-width: 30px;
    text-align: center;
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.medium};
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

    &:hover {
        color: #d32f2f;
    }
`;

const CartFooter = styled.div`
    padding: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.lightBackground};
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
    onUpdateQuantity,
    onRemoveItem,
    onGoToCart,
}: CartModalProps) {
    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.tourData.price) * item.quantity, 0);
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
            modalHeight={500}
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
                    {cartItems.map((item) => (
                        <CartItemContainer key={item.tourId}>
                            <CartItemImage src={item.tourData.mainImage ?? undefined} />
                            <CartItemDetails>
                                <CartItemName>{item.tourData.title}</CartItemName>
                                <CartItemPrice>${parseFloat(item.tourData.price).toFixed(2)}</CartItemPrice>
                            </CartItemDetails>
                            <QuantityControls>
                                <QuantityButton
                                    onClick={() => onUpdateQuantity(item.tourId, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={12} />
                                </QuantityButton>
                                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                                <QuantityButton onClick={() => onUpdateQuantity(item.tourId, item.quantity + 1)}>
                                    <Plus size={12} />
                                </QuantityButton>
                            </QuantityControls>
                            <RemoveButton onClick={() => onRemoveItem(item.tourId)}>
                                <X size={16} />
                            </RemoveButton>
                        </CartItemContainer>
                    ))}

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
