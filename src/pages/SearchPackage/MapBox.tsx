import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { isValidCoordinate, useMapboxGeocoding } from '@/utils/geoCodingCheck';
import { useApiServices } from '@/services/api';
import { createRoot } from 'react-dom/client';
import MapPopup from '@/components/Map/MapPopup';
import MapMarker from '@/components/Map/MapMarker';
import { theme } from '@/styles/theme';

type ItineraryItem = {
    dayNumber: number;
    dayTitle: string;
    description: string;
    locationNames?: Array<{
        name: string;
        latitude: number | null;
        longitude: number | null;
    }>;
    locationName?: string;
    latitude?: number | null;
    longitude?: number | null;
    accommodation?: string;
    includedMeals?: string;
};

type EnhancedMapComponentProps = {
    itineraries: ItineraryItem[];
    tourUuid: string;
    height?: string;
    zoom?: number;
    showRoute?: boolean;
    onLocationUpdate?: (dayNumber: number, latitude: number, longitude: number) => void;
};

type MarkerRoot = {
    root: ReturnType<typeof createRoot>;
    container: HTMLElement;
};

type CityGroup = {
    cityName: string;
    dayRange: string;
    latitude: number;
    longitude: number;
    isFirst: boolean;
    isLast: boolean;
    startDay: number;
    endDay: number;
};

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
    background: ${theme.colors.lightBackground};
    color: ${theme.colors.error};
    font-family: ${theme.typography.fontFamily.body};
    border-radius: ${theme.borderRadius.lg};
    padding: ${theme.spacing.xl};
    text-align: center;
`;

const TourFlowContainer = styled.div`
    width: 100%;
    padding: ${theme.spacing.md};
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.md};
    box-shadow: ${theme.shadows.sm};
`;

const CityFlow = styled.div`
    font-size: ${theme.fontSizes.md};
    color: ${theme.colors.text};
    line-height: 1.4;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${theme.spacing.md};
    font-family: ${theme.typography.fontFamily.body};
`;

const CityName = styled.span`
    font-size: ${theme.fontSizes.sm};
    font-weight: ${theme.typography.fontWeight.regular};
    color: ${theme.colors.primary};
    background: ${theme.colors.lightBackground};
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
`;

const FlowArrow = styled.span`
    color: ${theme.colors.muted};
    font-weight: ${theme.typography.fontWeight.bold};
    font-size: ${theme.fontSizes.lg};
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

    const processAllItineraries = useCallback(async () => {
        if (!itineraries || itineraries.length === 0) {
            setProcessedItineraries([]);
            return;
        }

        /* here we check first which itineraries need geocoding */
        const itinerariesNeedingGeocoding = itineraries.filter((item) => {
            /* check if we have valid coordinates in locationNames */
            const hasValidCoords = item.locationNames?.some((loc) => isValidCoordinate(loc.latitude, loc.longitude));
            return !hasValidCoords && item.locationNames && item.locationNames.length > 0;
        });

        if (itinerariesNeedingGeocoding.length === 0) {
            /* here we use the existing coordinates from locationNames */
            const processedItems = itineraries.map((item) => {
                const validLocation = item.locationNames?.find((loc) => isValidCoordinate(loc.latitude, loc.longitude));
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

        if (hasProcessed.current && lastProcessedTourUuid.current === tourUuid) {
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Getting locations...');

        const updatedItineraries = [...itineraries];
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
                    /* try to geocode each location name in order */
                    let geocodingResult = null;
                    for (const location of item.locationNames || []) {
                        if (location.name && location.name.trim()) {
                            geocodingResult = await geocodeLocation(location.name);
                            if (geocodingResult) break;
                        }
                    }

                    if (geocodingResult) {
                        const index = updatedItineraries.findIndex((it) => it.dayNumber === item.dayNumber);
                        if (index !== -1) {
                            /* then we update the itinerary with geocoded coordinates */
                            updatedItineraries[index] = {
                                ...updatedItineraries[index],
                                latitude: geocodingResult.latitude,
                                longitude: geocodingResult.longitude,
                                locationNames: item.locationNames?.map((loc) => ({
                                    ...loc,
                                    latitude: geocodingResult.latitude,
                                    longitude: geocodingResult.longitude,
                                })),
                            };

                            /* then we prepare update for backend */
                            locationsToUpdate[item.dayNumber] = {
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

            /* here we update db with new coordinates */
            if (tourUuid && Object.keys(locationsToUpdate).length > 0) {
                try {
                    const apiPayload = Object.entries(locationsToUpdate).reduce(
                        (acc, [day, data]) => {
                            acc[Number(day)] = {
                                latitude: data.latitude,
                                longitude: data.longitude,
                            };
                            return acc;
                        },
                        {} as Record<number, { latitude: number; longitude: number }>,
                    );

                    const response = await toursService.updateTourLocationData(tourUuid, apiPayload);
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

    const cleanupMarkers = useCallback(() => {
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        markerRoots.current.forEach(({ root }) => {
            root.unmount();
        });
        markerRoots.current = [];
    }, []);

    const createMarker = useCallback((cityGroup: CityGroup, map: mapboxgl.Map): mapboxgl.Marker => {
        const markerContainer = document.createElement('div');
        const markerRoot = createRoot(markerContainer);
        markerRoot.render(
            <MapMarker dayRange={cityGroup.dayRange} isFirst={cityGroup.isFirst} isLast={cityGroup.isLast} />,
        );

        const popupContainer = document.createElement('div');
        const popupRoot = createRoot(popupContainer);
        popupRoot.render(<MapPopup cityName={cityGroup.cityName} dayRange={cityGroup.dayRange} />);

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

    const initializeMap = useCallback(() => {
        if (!mapContainer.current || processedItineraries.length === 0) {
            return;
        }

        const cityGroups = groupItinerariesByCity(processedItineraries);

        if (cityGroups.length === 0) {
            setError('No valid location coordinates available');
            return;
        }

        try {
            if (map.current) {
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

            /* single load handler for only one location */
            map.current.on('load', () => {
                if (!map.current) return;

                if (cityGroups.length > 1) {
                    const coordinates = cityGroups.map((group) => [group.longitude, group.latitude]);

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

                    map.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round',
                        },
                        paint: {
                            'line-color': `${theme.colors.warning}`,
                            'line-width': 3,
                            'line-opacity': 0.8,
                            'line-dasharray': [2, 1],
                        },
                    });
                }

                cityGroups.forEach((group) => {
                    const marker = createMarker(group, map.current!);
                    markers.current.push(marker);
                });

                setError(null);
            });

            map.current.on('error', (e) => {
                setError(`Failed to load map: ${e.error.message}`);
            });
        } catch (err) {
            setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, [processedItineraries, cleanupMarkers, createMarker]);

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

        return cityGroups;
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

    const validItineraries = processedItineraries.filter((item) => isValidCoordinate(item.latitude, item.longitude));

    const extractCityName = (item: ItineraryItem): string => {
        if (item.locationNames && item.locationNames.length > 0) {
            const cityCandidate = item.locationNames[1]?.name || item.locationNames[0]?.name;
            if (cityCandidate && !cityCandidate.includes('+')) {
                return cityCandidate.trim();
            }
        }

        if (!item.locationName) return '';

        const parts = item.locationName.split(',');
        if (parts.length >= 4) {
            return parts[2].trim();
        } else if (parts.length >= 2) {
            return parts[1].trim();
        }

        return item.locationName.trim();
    };

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
                    {uniqueCities.map((city, index) => (
                        <React.Fragment key={index}>
                            <CityName>{city}</CityName>
                            {index < uniqueCities.length - 1 && <FlowArrow>→</FlowArrow>}
                        </React.Fragment>
                    ))}
                </CityFlow>
            </TourFlowContainer>
        );
    };

    if (error) {
        return (
            <MapContainer height={height}>
                <ErrorContainer>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Map Unavailable</div>
                    <div style={{ fontSize: '14px' }}>{error}</div>
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
