export interface BaseLayer {
    name: string;
    url: string;
  }
  
  export interface DataLayer {
    name: string;
    group: string;
    url: string;
    type: string;
    timeWindow: number;
    timeField: string;
    locationField: string;
    layer: any;
  }
  
  export interface Terrain {
    url: string;
  }