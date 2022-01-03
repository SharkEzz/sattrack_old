export type WebsocketTrackingResponse = {
  Azimuth: number;
  Elevation: number;
  GeneratedAt: string;
  Range: number;
  RangeRate: number;
  SatAltitude: number;
  SatLat: number;
  SatLng: number;
  SatName: string;
  Visible: boolean;
};

export type APIResponse = {
  Status: number;
  Message: string;
  Data: WebsocketTrackingResponse;
};
