interface BaseTrackingResponse {
  SatName: string;
  GeneratedAt: string;
  Visible: boolean;
}

interface WsTrackingResponse extends BaseTrackingResponse {
  Azimuth: number;
  Elevation: number;
  Range: number;
  RangeRate: number;
  SatAltitude: number;
  SatLat: number;
  SatLng: number;
}

/** Standard API response */
export type APIResponse = {
  Status: number;
  Message: string;
  Data: WsTrackingResponse;
};
