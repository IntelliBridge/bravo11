export type SourceProperties = {
  entityId: string;
  assetType: string;
  sourceType: string;
  location: { lat: number; lon: number };
  timestamp: string | Date; // This comes back as a string, but we should be able to store as a date on the frontend
};
