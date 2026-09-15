"use client";

import { useEffect } from "react";

/**
 * Implicit Background GPS Auto-Updater
 * Renders NOTHING (returns null).
 * Automatically updates donor's live GPS coordinates & current city in the background when the app opens.
 */
export default function LiveGPSLocation() {
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let detectedCity = "";

        // Reverse Geocoding using OpenStreetMap Nominatim
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
          );
          if (res.ok) {
            const data = await res.json();
            detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.state ||
              data.address?.county ||
              "";
          }
        } catch (_) {}

        // Send to backend silently
        try {
          await fetch("/api/donor/location/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: lat,
              longitude: lng,
              city: detectedCity,
            }),
          });
        } catch (_) {}
      },
      (err) => {
        // Silent failure for background geolocation
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return null;
}
