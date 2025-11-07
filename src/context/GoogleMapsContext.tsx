"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { createContext, useContext } from "react";

const GoogleMapsContext = createContext({ isLoaded: false, loadError: null as unknown });

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    mapIds: [process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!],
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
