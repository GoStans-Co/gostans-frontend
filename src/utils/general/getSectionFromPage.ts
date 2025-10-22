import { PageSection } from '@/pages/MyPage';

/**
 * Maps a section parameter string to the
 * corresponding PageSection enum value.
 * @param sectionParam - The section parameter
 * string from URL or other source
 */
export const getSectionFromParam = (sectionParam: string | null): PageSection => {
    const sectionMap: Record<string, PageSection> = {
        trips: PageSection.TRIPS,
        favorites: PageSection.FAVORITES,
        paymentMethods: PageSection.PAYMENT_MANAGE,
        coupons: PageSection.COUPONS,
        profile: PageSection.PROFILE,
    };

    return sectionMap[sectionParam || ''] || PageSection.PROFILE;
};
