"use client";

import { useGoogleMapsLoader } from "@/context/GoogleMapsContext";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Pin } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  const initialCenter = useMemo(
    () => (hasCoordinates ? { lat: latitude!, lng: longitude! } : DEFAULT_CENTER),
    [hasCoordinates, latitude, longitude],
  );

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (hasCoordinates) {
      const nextCenter = { lat: latitude!, lng: longitude! };
      setMapCenter(nextCenter);
      if (mapRef.current) {
        mapRef.current.setCenter(nextCenter);
      }
    } else if (!isInteractive) {
      setMapCenter(DEFAULT_CENTER);
      if (mapRef.current) {
        mapRef.current.setCenter(DEFAULT_CENTER);
      }
    }
  }, [hasCoordinates, latitude, longitude, isInteractive]);

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      map.setCenter(mapCenter);
    },
    [mapCenter],
  );

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const handleMapIdle = useCallback(() => {
    if (!isInteractive || !mapRef.current) {
      return;
    }

    const currentCenter = mapRef.current.getCenter();
    if (!currentCenter) {
      return;
    }

    const lat = currentCenter.lat();
    const lng = currentCenter.lng();
    setMapCenter((previous) => {
      if (previous.lat === lat && previous.lng === lng) {
        return previous;
      }
      return { lat, lng };
    });

    onLocationChange?.({ latitude: lat, longitude: lng });
  }, [isInteractive, onLocationChange]);

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
    <div
      style={{
        ...containerStyle,
        position: "relative",
      }}
    >
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={mapCenter}
        zoom={zoom}
        onLoad={handleMapLoad}
        onUnmount={handleMapUnmount}
        onIdle={handleMapIdle}
        options={{
          mapId: "47b8cc93327a8bbc91a2e6e6",
          draggableCursor: isInteractive ? undefined : "default",
          disableDoubleClickZoom: !isInteractive,
          draggable: isInteractive,
          scrollwheel: isInteractive,
          keyboardShortcuts: isInteractive,
          disableDefaultUI: !isInteractive,
          gestureHandling: isInteractive ? "greedy" : "none",
          clickableIcons: isInteractive,
          zoomControl: isInteractive,
          streetViewControl: false,
          mapTypeControl: isInteractive,
          fullscreenControl: isInteractive,
        }}
      >
        {!isInteractive && hasCoordinates ? <Marker position={mapCenter} /> : null}
      </GoogleMap>

      {isInteractive ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            color: "#ef4444",
          }}
        >
          <Pin className="size-6 text-destructive" />
        </div>
      ) : null}
    </div>
  );
}

