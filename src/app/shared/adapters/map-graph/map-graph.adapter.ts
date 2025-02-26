import { Injectable } from '@angular/core';
import { Adapter } from '../adapter.interface';
import { FTEsLocationAPI } from '../../models/location.model';
import { MapData, Region } from '../../models/graphs/map-charts.model';

@Injectable({
  providedIn: 'root',
})
export class MapGraphAdapter implements Adapter<FTEsLocationAPI[], MapData[]> {
  adapt(apiData: FTEsLocationAPI[]): MapData[] {
    const countryData: MapData[] = [];

    // Group the data by country
    const groupedByCountry = apiData.reduce(
      (acc, location) => {
        if (!acc[location.country]) {
          acc[location.country] = [];
        }
        acc[location.country].push(location);
        return acc;
      },
      {} as Record<string, FTEsLocationAPI[]>,
    );

    // Process each country
    for (const [country, locations] of Object.entries(groupedByCountry)) {
      const regions: Region[] = locations.map((location) => ({
        name: location.site,
        coords: [location.longitude, location.latitude],
        value: location.fteSum,
      }));

      const total = regions.reduce((sum, region) => sum + region.value, 0);

      // Calculate the central coordinates for the country
      const centerCoords = this.calculateCenterCoords(regions);

      countryData.push({
        name: country,
        regions,
        coords: centerCoords,
        total,
      });
    }

    return countryData;
  }

  calculateCenterCoords(regions: Region[]): [number, number] {
    const sumCoords = regions.reduce(
      (sum, region) => {
        sum[0] += region.coords[0];
        sum[1] += region.coords[1];
        return sum;
      },
      [0, 0],
    );

    return [sumCoords[0] / regions.length, sumCoords[1] / regions.length];
  }
}
