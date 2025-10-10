import { theme } from '@/styles/theme';
import { BaseModalProps } from '@/types/common/modal';
import React, { ReactNode, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

export type ModalProps = BaseModalProps & {
    title?: string;
    width: string;
    padding?: string;
    showCloseButton?: boolean;
    className?: string;
    disableBackdropClick?: boolean;
    zIndex?: number;
    children: ReactNode;
};

const ModalOverlay = styled.div<{ isOpen: boolean; zIndex: number }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, ${({ isOpen }) => (isOpen ? '0.7' : '0')});
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${(props) => props.zIndex};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transition: ${theme.transitions.default};

    ${({ theme }) => theme.responsive.maxMobile} {
        background-color: ${({ isOpen }) => (isOpen ? 'white' : 'transparent')};
        align-items: flex-start;
        justify-content: center;
    }
`;

const ModalContainer = styled.div<{ width: string; padding: string }>`
    position: relative;
    width: ${(props) => props.width};
    max-width: 95%;
    max-height: 80vh;
    overflow-y: auto;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg};
    padding: ${(props) => props.padding};
    box-shadow: ${theme.shadows.lg};
    transform: translateY(0);
    transition: ${theme.transitions.default};

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 100%;
        max-width: 100%;
        max-height: 100vh;
        height: 100vh;
        border-radius: 0;
        box-shadow: none;
        padding-top: 60px;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-family: ${theme.typography.fontFamily.display};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.lg};
    color: ${theme.colors.primary};
`;

const MobileCloseButton = styled.button`
    display: none;
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: ${theme.colors.text};
    cursor: pointer;
    z-index: 10;
    padding: ${theme.spacing.sm};

    ${({ theme }) => theme.responsive.maxMobile} {
        display: block;
    }

    &:hover {
        color: ${theme.colors.primary};
    }
`;

export default function Modal({
    isOpen,
    onClose,
    title,
    width = '500px',
    padding = theme.spacing.md,
    className,
    disableBackdropClick = false,
    zIndex = 1000,
    children,
}: ModalProps) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !disableBackdropClick) {
            onClose();
        }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    return (
        <ModalOverlay isOpen={isOpen} onClick={handleBackdropClick} zIndex={zIndex}>
            <ModalContainer width={width} padding={padding} className={className}>
                <MobileCloseButton onClick={onClose}>
                    <FaTimes />
                </MobileCloseButton>

                {title && (
                    <ModalHeader>
                        <ModalTitle>{title}</ModalTitle>
                    </ModalHeader>
                )}
                {children}
            </ModalContainer>
        </ModalOverlay>
    );
}
