import { useState } from 'react';

export type LocationType = {
  lat: number;
  lng: number;
  alt: number;
};

export type GetLocationFn = () => void;

function useLocation() {
  const [initialized, setInitialized] = useState(false);
  const [location, setLocation] = useState<LocationType>({
    lat: 0,
    lng: 0,
    alt: 0,
  });

  const getLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, altitude } = position.coords;
      setLocation({
        lat: Number(latitude.toFixed(2)),
        lng: Number(longitude.toFixed(2)),
        alt: altitude ? Number(altitude.toFixed(2)) : 0,
      });
      setInitialized(true);
    });
  };

  return {
    initialized,
    location,
    getLocation,
  };
}

export default useLocation;
