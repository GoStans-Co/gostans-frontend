import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { User, Heart, LogOut, Luggage } from 'lucide-react';
import useCookieAuth from '@/services/cache/cookieAuthService';
import { ModalOverlay } from '@/components/common/DropdownElemStyles';
import { useApiServices } from '@/services/api';

type UserProfileModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    onLogout?: () => void;
};

const ModalHeader = styled.div`
    padding: 0.8rem ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h3`
    font-size: ${theme.fontSizes.md};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text};
    margin-left: 3px;
    text-align: left;
`;

const UserDropdownModal = styled.div<{
    position: { top: number; left: number };
}>`
    position: fixed;
    top: ${({ position }) => position.top}px;
    left: ${({ position }) => position.left}px;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid ${theme.colors.border};
    width: 220px;
    min-width: 220px;
    max-width: 220px;
    overflow: hidden;
    z-index: 1001;

    ${({ theme }) => theme.responsive.maxMobile} {
        width: 190px !important;
        min-width: 190px;
        max-width: 190px;
    }
`;

const MenuItemButton = styled.button<{ isLogout?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: 0.8rem ${theme.spacing.md};
    background: none;
    border: none;
    color: ${({ isLogout }) => (isLogout ? '#d32f2f' : theme.colors.text)};
    font-family: ${theme.typography.fontFamily.body};
    font-size: 0.9rem;
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    // transition: ${theme.transitions.default};
    text-align: left;

    &:hover:not(:disabled) {
        position: relative;

        &::before {
          content: '';
           position: absolute;
           top: 4px;
           bottom: 4px;
           left: 4px;
           right: 4px;
           background-color: ${({ isLogout }) => (isLogout ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0, 123, 255, 0.08)')};
           border-radius: 5px;
           z-index: -1;
       }

        ${({ isLogout }) =>
            isLogout &&
            `
            color: #d32f2f;
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
        margi
        color: ${({ isLogout }) => (isLogout ? '#d32f2f' : theme.colors.text)};
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
            const modalWidth = window.innerWidth <= 767 ? 220 : 220;
            const modalHeight = 220;

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
        window.location.href = '/mypage?section=trips';
        onClose();
    };

    const handleFavorites = () => {
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
                <ModalHeader>
                    <ModalTitle>My Account</ModalTitle>
                </ModalHeader>
                <MenuItemButton onClick={handlePersonalInfo}>
                    <User />
                    Profile
                </MenuItemButton>
                <MenuItemButton onClick={handleTrips}>
                    <Luggage />
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
