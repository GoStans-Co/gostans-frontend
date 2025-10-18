import { CartItem } from '@/services/api/cart';
import { Itinerary, TourDetailsResponse } from '@/services/api/tours';
import default_n1 from '@/assets/default/default_1.jpg';
import default_n2 from '@/assets/default/default_2.jpg';

/**
 * Create a cart item from tour details
 * @param {TourDetailsResponse} tour - Tour details from API response
 * @param {string} [selectedDate] - Selected date for the tour
 * @returns {CartItem} Cart item object
 */
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

/**
 * Get display languages from a language code or array of codes
 * @param {unknown} lang - Language code or array of codes
 * @returns {string} Display languages
 */
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

/**
 * Process tour images for display
 * @param {TourDetailsResponse} tour - Tour details from API response
 * @returns {string[]} Array of processed image URLs
 */
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

/**
 * Get location information from itineraries
 * @param {any[]} itineraries - Array of itinerary objects
 * @returns {{ startLocation: string; endLocation: string; isLoop: boolean }} Location information
 */
export const getLocationInfo = (itineraries: Itinerary[]) => {
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
