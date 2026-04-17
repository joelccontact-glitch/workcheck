/**
 * Calculates the distance between two points in meters using the Haversine formula
 */
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const dr1 = (lat1 * Math.PI) / 180;
  const dr2 = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(dr1) * Math.cos(dr2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Checks if a user is within a specified radius (in meters) of a target location
 */
export const isWithinZone = (
  userLat: number,
  userLon: number,
  zoneLat: number,
  zoneLon: number,
  radius: number = 200 // Default 200m
): boolean => {
  const distance = getDistance(userLat, userLon, zoneLat, zoneLon);
  return distance <= radius;
};

/**
 * Checks if a user is within any of the provided work zones
 */
export const findActiveZone = (
  userLat: number,
  userLon: number,
  zones: WorkZone[]
): WorkZone | null => {
  for (const zone of zones) {
    if (isWithinZone(userLat, userLon, zone.latitude, zone.longitude, zone.radius)) {
      return zone;
    }
  }
  return null;
};

export const DEFAULT_WORK_ZONE = {
  id: 'default',
  name: "본사 (Office)",
  latitude: 37.4979,
  longitude: 127.0276,
  radius: 200,
};

export interface WorkZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}
