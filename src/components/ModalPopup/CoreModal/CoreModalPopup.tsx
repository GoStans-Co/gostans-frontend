import styled from 'styled-components';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/common/Button';
import { theme } from '@/styles/theme';
import { AdvancedModalProps } from '@/types/common/modal';

export type CoreModalPopupProps = AdvancedModalProps;

const ModalContent = styled.div`
    padding: ${theme.spacing.sm} ${theme.spacing.sm} 0;
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    margin: ${theme.spacing.sm} 0 ${theme.spacing.md} ${theme.spacing.sm};
    font-family: ${theme.typography.fontFamily.body};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.primary};
    column-gap: ${theme.spacing.sm};
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    column-gap: ${theme.spacing.xl};
    padding: ${theme.spacing.md};
`;

export default function CoreModalPopup({
    isOpen,
    onClose,
    title,
    width = '480px',
    children,
    icon,
    footer = {
        showFooter: true,
        primaryButton: { text: 'Confirm' },
        secondaryButton: { text: 'Cancel' },
    },
}: CoreModalPopupProps) {
    const handlePrimaryClick = () => {
        if (footer.primaryButton?.onClick) {
            footer.primaryButton.onClick();
        } else {
            onClose();
        }
    };

    const handleSecondaryClick = () => {
        if (footer.secondaryButton?.onClick) {
            footer.secondaryButton.onClick();
        } else {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} width={width} padding={theme.spacing.sm} title={title}>
            {icon && <ModalHeader>{icon}</ModalHeader>}

            <ModalContent>{children}</ModalContent>

            {footer.showFooter !== false && (
                <ModalFooter>
                    {footer.customFooter || (
                        <>
                            {footer.secondaryButton && (
                                <Button
                                    variant="secondary"
                                    size="md"
                                    onClick={handleSecondaryClick}
                                    disabled={footer.secondaryButton.disabled}
                                >
                                    {footer.secondaryButton.text}
                                </Button>
                            )}
                            {footer.primaryButton && (
                                <Button
                                    variant="primary"
                                    size="md"
                                    onClick={handlePrimaryClick}
                                    disabled={footer.primaryButton.disabled}
                                >
                                    {footer.primaryButton.text}
                                </Button>
                            )}
                        </>
                    )}
                </ModalFooter>
            )}
        </Modal>
    );
}
