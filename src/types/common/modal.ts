import { ReactNode } from 'react';

export type BaseModalProps = {
    isOpen: boolean;
    onClose?: () => void;
};

export type StandardModalProps = BaseModalProps & {
    title?: string;
    width?: string;
    children?: ReactNode;
};

export type ConfirmationModalProps = StandardModalProps & {
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
};

export type AdvancedModalProps = StandardModalProps & {
    footer?: {
        showFooter?: boolean;
        primaryButton?: {
            text: string;
            onClick?: () => void;
            disabled?: boolean;
        };
        secondaryButton?: {
            text: string;
            onClick?: () => void;
            disabled?: boolean;
        };
        customFooter?: ReactNode;
    };
    icon?: ReactNode;
};
