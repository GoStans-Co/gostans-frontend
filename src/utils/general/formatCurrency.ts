/**
 * Formats a number or string as currency.
 * @param {string | number} amount - The amount to format.
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} - Formatted currency string.
 */
export const formatCurrency = (amount: string | number, currency: string = 'USD'): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numAmount)) {
        return 'Price unavailable';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount);
};
