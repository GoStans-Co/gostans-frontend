import React, { createContext, ReactNode } from 'react';
import { atom, useRecoilState } from 'recoil';

export type ModalType = {
    id: string;
    component: React.ReactNode;
    props?: any;
};

type ModalContextType = {
    openModal: (id: string, component: React.ReactNode, props?: any) => void;
    closeModal: (id: string) => void;
    closeAllModals: () => void;
    isModalOpen: (id: string) => boolean;
    getModalProps: (id: string) => any;
};

export const modalsAtom = atom<ModalType[]>({
    key: 'modalsState',
    default: [],
});

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export default function ModalProvider({ children }: { children: ReactNode }) {
    const [modals, setModals] = useRecoilState(modalsAtom);

    const openModal = (id: string, component: React.ReactNode, props?: any) => {
        setModals((prev) => {
            // Check if modal already exists
            const exists = prev.some((modal) => modal.id === id);
            if (exists) {
                // Update existing modal
                return prev.map((modal) => (modal.id === id ? { ...modal, component, props } : modal));
            }
            // Add new modal
            return [...prev, { id, component, props }];
        });
    };

    const closeModal = (id: string) => {
        setModals((prev) => prev.filter((modal) => modal.id !== id));
    };

    const closeAllModals = () => {
        setModals([]);
    };

    const isModalOpen = (id: string) => {
        return modals.some((modal) => modal.id === id);
    };

    const getModalProps = (id: string) => {
        const modal = modals.find((m) => m.id === id);
        return modal?.props || {};
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, closeAllModals, isModalOpen, getModalProps }}>
            {children}
            {modals.map((modal) => (
                <React.Fragment key={modal.id}>{modal.component}</React.Fragment>
            ))}
        </ModalContext.Provider>
    );
}
