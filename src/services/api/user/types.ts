export type Wishlist = {
    id: string;
    name: string;
    description?: string;
    itemsCount: number;
    createdAt: string;
    updatedAt: string;
};

export type Booking = {
    id: number;
    uuid: string;
    tourTitle: string;
    tourType: string;
    mainImage: string;
    amount: string;
    currency: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'CONFIRMED';
    tripStartDate: string;
    tripEndDate: string;
    createdAt: string;
};

export type UserBookings = {
    all: Booking[];
    upcoming: Booking[];
    completed: Booking[];
};

export type UserData = {
    name: string;
    dateJoined: string;
    email: string;
    image: string;
    phone: string;
    bookings: UserBookings;
};

// This is a function (value), not a type - export it directly
export const createDefaultUserData = (): UserData => ({
    name: '',
    dateJoined: '',
    email: '',
    image: '',
    phone: '',
    bookings: {
        all: [],
        upcoming: [],
        completed: [],
    },
});

export type UserProfile = {
    data: {
        id: string;
        email: string;
        name: string;
        phone?: string;
        image?: string;
        dateJoined: string;
        updatedAt: string;
        isVerified: boolean;
        bookings: {
            all: Booking[];
            upcoming: Booking[];
            completed: Booking[];
        };
        wishlists: Wishlist[];
    };
};

export type UpdateUserData = {
    name?: string;
    phone?: string;
    avatar?: string;
};

export type ChangePasswordData = {
    current_password: string;
    new_password: string;
    confirm_password: string;
};

export type BecomePartnersData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: number;
    city: number;
    about: string;
    password: string;
    message: string;
};
