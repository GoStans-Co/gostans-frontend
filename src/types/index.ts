export type TourCardVariant = 'link' | 'button';

export type TourPropsMock = {
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
    status: 'all' | 'booked' | 'waiting' | 'complete' | 'cancelled';
    date?: string;
    dayInfo?: string;
    peopleBooked?: number;
    reviews?: number;
};

export type AccommodationProps = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    location: string;
    rating?: number;
};

export type ButtonProps = {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'light' | 'circle';
    size?: 'sm' | 'md' | 'lg' | 'xs' | 'mini';
    fullWidth?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    as?: React.ElementType;
    to?: string;
    style?: React.CSSProperties;
};

export type CardProps = {
    children: React.ReactNode;
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: boolean;
    style?: React.CSSProperties;
};

export type IconButtonProps = {
    icon: React.ReactNode;
    onClick?: () => void;
    ariaLabel: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
};

export type InputProps = {
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
};

export type SelectProps = {
    options: { value: string; label: string }[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
};
