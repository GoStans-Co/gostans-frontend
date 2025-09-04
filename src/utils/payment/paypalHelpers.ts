export const getPayPalReturnUrls = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.gostans.com/api/v1' || window.location.origin;

    return {
        returnUrl: `${baseUrl}/payment-success/return`,
        cancelUrl: `${baseUrl}/payment-cancel/return`,
    };
};

/* for environment variables */
export const getBaseUrl = () => {
    const returnUrl = import.meta.env.VITE_API_URL || 'https://api.gostans.com/api/v1' || window.location.origin;
    return returnUrl;
};
