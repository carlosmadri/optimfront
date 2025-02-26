import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GET_ALL_LOCATIONS, GET_FTE_LOCATIONS } from '@app/shared/api.urls';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { LOCATION_TYPES, LocationAPiResponse, Location, AllLocations, FTEsLocationAPI } from '@models/location.model';
import { MapData } from '@src/app/shared/models/graphs/map-charts.model';
import { MapGraphAdapter } from '@src/app/shared/adapters/map-graph/map-graph.adapter';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  #allLocations = signal<Location[]>([]);
  allLocations = this.#allLocations.asReadonly();

  #allFormattedLocations = signal<AllLocations | null>(null);
  allFormattedLocations = this.#allFormattedLocations.asReadonly();

  #allCountries = signal<string[]>([]);
  allCountries = this.#allCountries.asReadonly();

  #allSites = signal<string[]>([]);
  allSites = this.#allSites.asReadonly();

  #fteLocations = signal<MapData[]>([]);
  fteLocations = this.#fteLocations.asReadonly();

  private http = inject(HttpClient);
  private mapGraphAdapter: MapGraphAdapter = inject(MapGraphAdapter);

  async getAllLocations(): Promise<void> {
    try {
      const locations$ = this.http.get<LocationAPiResponse>(`${GET_ALL_LOCATIONS}`).pipe(catchError(this.handleError));
      const response = await firstValueFrom(locations$);
      this.#allLocations.set(response.content);
      this.#allFormattedLocations.set(this.formatAllLocations(response.content));
    } catch (error) {
      this.#allLocations.set([]);
      this.#allFormattedLocations.set(null);
      throw error;
    }
  }

  async getFTEsLocations(params?: string[]): Promise<void> {
    try {
      const locations$ = this.http.get<FTEsLocationAPI[]>(`${GET_FTE_LOCATIONS}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const response = await firstValueFrom(locations$);
      const mapData = this.mapGraphAdapter.adapt(response);
      this.#fteLocations.set(mapData);
    } catch (error) {
      this.#fteLocations.set([]);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  formatAllLocations(locations: Location[]) {
    const allCountries: string[] = [];
    let allSites: string[] = [];
    const allFormattedLocations: AllLocations = {};
    locations.forEach((location) => {
      if (!allFormattedLocations[location.country]) {
        allFormattedLocations[location.country] = {
          sites: [],
        };
      }
      allFormattedLocations[location.country].sites.push(location.site);
    });
    Object.keys(allFormattedLocations).forEach((key) => {
      allCountries.push(key);
      allFormattedLocations[key].sites = [...new Set(allFormattedLocations[key].sites)];
      allSites = allSites.concat(allFormattedLocations[key].sites);
    });
    this.#allCountries.set(allCountries);
    this.#allSites.set(allSites);
    return allFormattedLocations;
  }

  getLocationsFilterFields(): string[] {
    return Object.values(LOCATION_TYPES);
  }

  getCountriesFilterValues() {
    return { country: this.allCountries() };
  }

  getSitesFilterValues(countries?: string[]) {
    if (countries) {
      if (this.allFormattedLocations()) {
        return { site: countries.flatMap((country) => this.allFormattedLocations()![country].sites) };
      } else {
        return { site: [] };
      }
    } else {
      return { site: this.allSites() };
    }
  }
}
