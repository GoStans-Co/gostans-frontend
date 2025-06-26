import { useState, useRef, useEffect } from 'react';

type UseDropdownModalOptions = {
    modalWidth: number;
    modalHeight: number;
    gap?: number;
    alignment?: 'left' | 'right';
};

export function useDropdownModal(
    isOpen: boolean,
    anchorElement: HTMLElement | null,
    onClose: () => void,
    options: UseDropdownModalOptions,
) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef<HTMLDivElement>(null);
    const { modalWidth, modalHeight, gap = 8, alignment = 'left' } = options;

    useEffect(() => {
        if (isOpen && anchorElement) {
            const rect = anchorElement.getBoundingClientRect();

            let top = rect.bottom + gap;
            let left = alignment === 'right' ? rect.right - modalWidth : rect.left;

            if (left + modalWidth > window.innerWidth) {
                left = window.innerWidth - modalWidth - 16;
            }

            if (top + modalHeight > window.innerHeight) {
                top = rect.top - modalHeight - gap;
            }

            if (left < 16) {
                left = 16;
            }

            if (top < 16) {
                top = 16;
            }

            setPosition({ top, left });
        }
    }, [isOpen, anchorElement, modalWidth, modalHeight, gap, alignment]);

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

    return { position, modalRef };
}
