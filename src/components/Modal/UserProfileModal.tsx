import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { User, BookOpen, Heart, LogOut } from 'lucide-react';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { ModalOverlay } from '@/components/common/DropdownElemStyles';
import { useApiServices } from '@/services/api';

type UserProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    onLogout?: () => void;
};

const UserDropdownModal = styled.div<{
    position: { top: number; left: number };
}>`
    position: fixed;
    top: ${({ position }) => position.top}px;
    left: ${({ position }) => position.left}px;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid ${theme.colors.border};
    width: 200px;
    min-width: 200px;
    max-width: 200px;
    overflow: visible;
    z-index: 1001;

    ${({ theme }) => theme.responsive.maxMobile} {
        top: ${({ position }) => position.top}px !important;
        left: ${({ position }) => position.left}px !important;
        transform: none !important;
        width: 220px !important;
        min-width: 220px;
        max-width: 220px;
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
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { removeAuthCookie } = useCookieAuth();
    const { auth: authService } = useApiServices();

    useEffect(() => {
        if (isOpen && anchorElement) {
            const rect = anchorElement.getBoundingClientRect();
            const modalWidth = window.innerWidth <= 767 ? 220 : 200;
            const modalHeight = 200;

            let top = rect.bottom + 8;
            let left = rect.right - modalWidth;

            if (window.innerWidth <= 767) {
                left = rect.left + rect.width / 2 - modalWidth / 2;

                if (left + modalWidth > window.innerWidth - 16) {
                    left = window.innerWidth - modalWidth - 16;
                }
                if (left < 16) {
                    left = 16;
                }
            } else {
                /* for desktop aligning the modal to the right of the profile image */
                if (left + modalWidth > window.innerWidth) {
                    left = window.innerWidth - modalWidth - 16;
                }
                if (left < 16) {
                    left = 16;
                }
            }

            if (top + modalHeight > window.innerHeight) {
                top = rect.top - modalHeight - 8;
            }

            if (top < 16) {
                top = 16;
            }

            setPosition({ top, left });
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
    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            if (onLogout) {
                await onLogout();
            } else {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
            removeAuthCookie();
        } finally {
            setIsLoggingOut(false);
            onClose();
        }
    };
    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <UserDropdownModal ref={modalRef} position={position} onClick={(e) => e.stopPropagation()}>
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
                <MenuItemButton isLogout={true} onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                </MenuItemButton>
            </UserDropdownModal>
        </ModalOverlay>
    );
}
