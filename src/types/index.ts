type TourCardVariant = 'link' | 'button';

export type TourProps = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    country: string;
    city?: string;
    days?: number;
    rating?: number;
    variant?: TourCardVariant;
    buttonText?: string;
};

export interface AccommodationProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    location: string;
    rating?: number;
}

export interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'light';
    size?: 'sm' | 'md' | 'lg' | 'xs';
    fullWidth?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    as?: React.ElementType;
    to?: string;
    style?: React.CSSProperties;
}

export interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: boolean;
}

export interface IconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    ariaLabel: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    error?: string;
}

export interface SelectProps {
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}
