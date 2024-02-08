export interface StandardAssetSchema {
    "entityId": string,
    "assetType": string,
    "sourceType": string,
    "location": {
        "lat": number,
        "lon": number
    },
    "timestamp": string
}