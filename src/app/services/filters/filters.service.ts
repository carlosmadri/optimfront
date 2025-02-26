import { computed, inject, Injectable, signal } from '@angular/core';
import { SiglumService } from '@services/siglum/siglum.service';
import { apiParams } from '@models/filters.model';
import { LocationService } from '@services/location/location.service';
import { LOCATION_TYPES } from '@models/location.model';
import {
  ACTIVE_WORKFORCE_TYPES,
  activeWorkforceValues,
  availabilityReasonValues,
  contractTypeValues,
  DIRECT_INDIRECT_TYPES,
  directIndirectValues,
} from '@models/employee.model';
import { AuthService } from '../auth/auth.service';

export interface GeneralFilter {
  field: string;
  values: string[];
}

export interface EmployeeFilter {
  siglums: string[];
  firstName: string | null;
  lastName: string | null;
  countries: string[];
  site: string[];
  direct: string[];
  activeWorkforce: string[];
  availabilityReason: string[];
  contractType: string[];
  job: string | null;
  WCBC: string | null;
  FTE: number | null;
}

export interface JobRequestFilter {
  siglumHR: string[];
  workdayNumber: string | null;
  status: string[];
  activeWorkforce: string[];
  startDate: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private siglumService = inject(SiglumService);
  private locationService = inject(LocationService);
  private authService = inject(AuthService);

  #yearFilter = signal<number>(new Date().getFullYear());
  yearFilter = this.#yearFilter.asReadonly();

  #generalFilter = signal<GeneralFilter[]>([]);
  generalFilter = this.#generalFilter.asReadonly();

  #employeeFilter = signal<GeneralFilter[]>([]);
  employeeFilter = this.#employeeFilter.asReadonly();

  #jobRequestFilter = signal<GeneralFilter[]>([]);
  jobRequestFilter = this.#jobRequestFilter.asReadonly();

  paramsFilter = computed(() => {
    const yearFilters = this.generateYearParams(this.yearFilter());
    const generalFilters = this.generateGeneralParams(this.generalFilter());
    const waybackFilters: string[] = [];
    const userFilter = this.getUserNameFilter();
    if (yearFilters && generalFilters && waybackFilters && userFilter) {
      return [userFilter, yearFilters, ...generalFilters, ...waybackFilters];
    }
    return;
  });

  employeeParamsFilter = computed(() => {
    const employeeParams = this.generateGeneralParams(this.employeeFilter());
    if (employeeParams) {
      return employeeParams;
    }
    return;
  });

  jobRequestParamsFilter = computed(() => {
    const jobRequestParams = this.generateGeneralParams(this.jobRequestFilter());
    if (jobRequestParams) {
      return jobRequestParams;
    }
    return;
  });

  allFilterValues = computed(() => {
    const allValues: Record<string, string[]> = {
      ...this.siglumService.allFormattedSiglums(),
      ...this.locationService.getSitesFilterValues(),
      ...this.locationService.getCountriesFilterValues(),
      activeWorkforce: activeWorkforceValues,
      direct: directIndirectValues,
    };
    return allValues;
  });

  async initializeFilters() {
    await this.siglumService.getAllSiglums();
    await this.locationService.getAllLocations();
  }

  setYearFilter(year: number) {
    this.#yearFilter.set(year);
  }

  private generateYearParams(year: number): string {
    return `yearFilter=${year}`;
  }

  private generateGeneralParams(filters: GeneralFilter[]) {
    return filters.map((filter) => {
      return filter.values.map((value) => `${filter.field}=${value}`).join('&');
    });
  }

  getFilterFields() {
    let allFields: string[] = [];
    allFields = allFields.concat(
      this.siglumService.getSiglumFilterFields(),
      this.locationService.getLocationsFilterFields(),
      Object.values(ACTIVE_WORKFORCE_TYPES),
      Object.values(DIRECT_INDIRECT_TYPES),
    );

    return allFields;
  }

  private getUserNameFilter() {
    const user = this.authService.user();
    if (user?.userName) {
      return `userSelected=${user.userName}`;
    }
    return;
  }

  getFilterValues(field: string, selectedCountries?: string[]): string[] {
    if (field === LOCATION_TYPES.SITE && selectedCountries && selectedCountries.length > 0) {
      return this.locationService.getSitesFilterValues(selectedCountries).site;
    }
    return this.allFilterValues()[field];
  }

  getLocationId(site: string): number {
    return this.locationService.allLocations().find((location) => location[LOCATION_TYPES.SITE] === site)!.id;
  }

  getSiglumId(siglumHR: string): number {
    return this.siglumService.allSiglums().find((siglum) => siglum.siglumHR === siglumHR)!.id;
  }

  getAlternativeFilterValues(field: string): string[] {
    switch (
      field //Temporalmente hasta que la implementacion del backend este completa.
    ) {
      case 'availabilityReason':
        return availabilityReasonValues;
      case 'contractType':
        return contractTypeValues;
      default:
        return [];
    }
  }

  getAllSiglumsHR() {
    return this.siglumService.allSiglumsHR().siglumHR;
  }

  updateGeneralFilter(field: string, values: string[]) {
    const fieldApiParam = apiParams[field];
    const generalFilter = this.generalFilter();
    const filterIndex = generalFilter.findIndex((filter) => filter.field === fieldApiParam);
    if (filterIndex > -1) {
      generalFilter[filterIndex] = { field: fieldApiParam, values };
      this.#generalFilter.set([...generalFilter]);
    } else {
      this.#generalFilter.set([...this.generalFilter(), { field: fieldApiParam, values }]);
    }
  }

  updateFilters(filters: JobRequestFilter | EmployeeFilter, activeFilters: GeneralFilter[]): GeneralFilter[] {
    Object.entries(filters).forEach((entry) => {
      const [key, filterValue] = entry;
      let values: string[] = [];
      const fieldApiParam = apiParams[key];
      const filterIndex = activeFilters.findIndex((filter) => filter.field === fieldApiParam);
      if (!filterValue || filterValue.length === 0) {
        if (activeFilters[filterIndex]) {
          activeFilters.splice(filterIndex, 1);
        }
        return;
      }
      if (typeof filterValue === 'string') {
        values = [filterValue];
      } else {
        values = filterValue;
      }
      if (filterIndex > -1) {
        activeFilters[filterIndex] = { field: fieldApiParam, values };
      } else {
        activeFilters = [...activeFilters, { field: fieldApiParam, values }];
      }
    });
    return [...activeFilters];
  }

  updateEmployeeFilter(filters: EmployeeFilter) {
    const employeeFilter = this.employeeFilter();
    const updatedFilters = this.updateFilters(filters, employeeFilter);
    this.#employeeFilter.set([...updatedFilters]);
  }

  updateJobRequestFilter(filters: JobRequestFilter) {
    const jobRequestFilter = this.jobRequestFilter();
    const updatedFilters = this.updateFilters(filters, jobRequestFilter);
    this.#jobRequestFilter.set(updatedFilters);
  }

  removeGeneralFilter(field: string) {
    const fieldApiParam = apiParams[field];
    const generalFilter = this.generalFilter();
    const fieldIndex = generalFilter.findIndex((filter) => filter.field === fieldApiParam);
    if (fieldIndex > -1) {
      generalFilter.splice(fieldIndex, 1);
    }
    this.#generalFilter.set([...generalFilter]);
  }

  clearFilters() {
    this.#generalFilter.set([]);
  }

  clearEmployeeFilters() {
    this.#employeeFilter.set([]);
  }

  clearJobRequestFilters() {
    this.#jobRequestFilter.set([]);
  }
}
