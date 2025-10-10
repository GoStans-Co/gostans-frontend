import { theme } from '@/styles/theme';
import styled from 'styled-components';

type MapPopupProps = {
    cityName: string;
    dayRange: string;
};

const PopupContainer = styled.div`
    font-family: ${theme.typography.fontFamily.body};
    padding: 0;
    min-width: 200px;
`;

const PopupTitle = styled.h4`
    margin: 0 0 8px 0;
    color: ${theme.colors.primary};
    font-weight: 700;
    font-size: ${theme.fontSizes.sm};
    font-family: ${theme.typography.fontFamily.body};
    text-align: left;
`;

const PopupLocation = styled.p`
    margin: 0 0 0;
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.xs};
    display: flex;
    align-items: center;
    gap: 6px;
`;

/**
 * MapPopup - UI Component
 * Displays information about a specific location on the map.
 */
export default function MapPopup({ cityName, dayRange }: MapPopupProps) {
    return (
        <PopupContainer>
            <PopupTitle>
                Days {dayRange}: {cityName}
            </PopupTitle>
            <PopupLocation>
                <span>📍</span>
                <span>{cityName}</span>
            </PopupLocation>
        </PopupContainer>
    );
}
