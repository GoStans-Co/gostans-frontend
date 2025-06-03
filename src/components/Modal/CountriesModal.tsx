import AtomicDropdownModal from '@/components/Common/AtomicDropdownElements';
import { MenuItem, MenuItemIcon, MenuItemLabel, MenuItemText } from '@/components/Common/DropdownElemStyles';

type Country = {
    code: string;
    name: string;
    flag: string;
};

type CountriesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    anchorElement?: HTMLElement | null;
    selectedCountry: Country;
    onCountrySelect: (country: Country) => void;
};

const countries: Country[] = [
    { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿' },
    { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
];

export default function CountriesModal({
    isOpen,
    onClose,
    anchorElement,
    selectedCountry,
    onCountrySelect,
}: CountriesModalProps) {
    const handleCountrySelect = (country: Country) => {
        onCountrySelect(country);
        onClose();
    };

    return (
        <AtomicDropdownModal
            isOpen={isOpen}
            onClose={onClose}
            anchorElement={anchorElement}
            width="200px"
            modalWidth={200}
            modalHeight={200}
            gap={8}
            alignment="left"
        >
            {countries.map((country) => (
                <MenuItem
                    key={country.code}
                    isSelected={selectedCountry.code === country.code}
                    onClick={() => handleCountrySelect(country)}
                >
                    <MenuItemIcon>
                        <span style={{ fontSize: '18px' }}>{country.flag}</span>
                    </MenuItemIcon>
                    <MenuItemText>
                        <MenuItemLabel>{country.name}</MenuItemLabel>
                    </MenuItemText>
                </MenuItem>
            ))}
        </AtomicDropdownModal>
    );
}
