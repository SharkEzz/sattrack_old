import { useState } from 'react';

function useLocation() {
  const [initialized, setInitialized] = useState(false);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    alt: null,
  });

  const getLocation = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setLocation({
          lat: Number(latitude.toFixed(2)),
          lng: Number(longitude.toFixed(2)),
          alt: altitude ? Number(altitude.toFixed(2)) : 0,
        });
        setInitialized(true);
      },
      () => null,
    );
  };

  return {
    initialized,
    location,
    getLocation,
  };
}

export default useLocation;
