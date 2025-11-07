"use client";

import { useGoogleMapsLoader } from "@/context/GoogleMapsContext";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_CENTER = {
  lat: -23.55052, // São Paulo
  lng: -46.633308,
};

interface GoogleMapsProps {
  latitude?: number | null;
  longitude?: number | null;
  zoom?: number;
  height?: string;
  onLocationChange?: (coordinates: { latitude: number; longitude: number }) => void;
  interactive?: boolean;
}

export default function GoogleMaps({
  latitude,
  longitude,
  zoom = 12,
  height,
  onLocationChange,
  interactive,
}: GoogleMapsProps) {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const isInteractive = interactive ?? typeof onLocationChange === "function";

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: height ?? "400px",
    }),
    [height],
  );

  const hasCoordinates =
    typeof latitude === "number" &&
    !Number.isNaN(latitude) &&
    typeof longitude === "number" &&
    !Number.isNaN(longitude);

  const derivedCenter = useMemo(
    () => (hasCoordinates ? { lat: latitude!, lng: longitude! } : DEFAULT_CENTER),
    [hasCoordinates, latitude, longitude],
  );

  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    hasCoordinates ? { lat: latitude!, lng: longitude! } : null,
  );

  useEffect(() => {
    if (hasCoordinates) {
      const nextPosition = { lat: latitude!, lng: longitude! };
      setMarkerPosition(nextPosition);
    } else if (!isInteractive) {
      setMarkerPosition(null);
    }
  }, [hasCoordinates, latitude, longitude, isInteractive]);

  const handleLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      const nextPosition = { lat, lng };
      setMarkerPosition(nextPosition);
      onLocationChange?.({ latitude: lat, longitude: lng });
    },
    [onLocationChange],
  );

  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!isInteractive) {
        return;
      }

      const latLng = event.latLng;
      if (!latLng) {
        return;
      }

      handleLocationUpdate(latLng.lat(), latLng.lng());
    },
    [handleLocationUpdate, isInteractive],
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!isInteractive) {
        return;
      }

      const latLng = event.latLng;
      if (!latLng) {
        return;
      }

      handleLocationUpdate(latLng.lat(), latLng.lng());
    },
    [handleLocationUpdate, isInteractive],
  );

  useEffect(() => {
    if (loadError) {
      console.error("Erro ao carregar Google Maps:", loadError);
    }
  }, [loadError]);

  if (!isLoaded) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f4f5",
        }}
      >
        <span className="text-sm text-muted-foreground">Carregando mapa...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fef2f2",
        }}
      >
        <span className="text-sm text-destructive">Falha ao carregar o mapa</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition ?? derivedCenter}
      zoom={zoom}
      onClick={isInteractive ? handleMapClick : undefined}
      options={{
        mapId: "47b8cc93327a8bbc91a2e6e6",
        draggableCursor: isInteractive ? undefined : "default",
        disableDoubleClickZoom: !isInteractive,
        draggable: isInteractive,
        scrollwheel: isInteractive,
        keyboardShortcuts: isInteractive,
        gestureHandling: isInteractive ? "greedy" : "none",
        clickableIcons: isInteractive,
        zoomControl: isInteractive,
        streetViewControl: false,
        mapTypeControl: isInteractive,
        fullscreenControl: isInteractive,
      }}
    >
      {markerPosition ? (
        <Marker
          position={markerPosition}
          draggable={isInteractive}
          onDragEnd={handleMarkerDragEnd}
        />
      ) : null}
    </GoogleMap>
  );
}
