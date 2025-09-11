"use client";

import GoogleMapReact from "google-map-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';

export type MarkerType = "point-de-vente" | "grossiste" | "grande-surface";

export interface MarkerData {
  lat: number;
  lng: number;
  title?: string;
  type: MarkerType;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: Array<MarkerData>;
}

interface MarkerProps {
  lat: number;
  lng: number;
  title?: string;
  type: MarkerType;
  onClick?: (lat: number, lng: number) => void;
}

const getMarkerStyle = (type: MarkerType) => {
  switch (type) {
    case "point-de-vente":
      return {
        backgroundColor: "#3B82F6", // Blue
        borderColor: "#1E40AF",
        label: "pointDeVente",
        labelColor: "#1E40AF"
      };
    case "grossiste":
      return {
        backgroundColor: "#10B981", // Green
        borderColor: "#047857",
        label: "grossiste",
        labelColor: "#047857"
      };
    case "grande-surface":
      return {
        backgroundColor: "#F59E0B", // Amber
        borderColor: "#D97706",
        label: "grandeSurface",
        labelColor: "#D97706"
      };
    default:
      return {
        backgroundColor: "#DC2626", // Red
        borderColor: "#B91C1C",
        label: "marker",
        labelColor: "#B91C1C"
      };
  }
};

const Marker: React.FC<MarkerProps> = ({ lat, lng, title, type, onClick }) => {
  const style = getMarkerStyle(type);
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('map');
  
  const handleClick = () => {
    if (onClick) {
      onClick(lat, lng);
    }
  };
  
  const getLocalizedLabel = (labelKey: string) => {
    switch (labelKey) {
      case "pointDeVente":
        return t('pointDeVente');
      case "grossiste":
        return t('grossiste');
      case "grandeSurface":
        return t('grandeSurface');
      default:
        return "Marker";
    }
  };
  
  return (
    <div className="relative">
      <div
        className="w-4 h-4 border-2 rounded-full cursor-pointer transition-transform hover:scale-125"
        title={title || getLocalizedLabel(style.label)}
        style={{
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          transform: "translate(-50%, -50%)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />
      {isHovered && (
        <div 
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg border z-50 whitespace-nowrap text-xs font-medium"
          style={{
            color: style.labelColor,
            borderColor: style.borderColor,
          }}
        >
          {title || getLocalizedLabel(style.label)}
          <div 
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-l border-t rotate-45"
            style={{ borderColor: style.borderColor }}
          />
        </div>
      )}
    </div>
  );
};

const MapLegend: React.FC = () => {
  const markerTypes: MarkerType[] = ["point-de-vente", "grossiste", "grande-surface"];
  const t = useTranslations('map');
  
  const getLocalizedLabel = (type: MarkerType) => {
    switch (type) {
      case "point-de-vente":
        return t('pointDeVente');
      case "grossiste":
        return t('grossiste');
      case "grande-surface":
        return t('grandeSurface');
      default:
        return "Marker";
    }
  };
  
  return (
    <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-10">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">{t('legend')}</h3>
      <div className="space-y-2">
        {markerTypes.map((type) => {
          const style = getMarkerStyle(type);
          return (
            <div key={type} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full border"
                style={{
                  backgroundColor: style.backgroundColor,
                  borderColor: style.borderColor,
                }}
              />
              <span className="text-xs text-gray-600">{getLocalizedLabel(type)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom, markers }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [hasError, setHasError] = useState(false);
  const [map, setMap] = useState<any>(null);
  const t = useTranslations('map');

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {t('apiKeyNotConfigured')}
      </div>
    );
  }

  const handleMarkerClick = (lat: number, lng: number) => {
    if (map) {
      // Check if the target location is within bounds
      const bounds = {
        north: 37.5,
        south: 18.5,
        west: -20.0,
        east: 20.0,
      };
      
      // Clamp the coordinates to stay within bounds
      const clampedLat = Math.max(bounds.south, Math.min(bounds.north, lat));
      const clampedLng = Math.max(bounds.west, Math.min(bounds.east, lng));
      const clampedLocation = { lat: clampedLat, lng: clampedLng };
      
      // Instantly set zoom and center
      map.setZoom(12);
      map.setCenter(clampedLocation);
    }
  };



  const handleGoogleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    try {
      setMap(map); // Store map reference for marker click handling
      
      // Apply black and white map styles focused on Algeria
      map.setOptions({
        zoomControl: true,
        zoomControlOptions: {
          style: maps.ZoomControlStyle.DEFAULT,
          position: maps.ControlPosition.RIGHT_CENTER
        },
        gestureHandling: 'greedy',
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            elementType: "labels.icon",
            stylers: [{ visibility: "off" }]
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#000000" }, { weight: 2 }, { visibility: "on" }]
          },
          {
            featureType: "administrative.province",
            elementType: "geometry.stroke",
            stylers: [{ color: "#666666" }, { weight: 1 }, { visibility: "on" }]
          },
          {
            featureType: "administrative.locality",
            elementType: "geometry.stroke",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#bdbdbd" }]
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }]
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "road.arterial",
            elementType: "labels.text.fill",
            stylers: [{ color: "#757575" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#dadada" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#616161" }]
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }]
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }]
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9c9c9" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9e9e9e" }]
          }
        ],
        restriction: {
          latLngBounds: {
            north: 37.5,
            south: 18.5,
            west: -20.0,
            east: 20.0,
          },
          strictBounds: true,
        },
        minZoom: 5,
        maxZoom: 15,
      });
    } catch (error) {
      setHasError(true);
    }
  };



  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {t('errorLoadingMaps')}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={center}
        defaultZoom={zoom}
        onGoogleApiLoaded={handleGoogleApiLoaded}
        yesIWantToUseGoogleMapApiInternals
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            lat={marker.lat}
            lng={marker.lng}
            title={marker.title}
            type={marker.type}
            onClick={handleMarkerClick}
          />
        ))}
      </GoogleMapReact>
      <MapLegend />
    </div>
  );
};

export default GoogleMap;
