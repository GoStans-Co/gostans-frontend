import { atom } from 'recoil';

export type ModalType = {
    id: string;
    component: React.ReactNode;
    props?: any;
};

export const modalsAtom = atom<ModalType[]>({
    key: 'modalsState',
    default: [],
});
