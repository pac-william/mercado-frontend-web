"use client";

import { useGoogleMapsLoader } from "@/context/GoogleMapsContext";
import { Circle, GoogleMap, Marker } from "@react-google-maps/api";
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
  controls?: boolean;
  deliveryRadius?: number; // Raio de entrega em metros
}

export default function GoogleMaps({
  latitude,
  longitude,
  zoom = 12,
  height,
  onLocationChange,
  interactive,
  controls,
  deliveryRadius,
}: GoogleMapsProps) {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const isInteractive = interactive ?? typeof onLocationChange === "function";
  const showControls = controls !== false && isInteractive;

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

  // Calcula o zoom apropriado baseado no raio de entrega
  const calculatedZoom = useMemo(() => {
    if (!deliveryRadius || !hasCoordinates || !latitude) return zoom;
    
    // Fórmula aproximada para calcular zoom baseado no raio em metros
    // Ajusta o zoom para que o círculo seja visível com uma margem
    const radiusInKm = deliveryRadius / 1000;
    let calculatedZoom = zoom;
    
    if (radiusInKm >= 50) {
      calculatedZoom = 10;
    } else if (radiusInKm >= 20) {
      calculatedZoom = 11;
    } else if (radiusInKm >= 10) {
      calculatedZoom = 12;
    } else if (radiusInKm >= 5) {
      calculatedZoom = 13;
    } else if (radiusInKm >= 2) {
      calculatedZoom = 14;
    } else if (radiusInKm >= 1) {
      calculatedZoom = 15;
    } else if (radiusInKm >= 0.5) {
      calculatedZoom = 16;
    } else {
      calculatedZoom = 17;
    }
    
    return calculatedZoom;
  }, [deliveryRadius, hasCoordinates, latitude, zoom]);

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

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
      
      // Ajusta o zoom e bounds quando há raio de entrega
      if (hasCoordinates && deliveryRadius && deliveryRadius > 0) {
        map.setZoom(calculatedZoom);
        
        // Ajusta os bounds para incluir o círculo completo
        const circle = new google.maps.Circle({
          center: mapCenter,
          radius: deliveryRadius,
        });
        
        const bounds = circle.getBounds();
        if (bounds) {
          map.fitBounds(bounds, 50); // Padding em pixels
        }
      }
    },
    [mapCenter, hasCoordinates, deliveryRadius, calculatedZoom],
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
        zoom={calculatedZoom}
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
          disableDefaultUI: !isInteractive || controls === false,
          gestureHandling: isInteractive ? "greedy" : "none",
          clickableIcons: isInteractive,
          zoomControl: showControls,
          streetViewControl: false,
          mapTypeControl: showControls,
          fullscreenControl: showControls,
        }}
      >
        {!isInteractive && hasCoordinates ? <Marker position={mapCenter} /> : null}
        {hasCoordinates && deliveryRadius && deliveryRadius > 0 && (
          <Circle
            onLoad={(circle) => {
              circleRef.current = circle;
              // Ajusta os bounds quando o círculo é carregado
              if (mapRef.current) {
                const bounds = circle.getBounds();
                if (bounds) {
                  mapRef.current.fitBounds(bounds, 50); // Padding em pixels
                }
              }
            }}
            center={mapCenter}
            radius={deliveryRadius}
            options={{
              fillColor: "#3b82f6",
              fillOpacity: 0.15,
              strokeColor: "#3b82f6",
              strokeOpacity: 0.5,
              strokeWeight: 2,
            }}
          />
        )}
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

