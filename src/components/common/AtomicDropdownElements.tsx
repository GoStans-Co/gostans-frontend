import React from 'react';
import { ModalOverlay, DropdownModal, ModalContent } from '@/components/common/DropdownElemStyles';
import useDropdownModal from '@/hooks/ui/useDropdownModal';

type AtomicDropdownModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    width: string;
    modalWidth: number;
    modalHeight: number;
    gap?: number;
    alignment?: 'left' | 'right';
    children: React.ReactNode;
};

/**
 * Atomic Dropdown Modal Component
 * This component renders a dropdown modal that is anchored to a specified element.
 * It uses the `useDropdownModal` hook to manage positioning and visibility
 * @param {AtomicDropdownModalProps} props - Props for the AtomicDropdownModal component
 * @returns {JSX.Element | null} The rendered AtomicDropdownModal component or null if not open
 */
export default function AtomicDropdownModal({
    isOpen,
    onClose,
    anchorElement,
    width,
    modalWidth,
    modalHeight,
    gap = 8,
    alignment = 'left',
    children,
}: AtomicDropdownModalProps) {
    const { position, modalRef } = useDropdownModal(isOpen, anchorElement ?? null, onClose, {
        modalWidth,
        modalHeight,
        gap,
        alignment,
    });

    if (!isOpen) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClick={onClose}>
            <DropdownModal ref={modalRef} position={position} width={width} onClick={(e) => e.stopPropagation()}>
                <ModalContent>{children}</ModalContent>
            </DropdownModal>
        </ModalOverlay>
    );
}
