import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
    typography: {
        fontFamily: {
            display: 'Poppins, sans-serif',
            body: 'Inter, sans-serif',
        },
        fontSize: {
            displayLarge: '57px',
        },
        fontWeight: {
            regular: 400,
            medium: 500,
            bold: 700,
        },
        lineHeight: {
            displayLarge: '64px',
        },
        letterSpacing: {
            displayLarge: '-0.25px',
        },
        variants: {
            displayBold: {
                fontFamily: 'var(--Font-familiy-display, Poppins)',
                fontSize: 'var(--Font-size-display-large, 57px)',
                fontWeight: 700,
                lineHeight: 'var(--Font-line-height-display-large, 64px)',
                letterSpacing: 'var(--Font-tracking-display-large, -0.25px)',
            },
            displayMedium: {
                fontFamily: 'var(--Font-familiy-display, Poppins)',
                fontSize: 'var(--Font-size-display-large, 57px)',
                fontWeight: 500,
                lineHeight: 'var(--Font-line-height-display-large, 64px)',
                letterSpacing: 'var(--Font-tracking-display-large, -0.25px)',
            },
        },
    },
    responsive: {
        mobile: `@media (max-width: 767px)`,
        tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
        laptop: `@media (min-width: 1024px) and (max-width: 1279px)`,
        desktop: `@media (min-width: 1280px)`,
        maxMobile: `@media (max-width: 767px)`,
        minTablet: `@media (min-width: 768px)`,
        minLaptop: `@media (min-width: 1024px)`,
        minDesktop: `@media (min-width: 1280px)`,
    },
    colors: {
        grayBackground: '#F0F3F5',
        primary: '#0F2846',
        secondary: '#1F65A0',
        accent: '#FF6B35',
        text: '#333333',
        lightText: '#666666',
        background: '#FFFFFF',
        silverBackground: 'B7B7B7',
        lightBackground: '#F5F5F5',
        border: '#E5E5E5',
        error: '#FF4D4D',
    },
    fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        full: '9999px',
    },
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    transitions: {
        default: '0.3s ease',
        fast: '0.15s ease',
        slow: '0.5s ease',
    },
};

export type Theme = typeof theme;
