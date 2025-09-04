export const profileCacheManager = {
    clearCache: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userCacheStatus');
        }
    },
};
