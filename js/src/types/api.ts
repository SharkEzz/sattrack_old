/**
 * Generic response type sent from the backend when tracking a satellite
 */
export type TrackingResponse = {
  SatName: string;
  GeneratedAt: string;
  Visible: boolean;
  Azimuth: number;
  Elevation: number;
  Range: number;
  RangeRate: number;
  SatAltitude: number;
  SatLat: number;
  SatLng: number;
};

/** Standard API response with generic data type */
export type APIResponse<T> = {
  Status: number;
  Message: string;
  Data: T;
};
