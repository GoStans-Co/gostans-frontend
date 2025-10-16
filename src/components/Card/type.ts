type Status = 'awaiting' | 'waiting' | 'booked' | 'all' | string;

type BaseCardProps = {
    image: string;
    title: string;
    subtitle?: string;
    date?: string;
};

type MetaProps = {
    meta?: {
        duration?: string;
        peopleCount?: number;
    };
};

type StyleProps = {
    variant?: 'default' | 'compact';
    imageSize?: 'default' | 'small' | 'large';
    titleSize?: 'default' | 'large' | 'small';
};

type ActionProps = {
    actions?: React.ReactNode;
    actionButtons?: {
        label: string;
        onClick: () => void;
        variant?: 'circle' | 'text' | 'primary' | 'secondary' | 'outline' | 'light' | 'gradient';
    }[];
    onEdit?: () => void;
    onRemove?: () => void;
    onClick?: () => void;
};

type ContentProps = {
    customContent?: React.ReactNode;
    customContentData?: {
        position?: 'top' | 'bottom';
        details?: string;
    };
};

type PricingProps = {
    price?: number;
    status?: Status;
    pricing?: React.ReactNode;
};

export type TripCardProps = BaseCardProps & MetaProps & StyleProps & ActionProps & ContentProps & PricingProps;
