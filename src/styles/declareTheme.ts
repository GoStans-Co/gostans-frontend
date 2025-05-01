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
                // Add more sizes
            };
            fontWeight: {
                regular: number;
                medium: number;
                bold: number;
            };
            lineHeight: {
                displayLarge: string;
                // Add more line heights
            };
            letterSpacing: {
                displayLarge: string;
                // Add more letter spacing values
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
        };
        spacing: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
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
        };
        transitions: {
            default: string;
            fast: string;
            slow: string;
        };
    }
}
