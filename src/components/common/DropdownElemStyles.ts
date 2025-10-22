import styled from 'styled-components';
import { theme } from '@/styles/theme';

export const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 1000;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const DropdownModal = styled.div<{
    position: { top: number; left: number };
    width?: string;
    maxHeight?: string;
}>`
    position: fixed;
    top: ${({ position }) => position.top}px;
    left: ${({ position }) => position.left}px;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid ${theme.colors.border};
    width: ${({ width }) => width || '200px'};
    max-height: ${({ maxHeight }) => maxHeight || '400px'};
    overflow-y: auto;
    z-index: 1001;

    ${({ theme }) => theme.responsive.minLaptop} {
        width: ${({ width }) => width || '450px'};
        max-height: 550px;
    }

    ${({ theme }) => theme.responsive.maxMobile} {
        left: 50% !important;
        transform: translateX(-50%);
        width: 90vw !important;
        max-width: 350px;
        max-height: 80vh;
    }

    &::before {
        content: '';
        position: absolute;
        top: -8px;
        right: 20px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;

        ${({ theme }) => theme.responsive.maxMobile} {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
        }
    }

    &::after {
        content: '';
        position: absolute;
        top: -9px;
        right: 20px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;

        ${({ theme }) => theme.responsive.maxMobile} {
            left: 50%;
            right: auto;
            transform: translateX(-50%);
        }
    }

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: ${theme.colors.lightBackground};
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${theme.colors.border};
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.lightText};
    }
`;

export const ModalHeader = styled.div`
    padding: ${theme.spacing.sm};
    background: ${theme.colors.lightBackground};
    border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;

    ${({ theme }) => theme.responsive.maxMobile} {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
    }
`;

export const ModalTitle = styled.h3`
    margin: 0;
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text};

    ${({ theme }) => theme.responsive.maxMobile} {
        font-size: ${theme.fontSizes.sm};
        line-height: 1.2;
    }
`;

export const ModalContent = styled.div`
    padding: 0 0;
`;

export const MenuItem = styled.button<{ isSelected?: boolean; isActive?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.sm};
    background: ${({ isSelected }) => (isSelected ? theme.colors.lightBackground : 'none')};
    border: none;
    color: ${({ isActive }) => (isActive ? theme.colors.primary : theme.colors.text)};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.sm};
    font-weight: ${({ isSelected, isActive }) =>
        isSelected || isActive ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${theme.transitions.default};
    text-align: left;

    &:hover:not(:disabled) {
        background-color: ${theme.colors.lightBackground};
        color: ${theme.colors.primary};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const MenuItemIcon = styled.div`
    width: 24px;
    height: 24px;
    border-radius: ${theme.borderRadius.sm};
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.lightBackground};
`;

export const MenuItemText = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

export const MenuItemLabel = styled.span`
    font-size: ${theme.fontSizes.sm};
    color: inherit;
`;

export const MenuItemSubtext = styled.span`
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.lightText};
    font-weight: ${theme.typography.fontWeight.regular};
`;

export const Separator = styled.div`
    height: 1px;
    background: ${theme.colors.border};
    margin: ${theme.spacing.xs} 0;
`;
