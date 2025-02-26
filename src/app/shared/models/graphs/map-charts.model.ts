import { Topology, GeometryCollection } from 'topojson-specification';

export interface Region {
  name: string;
  coords: [number, number];
  value: number;
}

export interface MapData {
  name: string;
  regions: Region[];
  coords: [number, number];
  total: number;
}

export interface CountryFeature {
  type: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}
export interface WorldAtlas extends Topology {
  objects: {
    countries: GeometryCollection;
  };
}

export interface Cluster {
  x: number;
  y: number;
  points: (CountryFeature | Region)[];
}

export type DataType = CountryFeature | Region;
