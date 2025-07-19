import { COOKIE_OPTIONS } from '@/services/cache/cookieAuthService';

const setCookie = (name: string, value: string, options = COOKIE_OPTIONS) => {
    let cookieString = `${name}=${value}; path=${options.path}`;

    if (options.maxAge) {
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + options.maxAge * 1000);
        cookieString += `; expires=${expiryDate.toUTCString()}`;
    }

    if (options.secure) {
        cookieString += '; secure';
    }

    cookieString += `; samesite=${options.sameSite}`;

    document.cookie = cookieString;
};

const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';').reduce(
        (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                acc[key] = decodeURIComponent(value);
            }
            return acc;
        },
        {} as Record<string, string>,
    );
    return cookies[name] || null;
};

export { getCookie, setCookie, deleteCookie };
