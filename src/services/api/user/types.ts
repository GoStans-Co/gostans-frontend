export type Wishlist = {
    id: string;
    name: string;
    description?: string;
    itemsCount: number;
    createdAt: string;
    updatedAt: string;
};

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
        wishLists: Wishlist[];
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
