import { useState, useEffect } from 'react';

interface LocationState {
  coords: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      });
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    };

    const error = (err: GeolocationPositionError) => {
      setState({
        coords: null,
        error: err.message,
        loading: false,
      });
    };

    // Automatically prompt when hook is mounted
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return state;
}
