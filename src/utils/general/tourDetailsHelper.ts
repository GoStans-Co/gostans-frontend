import { CartItem } from '@/services/api/cart';
import { Itinerary, TourDetailsResponse } from '@/services/api/tours';
import default_n1 from '@/assets/default/default_1.jpg';
import default_n2 from '@/assets/default/default_2.jpg';

export type StarType = 'full' | 'half' | 'empty';


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

/**
 * Generates a consistent random number 
 * between min and max based on a seed string.
 * The same seed will always produce the 
 * same number, ensuring consistency per tour.
 */
export const getSeededRandom = (seed: string, min: number, max: number): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; 
    }
    const normalized = Math.abs(hash) / 2147483647; // Normalize to 0-1
    return Math.floor(normalized * (max - min + 1)) + min;
};

/**
 * Gets the number of people booked for a tour (Temporary method)
 * @param {string} tourUuid - The tour UUID to use as seed
 * @returns {number} Number of people booked
 */
export const getPeopleBooked = (tourUuid: string): number => {
    if (!tourUuid) return 0;
    return getSeededRandom(tourUuid, 1, 50);
};

/**
 * Gets the number of reviews for a tour (Temporary method)
 * @param {string} tourUuid - The tour UUID to use as seed
 * @returns {number} Number of reviews
 */
export const getReviewsCount = (tourUuid: string): number => {
    if (!tourUuid) return 0;
    return getSeededRandom(tourUuid + '_reviews', 1, 5);
};

/**
 * Gets the rating value for a tour (random between 1-5, consistent per tour)
 * @param {string} tourUuid - The tour UUID to use as seed
 * @returns {number} Rating value (1-5)
 */
export const getRating = (tourUuid: string): number => {
    if (!tourUuid) return 0;

    const integerPart = getSeededRandom(tourUuid + '_rating_int', 3, 4);
    const decimalPart = getSeededRandom(tourUuid + '_rating_dec', 0, 9);

    let rating = parseFloat(`${integerPart}.${decimalPart}`);

    return rating;
};

/**
 * Gets star configuration array based on rating value
 * @param {number} rating - Rating value (0-5)
 * @returns {StarType[]} Array of 5 star types
 */
export const getStarConfig = (rating: number): StarType[] => {
    const stars: StarType[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push('full');
        } else if (i === fullStars && hasHalfStar) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }

    return stars;
};
