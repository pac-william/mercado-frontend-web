"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { createContext, useContext } from "react";

const GoogleMapsContext = createContext({ isLoaded: false, loadError: null as unknown });

export function GoogleMapsProvider({ children, googleMapsApiKey, googleMapId }: { children: React.ReactNode, googleMapsApiKey: string, googleMapId: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: googleMapsApiKey,
    mapIds: [googleMapId],
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMapsLoader() {
  return useContext(GoogleMapsContext);
}
