import { MenuItem, MenuItemIcon, MenuItemText, MenuItemLabel } from '@/components/Common/DropdownElemStyles';
import AtomicDropdownModal from '../Common/AtomicDropdownElements';

type Language = {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
};

type LanguageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    selectedLanguage: Language;
    onLanguageSelect: (language: Language) => void;
};

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'uz', name: 'Uzbek', nativeName: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

export default function LanguageModal({
    isOpen,
    onClose,
    anchorElement,
    selectedLanguage,
    onLanguageSelect,
}: LanguageModalProps) {
    const handleLanguageSelect = (language: Language) => {
        onLanguageSelect(language);
        onClose();
    };

    return (
        <AtomicDropdownModal
            isOpen={isOpen}
            onClose={onClose}
            anchorElement={anchorElement}
            width="150px"
            modalWidth={250}
            modalHeight={150}
            gap={20}
            alignment="left"
        >
            {languages.map((language) => (
                <MenuItem
                    key={language.code}
                    isSelected={selectedLanguage.code === language.code}
                    onClick={() => handleLanguageSelect(language)}
                >
                    <MenuItemIcon>
                        <span style={{ fontSize: '18px' }}>{language.flag}</span>
                    </MenuItemIcon>
                    <MenuItemText>
                        <MenuItemLabel>{language.name}</MenuItemLabel>
                    </MenuItemText>
                </MenuItem>
            ))}
        </AtomicDropdownModal>
    );
}
