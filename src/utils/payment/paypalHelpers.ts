/**
 * Get PayPal return URLs for payment success and cancellation
 * @returns {Object} Object containing return URLs
 */
export const getPayPalReturnUrls = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.gostans.com/api/v1' || window.location.origin;

    return {
        returnUrl: `${baseUrl}/payment-success/return`,
        cancelUrl: `${baseUrl}/payment-cancel/return`,
    };
};

/**
 * Get the base URL for API requests
 * @returns {string} The base URL for API requests
 */
export const getBaseUrl = () => {
    const returnUrl = import.meta.env.VITE_API_URL || 'https://api.gostans.com/api/v1' || window.location.origin;
    return returnUrl;
};
