export type LocationByTime = {
  timestamp: string | Date;
  location: { lat: number; lon: number };
}

export type Entity = {
  id: string;
  assetType: string;
  sourceType: string;
  locationByTime: LocationByTime[];
};
