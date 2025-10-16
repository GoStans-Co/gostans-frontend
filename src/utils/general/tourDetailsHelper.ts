import { CartItem } from '@/services/api/cart';
import { TourDetailsResponse } from '@/services/api/tours';
import default_n1 from '@/assets/default/default_1.jpg';
import default_n2 from '@/assets/default/default_2.jpg';

export const createCartItem = (tour: TourDetailsResponse, selectedDate?: string): CartItem => ({
    tourId: tour.uuid,
    tourData: {
        uuid: tour.uuid,
        title: tour.title,
        price: tour.price,
        mainImage: tour.mainImage ?? '',
        durationDays: tour.durationDays ? parseInt(tour.durationDays) : null,
        about: tour.about,
        tourType: parseInt(tour.tourType) || 0,
        shortDescription: tour.shortDescription || '',
    },
    quantity: 1,
    selectedDate,
    adults: 1,
    addedAt: Date.now(),
    price: parseFloat(tour.price),
    durationDays: tour.durationDays ? parseInt(tour.durationDays) : null,
});

export const getDisplayLanguages = (lang: unknown): string => {
    const languageMap: Record<string, string> = {
        en: 'ENG',
        ko: 'KOR',
        rus: 'RUS',
        uz: 'UZB',
    };

    if (!lang) return 'Not specified';
    if (Array.isArray(lang)) {
        return lang.map((code) => languageMap[String(code).toLowerCase()] || code).join(', ');
    }
    if (typeof lang === 'string') {
        const codes = lang.match(/.{1,2}/g) || [];
        return codes.map((code) => languageMap[code.toLowerCase()] || code).join(', ');
    }
    return 'Not specified';
};

export const processImages = (tour: TourDetailsResponse): string[] => {
    const images =
        tour.images?.length > 0 ? tour.images.map((img) => img.image || default_n1) : [tour.mainImage || default_n1];

    const galleryImages = [...images];
    const defaultImages = [default_n1, default_n2];
    let defaultIndex = 0;

    while (galleryImages.length < 5) {
        galleryImages.push(defaultImages[defaultIndex % 2]);
        defaultIndex++;
    }

    return galleryImages;
};

export const getLocationInfo = (itineraries: any[]) => {
    if (!itineraries?.length)
        return {
            startLocation: 'Unknown',
            endLocation: 'Unknown',
            isLoop: false,
        };

    const startTitle = itineraries[0]?.dayTitle.split(' (')[0] ?? 'Unknown';
    const startLocation = startTitle.includes(' - ') ? startTitle.split(' - ')[0] : startTitle;

    const endTitle = itineraries[itineraries.length - 1]?.dayTitle.split(' (')[0] ?? 'Unknown';
    const endLocation = endTitle.includes(' - ') ? endTitle.split(' - ')[1] : endTitle;

    return {
        startLocation,
        endLocation,
        isLoop: startLocation === endLocation,
    };
};
