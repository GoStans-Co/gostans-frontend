import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll To Top - Global Auto Focus Component
 * This component automatically scrolls the page to the top whenever the route changes.
 * It uses a timeout to ensure the scroll happens after the route change is processed.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
