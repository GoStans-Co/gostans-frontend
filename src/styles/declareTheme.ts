import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        typography: {
            fontFamily: {
                display: string;
                body: string;
            };
            fontSize: {
                displayLarge: string;
            };
            fontWeight: {
                regular: number;
                medium: number;
                bold: number;
            };
            lineHeight: {
                displayLarge: string;
            };
            letterSpacing: {
                displayLarge: string;
            };
            variants: {
                displayBold: {
                    fontFamily: string;
                    fontSize: string;
                    fontWeight: number;
                    lineHeight: string;
                    letterSpacing: string;
                };
                displayMedium: {
                    fontFamily: string;
                    fontSize: string;
                    fontWeight: number;
                    lineHeight: string;
                    letterSpacing: string;
                };
            };
        };
        responsive: {
            mobile: string;
            tablet: string;
            laptop: string;
            desktop: string;
            maxMobile: string;
            minTablet: string;
            minLaptop: string;
            minDesktop: string;
        };
        colors: {
            primary: string;
            grayBackground: string;
            secondary: string;
            accent: string;
            text: string;
            lightText: string;
            silverBackground: string;
            background: string;
            lightBackground: string;
            border: string;
            error: string;
            success: string;
            warning: string;
            info: string;
            muted: string;
            mutedForeground: string;
            gradientStart: string;
            gradientEnd: string;
        };
        fontSizes: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
            '5xl': string;
            '6xl': string;
            '7xl': string;
        };
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
            '5xl': string;
        };
        borderRadius: {
            sm: string;
            md: string;
            lg: string;
            full: string;
        };
        breakpoints: {
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
        };
        shadows: {
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
        };
        transitions: {
            default: string;
            fast: string;
            slow: string;
        };
    }
}
