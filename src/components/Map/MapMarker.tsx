import { theme } from '@/styles/theme';
import { useState } from 'react';
import styled from 'styled-components';

type MapMarkerProps = {
    dayRange: string;
    isFirst?: boolean;
    isLast?: boolean;
};

const MarkerContainer = styled.div<{
    $backgroundColor: string;
    $isHovered: boolean;
}>`
    position: relative;
    background: ${(props) => props.$backgroundColor};
    min-width: 40px;
    height: 36px;
    border-radius: ${theme.borderRadius.lg};
    border: 3px solid ${theme.colors.border};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transform: ${(props) => (props.$isHovered ? 'scale(1.15)' : 'scale(1)')};
    transition: all 0.2s ease;
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.background};
    font-size: ${theme.fontSizes.xs};
    user-select: none;
    line-height: 1;
    z-index: 100;
    padding: 0 2px;

    &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${(props) => props.$backgroundColor};
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
`;

/**
 * MapMarker - UI Component
 * Displays a marker on the map for a specific day range.
 */
export default function MapMarker({ dayRange, isFirst = false, isLast = false }: MapMarkerProps) {
    const [isHovered, setIsHovered] = useState(false);

    const backgroundColor = isFirst ? theme.colors.secondary : isLast ? theme.colors.error : theme.colors.warning;

    return (
        <MarkerContainer
            $backgroundColor={backgroundColor}
            $isHovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Days ${dayRange}`}
            title={`Days ${dayRange}`}
        >
            {dayRange}
        </MarkerContainer>
    );
}
