'use client';

import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  isSupported: boolean;
}

export const useGeolocation = (options: PositionOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    accuracy: null,
    error: null,
    loading: true,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  });

  const onSuccess = useCallback((position: GeolocationPosition) => {
    setState((prev) => ({
      ...prev,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      accuracy: position.coords.accuracy,
      loading: false,
      error: null,
    }));
  }, []);

  const onError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
    }
    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
    }));
  }, []);

  const getPosition = useCallback(() => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    });
  }, [state.isSupported, onSuccess, onError, options]);

  useEffect(() => {
    getPosition();
  }, []); // Get initial position on mount

  return { ...state, refresh: getPosition };
};
