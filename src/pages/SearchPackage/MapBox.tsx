import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { isValidCoordinate, useMapboxGeocoding } from '@/utils/geoCodingCheck';
import { useApiServices } from '@/services/api';
import { createRoot } from 'react-dom/client';
import MapPopup from '@/components/Map/MapPopup';
import MapMarker from '@/components/Map/MapMarker';
import { theme } from '@/styles/theme';
import { MapPinCheckIcon } from 'lucide-react';
import {
    CityGroup,
    EnhancedMapComponentProps,
    ItineraryItem,
    MapboxErrorEvent,
    MarkerRoot,
} from '@/types/common/maxbox';

const MapContainer = styled.div<{ height: string }>`
    width: 100%;
    height: ${(props) => props.height};
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    box-shadow: ${theme.shadows.md};
    border: 1px solid ${theme.colors.border};
    position: relative;

    .mapboxgl-popup-content {
        background: ${theme.colors.background};
        border-radius: ${theme.borderRadius.md};
        padding: ${theme.spacing.md};
        box-shadow: ${theme.shadows.lg};
        border: 1px solid ${theme.colors.border};
        max-width: 300px;
    }

    .mapboxgl-popup-tip {
        border-top-color: ${theme.colors.background};
    }

    .mapboxgl-popup-close-button {
        color: ${theme.colors.text};
        font-size: ${theme.fontSizes.lg};
        font-weight: ${theme.typography.fontWeight.bold};
        right: 10px;
        top: 10px;
    }

    .mapboxgl-ctrl-group {
        border-radius: ${theme.borderRadius.md};
        box-shadow: ${theme.shadows.md};
    }
`;

const LoadingOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: ${theme.borderRadius.lg};
    backdrop-filter: blur(4px);
`;

const LoadingText = styled.div`
    font-family: ${theme.typography.fontFamily.body};
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    margin-top: ${theme.spacing.md};
    text-align: center;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid ${theme.colors.border};
    border-top: 3px solid ${theme.colors.primary};
    border-radius: ${theme.borderRadius.full};
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ErrorContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, ${theme.colors.lightBackground} 0%, ${theme.colors.background} 100%);
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    text-align: center;
    min-height: 300px;
`;

const ErrorTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #495057;
    margin-bottom: ${theme.spacing.sm};
    font-family: ${theme.typography.fontFamily.body};
`;

const ErrorMessage = styled.div`
    font-size: 14px;
    color: #6c757d;
    margin-bottom: ${theme.spacing.md};
    font-family: ${theme.typography.fontFamily.body};
`;

const ErrorHint = styled.div`
    font-size: 12px;
    color: #868e96;
    line-height: 1.4;
    max-width: 280px;
    font-family: ${theme.typography.fontFamily.body};
`;

const TourFlowContainer = styled.div`
    width: 100%;
    padding: ${theme.spacing.md};
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.md};
    box-shadow: ${theme.shadows.sm};

    ${theme.responsive.maxMobile} {
        padding: ${theme.spacing.sm};
        margin-bottom: ${theme.spacing.sm};
    }
`;

const CityFlow = styled.div`
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    line-height: 1.4;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
    font-family: ${theme.typography.fontFamily.body};

    ${theme.responsive.maxMobile} {
        gap: ${theme.spacing.xs};
    }
`;

const CityName = styled.span`
    font-size: 0.7625rem;
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.primary};
    background: ${theme.colors.lightBackground};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border};

    ${theme.responsive.maxMobile} {
        font-size: 0.6875rem;
        padding: 4px 8px;
    }
`;

const FlowBadge = styled.span<{ type: 'start' | 'end' }>`
    background: ${theme.colors.warning};
    color: white;
    font-size: ${theme.fontSizes.xs};
    font-weight: ${theme.typography.fontWeight.bold};
    padding: 4px 10px;
    border-radius: ${theme.borderRadius.full};
    text-transform: uppercase;

    ${theme.responsive.maxMobile} {
        font-size: 10px;
        padding: 3px 8px;
    }
`;

const FlowArrow = styled.span`
    color: ${theme.colors.muted};
    font-weight: ${theme.typography.fontWeight.regular};
    font-size: ${theme.fontSizes.md};

    ${theme.responsive.maxMobile} {
        font-size: ${theme.fontSizes.sm};
    }
`;

/**
 * MapBox - Page Component
 * @description Displays a map with markers for each itinerary location.
 * Also includes a popup for each marker displaying additional information.
 * If there are more than one itinerary, the map will show all relevant markers.
 * @param {EnhancedMapComponentProps} props - The properties for the map component.
 */
export default function MapBox({ itineraries, tourUuid, height = '500px' }: EnhancedMapComponentProps) {
    const { tours: toursService } = useApiServices();
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const markerRoots = useRef<MarkerRoot[]>([]);

    const hasProcessed = useRef(false);
    const lastProcessedTourUuid = useRef<string>('');

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [processedItineraries, setProcessedItineraries] = useState<ItineraryItem[]>([]);

    const { geocodeLocation } = useMapboxGeocoding();

    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    mapboxgl.accessToken = accessToken;

    /**
     * We processes all itineraries to ensure they have valid coordinates.
     * Then we handle geocoding for locations without coordinates and updates the database.
     * @returns {Promise<void>} Promise that resolves when processing is complete
     */
    const processAllItineraries = useCallback(async () => {
        if (!itineraries || itineraries.length === 0) {
            setProcessedItineraries([]);
            return;
        }

        const processedWithSlots = itineraries.map((item) => {
            if (item.slots && item.slots.length > 0) {
                const firstValidSlot = item.slots.find((slot) => slot.locationNames && slot.locationNames.length > 0);
                if (firstValidSlot?.locationNames?.[0]) {
                    return {
                        ...item,
                        locationNames: firstValidSlot.locationNames,
                        locationName: firstValidSlot.locationNames[0].name,
                    };
                }
            }
            return item;
        });

        const itinerariesNeedingGeocoding = processedWithSlots.filter((item) => {
            const hasValidRootCoords = item.locationNames?.some((loc) =>
                isValidCoordinate(loc.latitude, loc.longitude),
            );
            const hasAnyLocationNames =
                (item.locationNames && item.locationNames.length > 0) ||
                item.slots?.some((s) => s.locationNames && s.locationNames.length > 0);
            return !hasValidRootCoords && !!hasAnyLocationNames;
        });

        if (itinerariesNeedingGeocoding.length === 0) {
            const processedItems = processedWithSlots.map((item) => {
                const validLocation = item.locationNames?.find((location) =>
                    isValidCoordinate(location.latitude, location.longitude),
                );
                return {
                    ...item,
                    latitude: validLocation?.latitude || item.latitude,
                    longitude: validLocation?.longitude || item.longitude,
                    locationName: item.locationNames?.map((l) => l.name).join(', ') || item.locationName,
                };
            });
            setProcessedItineraries(processedItems);
            hasProcessed.current = true;
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Getting locations...');

        const updatedItineraries = [...processedWithSlots];
        const locationsToUpdate: Record<
            number,
            {
                latitude: number;
                longitude: number;
                locationNames: Array<{ name: string; latitude: number; longitude: number }>;
            }
        > = {};

        try {
            for (const item of itinerariesNeedingGeocoding) {
                setLoadingMessage(`Getting location for Day ${item.dayNumber}...`);

                try {
                    let geocodingResult = null;
                    let queryString = '';

                    /**
                     * if slot location is available, we move forward with this
                     */
                    if (!queryString && item.slots && item.slots.length > 0) {
                        const firstSlotWithLocation = item.slots.find(
                            (slot) =>
                                slot.locationNames && slot.locationNames.length > 0 && !!slot.locationNames[0]?.name,
                        );
                        if (firstSlotWithLocation?.locationNames?.[0]?.name) {
                            queryString = firstSlotWithLocation.locationNames[0].name;
                        }
                    }

                    /**
                     * If there are multiple root locations, we handle them properly
                     */
                    if (!queryString && item.locationNames && item.locationNames.length > 1) {
                        const cityName = item.locationNames[0]?.name;
                        const countryName = item.locationNames[1]?.name;

                        if (cityName && countryName && !cityName.includes(',')) {
                            queryString = `${cityName}, ${countryName}`;
                        } else {
                            queryString = cityName || '';
                        }
                    } else if (!queryString && item.locationNames && item.locationNames.length === 1) {
                        queryString = item.locationNames[0].name;
                    }

                    if (item.slots && item.slots.length > 0) {
                        const firstSlotWithLocation = item.slots.find(
                            (slot) =>
                                slot.locationNames && slot.locationNames.length > 0 && !!slot.locationNames[0]?.name,
                        );
                        if (firstSlotWithLocation?.locationNames?.[0]?.name) {
                            queryString = firstSlotWithLocation.locationNames[0].name;
                        }
                    }

                    if (queryString) {
                        geocodingResult = await geocodeLocation(queryString);
                    }

                    if (geocodingResult) {
                        const index = updatedItineraries.findIndex((it) => it.dayNumber === item.dayNumber);
                        if (index !== -1) {
                            updatedItineraries[index] = {
                                ...updatedItineraries[index],
                                latitude: geocodingResult.latitude,
                                longitude: geocodingResult.longitude,
                                locationNames: item.locationNames?.map((location) => ({
                                    ...location,
                                    latitude: geocodingResult.latitude,
                                    longitude: geocodingResult.longitude,
                                })),
                            };

                            const dayId = item.id || item.dayNumber;
                            locationsToUpdate[dayId] = {
                                latitude: geocodingResult.latitude,
                                longitude: geocodingResult.longitude,
                                locationNames: (updatedItineraries[index].locationNames || []).filter(
                                    (loc): loc is { name: string; latitude: number; longitude: number } =>
                                        loc.latitude !== null && loc.longitude !== null,
                                ),
                            };
                        }
                    }
                } catch (error) {
                    console.error(`Failed to geocode Day ${item.dayNumber}:`, error);
                }

                await new Promise((resolve) => setTimeout(resolve, 90));
            }

            /**
             * Then we update the database
             */
            if (tourUuid && Object.keys(locationsToUpdate).length > 0) {
                try {
                    const apiPayload = {
                        tourUuid,
                        days: Object.entries(locationsToUpdate).map(([dayId, data]) => ({
                            id: Number(dayId),
                            latitude: data.latitude.toString(),
                            longitude: data.longitude.toString(),
                            slots: [],
                        })),
                    };

                    const response = await toursService.updateTourLocationData(apiPayload);
                    console.info('Location update response:', response.statusCode === 200 ? 'Created' : 'Updated');

                    hasProcessed.current = true;
                    lastProcessedTourUuid.current = tourUuid;
                } catch (error) {
                    console.error('Failed to update database:', error);
                }
            }

            setProcessedItineraries(updatedItineraries);
        } catch (error) {
            setError(`Failed to process locations: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [itineraries, tourUuid, geocodeLocation]);

    /**
     * Removes all existing markers and their React roots from the map.
     * Called before initializing new markers to prevent memory leaks.
     */
    const cleanupMarkers = useCallback(() => {
        markers.current.forEach((marker) => {
            marker.remove();
        });
        markers.current = [];

        markerRoots.current.forEach(({ root, container }) => {
            try {
                setTimeout(() => {
                    root.unmount();
                    /* we remove the  Remove DOM elements after unmounting */
                    container.remove();
                }, 0);
            } catch (error) {
                console.error('Error unmounting root:', error);
            }
        });
        markerRoots.current = [];
    }, []);

    /**
     * Creates a map marker with popup for a city group.
     * @param {CityGroup} cityGroup - The city group data containing location and day information
     * @param {mapboxgl.Map} map - The Mapbox map instance to add the marker to
     * @returns {mapboxgl.Marker} The created marker instance
     */
    const createMarker = useCallback((cityGroup: CityGroup, map: mapboxgl.Map): mapboxgl.Marker => {
        const markerContainer = document.createElement('div');
        const markerRoot = createRoot(markerContainer);
        markerRoot.render(
            <MapMarker
                dayRange={cityGroup.dayRange}
                isFirst={cityGroup.isFirst}
                isLast={cityGroup.isLast}
                isOffset={cityGroup.isOffset}
            />,
        );

        const popupContainer = document.createElement('div');
        const popupRoot = createRoot(popupContainer);
        popupRoot.render(
            <MapPopup cityName={cityGroup.cityName} dayRange={cityGroup.dayRange} isOffset={cityGroup.isOffset} />,
        );

        const popup = new mapboxgl.Popup({
            offset: [0, -15],
            className: 'mapbox-popup-custom',
        }).setDOMContent(popupContainer);

        const marker = new mapboxgl.Marker(markerContainer, {
            anchor: 'bottom',
        })
            .setLngLat([cityGroup.longitude, cityGroup.latitude])
            .setPopup(popup)
            .addTo(map);

        markerRoots.current.push({
            root: markerRoot,
            container: markerContainer,
        });
        markerRoots.current.push({
            root: popupRoot,
            container: popupContainer,
        });

        return marker;
    }, []);

    /**
     * Initializes the Map-box map with markers, routes, and proper bounds.
     * Sets up navigation controls and handles map events.
     */
    const initializeMap = useCallback(() => {
        if (!mapContainer.current || processedItineraries.length === 0) {
            return;
        }

        const cityGroups = groupItinerariesByCity(processedItineraries);

        if (cityGroups.length === 0) {
            setError('No valid location coordinates available');
            return;
        }

        let loadHandler: (() => void) | null = null;
        let errorHandler: ((e: MapboxErrorEvent) => void) | null = null;
        let isComponentMounted = true;

        try {
            if (map.current) {
                if (loadHandler) {
                    map.current.off('load', loadHandler);
                }
                if (errorHandler) {
                    map.current.off('error', errorHandler);
                }

                cleanupMarkers();

                map.current.remove();
                map.current = null;
            }

            const bounds = new mapboxgl.LngLatBounds();
            cityGroups.forEach((group) => {
                bounds.extend([group.longitude, group.latitude]);
            });

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                bounds: bounds,
                fitBoundsOptions: {
                    padding: {
                        top: 100,
                        bottom: 100,
                        left: 100,
                        right: 100,
                    },
                    maxZoom: 14,
                },
                attributionControl: false,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

            loadHandler = () => {
                if (!isComponentMounted || !map.current) {
                    return;
                }

                try {
                    if (cityGroups.length > 1) {
                        const coordinates = cityGroups.map((group) => [group.longitude, group.latitude]);

                        if (!map.current.getSource('route')) {
                            map.current.addSource('route', {
                                type: 'geojson',
                                data: {
                                    type: 'Feature',
                                    properties: {},
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: coordinates,
                                    },
                                },
                            });
                        }

                        if (!map.current.getLayer('route')) {
                            map.current.addLayer({
                                id: 'route',
                                type: 'line',
                                source: 'route',
                                layout: {
                                    'line-join': 'round',
                                    'line-cap': 'round',
                                },
                                paint: {
                                    'line-color': theme.colors.warning,
                                    'line-width': 3,
                                    'line-opacity': 0.8,
                                    'line-dasharray': [2, 1],
                                },
                            });
                        }
                    }

                    cleanupMarkers();

                    cityGroups.forEach((group) => {
                        if (!isComponentMounted || !map.current) return;

                        try {
                            const marker = createMarker(group, map.current);
                            markers.current.push(marker);
                        } catch (markerError) {
                            console.error('Error creating marker:', markerError);
                        }
                    });

                    if (isComponentMounted) {
                        setError(null);
                    }
                } catch (loadError) {
                    if (isComponentMounted) {
                        setError(
                            `Failed to load map features: ${loadError instanceof Error ? loadError.message : 'Unknown error'}`,
                        );
                    }
                }
            };

            errorHandler = (e: MapboxErrorEvent) => {
                console.error('Mapbox error:', e);
                if (isComponentMounted) {
                    setError(`Failed to load map: ${e.error?.message || 'Unknown error'}`);
                }
            };

            if (map.current) {
                map.current.on('load', loadHandler);
                map.current.on('error', errorHandler);
            }

            return () => {
                isComponentMounted = false;

                if (map.current) {
                    if (loadHandler) {
                        map.current.off('load', loadHandler);
                    }
                    if (errorHandler) {
                        map.current.off('error', errorHandler);
                    }

                    try {
                        if (map.current.getLayer('route')) {
                            map.current.removeLayer('route');
                        }
                        if (map.current.getSource('route')) {
                            map.current.removeSource('route');
                        }
                    } catch (cleanupError) {
                        console.debug('Cleanup error (expected if map is removed):', cleanupError);
                    }
                }

                cleanupMarkers();

                if (map.current) {
                    try {
                        map.current.remove();
                    } catch (removeError) {
                        console.debug('Map remove error:', removeError);
                    }
                    map.current = null;
                }
            };
        } catch (err) {
            console.error('Failed to initialize map:', err);
            setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);

            return () => {
                isComponentMounted = false;
                cleanupMarkers();
                if (map.current) {
                    map.current.remove();
                    map.current = null;
                }
            };
        }
    }, [processedItineraries, cleanupMarkers, createMarker]);

    /**
     * Groups itineraries by city to create grouped markers.
     * Handles consecutive days in the same city as a single marker with day range.
     * @param {ItineraryItem[]} itineraries - Array of itinerary items to group
     * @returns {CityGroup[]} Array of city groups with location and day range data
     */
    const groupItinerariesByCity = (itineraries: ItineraryItem[]) => {
        const validItineraries = itineraries.filter(
            (item) => isValidCoordinate(item.latitude, item.longitude) && item.locationName,
        );

        if (validItineraries.length === 0) return [];

        const cityGroups: CityGroup[] = [];

        let currentCity = '';
        let startDay = 0;
        let coords = { lat: 0, lng: 0 };

        validItineraries.forEach((item, index) => {
            const cityName = extractCityName(item);

            if (cityName !== currentCity) {
                if (currentCity && startDay > 0) {
                    const prevDay = validItineraries[index - 1].dayNumber;
                    cityGroups.push({
                        cityName: currentCity,
                        dayRange: startDay === prevDay ? `${startDay}` : `${startDay}-${prevDay}`,
                        latitude: coords.lat,
                        longitude: coords.lng,
                        isFirst: cityGroups.length === 0,
                        isLast: false,
                        startDay: startDay,
                        endDay: prevDay,
                    });
                }

                currentCity = cityName;
                startDay = item.dayNumber;
                coords = { lat: Number(item.latitude!), lng: Number(item.longitude!) };
            }

            if (index === validItineraries.length - 1) {
                cityGroups.push({
                    cityName: currentCity,
                    dayRange: startDay === item.dayNumber ? `${startDay}` : `${startDay}-${item.dayNumber}`,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    isFirst: cityGroups.length === 0,
                    isLast: true,
                    startDay: startDay,
                    endDay: item.dayNumber,
                });
            }
        });

        if (cityGroups.length > 0) {
            cityGroups[cityGroups.length - 1].isLast = true;
        }

        return handleOverlappingMarkers(cityGroups);
    };

    /**
     * Handles overlapping markers by applying small offsets to prevent visual UX collision.
     * Uses a threshold to detect overlapping coordinates and applies angular offsets.
     * @param {CityGroup[]} cityGroups - Array of city groups to check for overlaps
     * @returns {CityGroup[]} Array of city groups with offset coordinates applied
     */
    const handleOverlappingMarkers = (cityGroups: CityGroup[]): CityGroup[] => {
        const OVERLAP_THRESHOLD = 0.0001;
        const OFFSET_DISTANCE = 0.005; /* 500 meters offset */

        const processedGroups = [...cityGroups];

        for (let i = 0; i < processedGroups.length; i++) {
            for (let j = i + 1; j < processedGroups.length; j++) {
                const group1 = processedGroups[i];
                const group2 = processedGroups[j];

                const latDiff = Math.abs(group1.latitude - group2.latitude);
                const lngDiff = Math.abs(group1.longitude - group2.longitude);

                if (latDiff < OVERLAP_THRESHOLD && lngDiff < OVERLAP_THRESHOLD) {
                    /**
                     * We put a different angle for each overlapping marker
                     */
                    const angle = (j * 45) % 360;
                    const radians = (angle * Math.PI) / 180;

                    processedGroups[j] = {
                        ...group2,
                        latitude: group2.latitude + OFFSET_DISTANCE * Math.sin(radians),
                        longitude: group2.longitude + OFFSET_DISTANCE * Math.cos(radians),
                        isOffset: true,
                    };
                }
            }
        }

        return processedGroups;
    };

    useEffect(() => {
        if (lastProcessedTourUuid.current !== tourUuid) {
            hasProcessed.current = false;
        }

        if (!hasProcessed.current) {
            processAllItineraries();
        } else {
            setProcessedItineraries(itineraries);
        }
    }, [tourUuid, itineraries.length]);

    useEffect(() => {
        if (processedItineraries.length > 0) {
            initializeMap();
        }

        return () => {
            cleanupMarkers();
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [processedItineraries, initializeMap, cleanupMarkers]);

    const validItineraries = useMemo(() => {
        return processedItineraries.filter((item) => isValidCoordinate(item.latitude, item.longitude));
    }, [processedItineraries]);

    /**
     * Extracts a clean city name from itinerary item data.
     * Prioritizes slot location names, then location names, then day title parsing.
     * @param {ItineraryItem} item - The itinerary item to extract city name from
     * @returns {string} The extracted city name
     */
    const extractCityName = (item: ItineraryItem): string => {
        if (item.slots && item.slots.length > 0) {
            const firstSlotWithLocation = item.slots.find(
                (slot) => slot.locationNames && slot.locationNames.length > 0,
            );
            const slotTitle = firstSlotWithLocation?.locationNames?.[0]?.title;
            if (slotTitle) {
                return slotTitle;
            }
        }

        if (item.locationNames && item.locationNames.length > 0) {
            const firstLocation = item.locationNames[0]?.name;
            if (firstLocation) {
                if (firstLocation.includes(',')) {
                    return firstLocation.split(',')[0].trim();
                }
                if (!firstLocation.includes('stan') || firstLocation.includes(',')) {
                    return firstLocation.trim();
                }
            }
        }

        if (item.dayTitle) {
            const titleParts = item.dayTitle.split(/[–-]/);
            if (titleParts.length > 0) {
                const location = titleParts[0].split('(')[0].trim();
                if (location && location !== 'Day') {
                    return location;
                }
            }
        }

        if (!item.locationName) return '';

        const parts = item.locationName.split(',');
        return parts[0].trim();
    };

    /**
     * Renders a visual flow showing the tour progression through different cities.
     * Displays city names with start/end badges and arrow indicators.
     * @param {Object} props - Component props
     * @param {ItineraryItem[]} props.itineraries - Array of itinerary items to display
     * @returns {JSX.Element|null} The tour flow component or null if no valid itineraries
     */
    const TourFlow = ({ itineraries }: { itineraries: ItineraryItem[] }) => {
        const validItineraries = itineraries.filter(
            (item) => isValidCoordinate(item.latitude, item.longitude) && item.locationName,
        );

        if (validItineraries.length === 0) return null;

        const cityNames = validItineraries.map((item) => extractCityName(item));
        const uniqueCities = cityNames.filter((city, index, arr) => index === 0 || arr[index - 1] !== city);

        return (
            <TourFlowContainer>
                <CityFlow>
                    {uniqueCities.length > 1 && (
                        <>
                            <FlowBadge type="start">Start</FlowBadge>
                            <FlowArrow>→</FlowArrow>
                        </>
                    )}
                    {uniqueCities.map((city, index) => (
                        <React.Fragment key={index}>
                            <CityName>{city}</CityName>
                            {index < uniqueCities.length - 1 && <FlowArrow>→</FlowArrow>}
                        </React.Fragment>
                    ))}
                    {uniqueCities.length > 1 && (
                        <>
                            <FlowArrow>→</FlowArrow>
                            <FlowBadge type="end">End</FlowBadge>
                        </>
                    )}
                </CityFlow>
            </TourFlowContainer>
        );
    };

    if (error) {
        return (
            <MapContainer height={height}>
                <ErrorContainer>
                    <MapPinCheckIcon
                        style={{ color: theme.colors.accent, marginBottom: '1rem' }}
                        height={32}
                        width={32}
                    />
                    <ErrorTitle>Map Unavailable</ErrorTitle>
                    <ErrorMessage>No valid location coordinates available</ErrorMessage>
                    <ErrorHint>
                        The location data for this tour is currently unavailable. Please check the tour details or
                        contact support if this persists.
                    </ErrorHint>
                </ErrorContainer>
            </MapContainer>
        );
    }

    return (
        <>
            <TourFlow itineraries={validItineraries} />
            <MapContainer height={height}>
                {isLoading && (
                    <LoadingOverlay>
                        <LoadingSpinner />
                        <LoadingText>{loadingMessage}</LoadingText>
                    </LoadingOverlay>
                )}

                <div
                    ref={mapContainer}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'inherit',
                    }}
                />
            </MapContainer>
        </>
    );
}
