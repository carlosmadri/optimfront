import { SIGLUM_TYPES } from '@models/siglum.model';
import { LOCATION_TYPES } from '@models/location.model';
import { ACTIVE_WORKFORCE_TYPES, DIRECT_INDIRECT_TYPES } from '@models/employee.model';

export const apiParams: Record<string, string> = {
  [SIGLUM_TYPES.SIGLUMHR]: `siglum.${SIGLUM_TYPES.SIGLUMHR}`,
  [SIGLUM_TYPES.SIGLUM6]: `siglum.${SIGLUM_TYPES.SIGLUM6}`,
  [SIGLUM_TYPES.SIGLUM5]: `siglum.${SIGLUM_TYPES.SIGLUM5}`,
  [SIGLUM_TYPES.SIGLUM4]: `siglum.${SIGLUM_TYPES.SIGLUM4}`,
  [LOCATION_TYPES.COUNTRY]: `costCenter.location.${LOCATION_TYPES.COUNTRY}`,
  [LOCATION_TYPES.SITE]: `costCenter.location.${LOCATION_TYPES.SITE}`,
  [DIRECT_INDIRECT_TYPES.DIRECT]: `employee.${DIRECT_INDIRECT_TYPES.DIRECT}`,
  [ACTIVE_WORKFORCE_TYPES.ACTIVE_WORKFORCE]: `employee.${ACTIVE_WORKFORCE_TYPES.ACTIVE_WORKFORCE}`,
  firstName: `employee.firstName`,
  lastName: `employee.lastName`,
  availabilityReason: `employee.availabilityReason`,
  contractType: `employee.contractType`,
  job: `employee.job`,
  WCBC: `employee.WCBC`,
  FTE: `employee.FTE`,
  description: `jobRequest.description`,
  startDate: `jobRequest.startDate`,
  status: `jobRequest.status`,
  workdayNumber: `jobRequest.workdayNumber`,
  workerType: `jobRequest.${ACTIVE_WORKFORCE_TYPES.ACTIVE_WORKFORCE}`,
};
