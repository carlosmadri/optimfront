export enum LOCATION_TYPES {
  COUNTRY = 'country',
  SITE = 'site',
}

export interface Location {
  country: string;
  site: string;
  id: number;
  kapisCode: string;
  latitude: number;
  longitude: number;
  purchaseOrders: string;
  workload: string;
}

export interface LocationAPiResponse {
  content: Location[];
}

export type AllLocations = Record<string, { sites: string[] }>;

export interface FTEsLocationAPI {
  id: number;
  [LOCATION_TYPES.COUNTRY]: string;
  [LOCATION_TYPES.SITE]: string;
  fteSum: number;
  longitude: number;
  latitude: number;
}
