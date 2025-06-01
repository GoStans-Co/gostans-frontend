import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { User, BookOpen, Heart, LogOut } from 'lucide-react';
import useCookieAuth from '@/services/cookieAuthService';
import useApiService from '@/services/api';

type UserProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    onLogout?: () => void;
};

const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 1000;
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const UserModal = styled.div<{ position: { top: number; left: number } }>`
    position: absolute;
    top: ${({ position }) => position.top}px;
    left: ${({ position }) => position.left}px;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid ${theme.colors.border};
    min-width: 200px;
    overflow: hidden;
    z-index: 1001;

    /* Arrow pointing up */
    &::before {
        content: '';
        position: absolute;
        top: -8px;
        right: 20px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid ${theme.colors.background};
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
        border-bottom: 8px solid ${theme.colors.border};
    }
`;

const MenuItemButton = styled.button<{ isLogout?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    background: none;
    border: none;
    color: ${({ isLogout }) => (isLogout ? '#d32f2f' : theme.colors.text)};
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${theme.transitions.default};
    text-align: left;

    &:hover:not(:disabled) {
        background-color: ${({ isLogout }) => (isLogout ? '' : theme.colors.lightBackground)};

        ${({ isLogout }) =>
            isLogout &&
            `
            color: #d32f2f;
            background-color: rgba(211, 47, 47, 0.1);
            
            svg {
                color: #d32f2f;
            }
        `}
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    svg {
        width: 18px;
        height: 18px;
        color: ${({ isLogout }) => (isLogout ? '#d32f2f' : theme.colors.lightText)};
        flex-shrink: 0;
    }
`;

const LogoutSeparator = styled.div`
    height: 1px;
    background: ${theme.colors.border};
    margin: 0;
`;

export default function UserProfileModal({ isOpen, onClose, anchorElement, onLogout }: UserProfileModalProps) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef<HTMLDivElement>(null);
    const { removeAuthCookie } = useCookieAuth();
    const { logoutLoading } = useApiService();

    useEffect(() => {
        if (isOpen && anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.right + window.scrollX - 200,
            });
        }
    }, [isOpen, anchorElement]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handlePersonalInfo = () => {
        window.location.href = '/mypage?section=profile';
        onClose();
    };

    const handleTrips = () => {
        console.log('Navigate to trips');
        window.location.href = '/mypage?section=trips';
        onClose();
    };

    const handleFavorites = () => {
        console.log('Navigate to favorites');
        window.location.href = '/mypage?section=favorites';
        onClose();
    };
    const handleLogout = () => {
        if (onLogout) {
            onLogout();
        } else {
            console.error('Logout error:', 'No onLogout handler provided');
            removeAuthCookie();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <UserModal ref={modalRef} position={position} onClick={(e) => e.stopPropagation()}>
                {' '}
                <MenuItemButton onClick={handlePersonalInfo}>
                    <User />
                    Personal Info
                </MenuItemButton>
                <MenuItemButton onClick={handleTrips}>
                    <BookOpen />
                    Trips
                </MenuItemButton>
                <MenuItemButton onClick={handleFavorites}>
                    <Heart />
                    Favorites
                </MenuItemButton>
                <LogoutSeparator />
                <MenuItemButton isLogout={true} onClick={handleLogout} disabled={logoutLoading}>
                    <LogOut />
                    {logoutLoading ? 'Logging out...' : 'Logout'}
                </MenuItemButton>
            </UserModal>
        </ModalOverlay>
    );
}
