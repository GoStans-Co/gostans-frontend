import { theme } from '@/styles/theme';
import React from 'react';
import styled from 'styled-components';
import Button from '@/components/Common/Button';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { FaInfoCircle } from 'react-icons/fa';
import { ConfirmationModalProps } from '@/types/modal';
import CoreModalPopup from '@/components/ModalPopup/CoreModal/CoreModalPopup';

type AlertType = 'info' | 'success' | 'warning' | 'error';

type ModalAlertProps = ConfirmationModalProps & {
    type?: AlertType;
    message: string;
    showCancel?: boolean;
    icon?: React.ReactNode;
    onCancel?: () => void;
};

const AlertContainer = styled.div`
    text-align: center;
    padding: ${theme.spacing.md} ${theme.spacing.sm};
`;

const AlertTitle = styled.h3`
    color: ${theme.colors.text};
    font-family: ${theme.typography.fontFamily.body};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.lg};
    margin-bottom: ${theme.spacing.md};
`;

const AlertMessage = styled.p`
    color: ${theme.colors.lightText};
    font-family: ${theme.typography.fontFamily.body};
    font-weight: ${theme.typography.fontWeight.regular};
    font-size: ${theme.fontSizes.md};
    margin-bottom: ${theme.spacing.xl};
`;

const AlertIcon = styled.div`
    margin-bottom: ${theme.spacing.md};
    font-size: 48px;
    color: ${(props) => props.color || theme.colors.primary};
    display: flex;
    justify-content: center;

    svg {
        width: 48px;
        height: 48px;
    }
`;

export default function ModalAlert({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Cancel',
    showCancel = false,
    onConfirm,
    onCancel,
    icon,
}: ModalAlertProps) {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    color: theme.colors.primary || '#4CAF50',
                    icon: <CheckCircle />,
                };
            case 'warning':
                return {
                    color: theme.colors.background || '#FF9800',
                    icon: <AlertTriangle />,
                };
            case 'error':
                return {
                    color: theme.colors.text || '#F44336',
                    icon: <XCircle />,
                };
            case 'info':
            default:
                return {
                    color: theme.colors.primary,
                    icon: <FaInfoCircle />,
                };
        }
    };

    const typeStyles = getTypeStyles();

    const footer = (
        <>
            {showCancel && (
                <Button variant="secondary" size="md" onClick={handleCancel}>
                    {cancelText}
                </Button>
            )}
            <Button variant="primary" size="md" onClick={handleConfirm}>
                {confirmText}
            </Button>
        </>
    );

    return (
        <CoreModalPopup
            isOpen={isOpen}
            onClose={onClose}
            width="400px"
            footer={{
                showFooter: true,
                customFooter: footer,
            }}
        >
            <AlertContainer>
                {icon ? (
                    <AlertIcon color={typeStyles.color}>{icon}</AlertIcon>
                ) : (
                    <AlertIcon color={typeStyles.color}>{typeStyles.icon}</AlertIcon>
                )}
                <AlertTitle>{title}</AlertTitle>
                <AlertMessage>{message}</AlertMessage>
            </AlertContainer>
        </CoreModalPopup>
    );
}
