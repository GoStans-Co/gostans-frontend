export type WishlistTour = {
    id: number;
    uuid: string;
    title: string;
    tourType: string;
    mainImage: string;
    price?: string;
    country?: string;
    city?: string;
};

export type WishlistResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: WishlistTour[];
};

export type WishlistAddResponse = {
    statuscode: number;
    message: string;
    data: {
        tour_uuid: string;
    };
};
