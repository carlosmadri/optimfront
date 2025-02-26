import { Location } from '@models/location.model';

export interface CostCenter {
  id: number;
  costCenterCode: string;
  costCenterFinancialCode: string;
  efficiency: number;
  rateOwn: number;
  rateSub: number;
  location: Location;
}

export interface CostCenterAPiResponse {
  content: CostCenter[];
}
