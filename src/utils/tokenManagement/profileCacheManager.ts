/**
 * Profile cache manager for handling user
 * profile data in local storage
 */
export const profileCacheManager = {
    clearCache: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userCacheStatus');
        }
    },
};
