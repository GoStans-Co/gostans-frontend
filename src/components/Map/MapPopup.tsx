import styled from 'styled-components';
import { Search } from 'lucide-react';

type MapPopupProps = {
    cityName: string;
    dayRange: string;
};

const PopupContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 6px;
    min-width: 180px;
    max-width: 300px;
    background-color: white;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
`;

const PopupContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const CityTitle = styled.h4`
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.3;
    word-break: break-word;
    text-align: left;
`;

const DayRange = styled.span`
    font-size: 13px;
    color: #666;
    font-weight: 500;
    letter-spacing: 0.3px;
    text-align: left;
`;

const SearchButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 600;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    font-family: inherit;

    &:hover {
        background-color: #0056b3;
    }

    &:active {
        transform: scale(0.98);
    }

    svg {
        width: 14px;
        height: 14px;
        flex-shrink: 0;
    }
`;

/**
 * Render a map popup showing a city's name, a day range, and a button to search the city on Google.
 *
 * @param cityName - The name of the city to display in the popup
 * @param dayRange - Textual representation of the day range to display (e.g., "1–3")
 * @returns The rendered popup element
 */
export default function MapPopup({ cityName, dayRange }: MapPopupProps) {
    const handleGoogleSearch = (e: React.MouseEvent) => {
        e.stopPropagation();
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(cityName)}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <PopupContainer>
            <PopupContent>
                <CityTitle>{cityName}</CityTitle>
                <DayRange>Days {dayRange}</DayRange>
            </PopupContent>
            <SearchButton onClick={handleGoogleSearch}>
                <Search size={14} />
                Search
            </SearchButton>
        </PopupContainer>
    );
}