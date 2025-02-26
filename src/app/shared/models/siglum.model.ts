export enum SIGLUM_TYPES {
  SIGLUMHR = 'siglumHR',
  SIGLUM6 = 'siglum6',
  SIGLUM5 = 'siglum5',
  SIGLUM4 = 'siglum4',
}

export interface Siglum {
  id: number;
  siglumHR: string;
  siglum6: string;
  siglum5: string;
  siglum4: string;
}

export interface SiglumAPiResponse {
  content: Siglum[];
}

export interface AllSiglums {
  [SIGLUM_TYPES.SIGLUMHR]: string[];
  [SIGLUM_TYPES.SIGLUM6]: string[];
  [SIGLUM_TYPES.SIGLUM5]: string[];
  [SIGLUM_TYPES.SIGLUM4]: string[];
}
