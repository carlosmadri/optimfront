import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AllSiglums, Siglum, SIGLUM_TYPES, SiglumAPiResponse } from '@models/siglum.model';
import { GET_ALL_SIGLUMS } from '@app/shared/api.urls';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiglumService {
  #allFormattedSiglums = signal<AllSiglums | null>(null);
  allFormattedSiglums = this.#allFormattedSiglums.asReadonly();

  #allSiglums = signal<Siglum[]>([]);
  allSiglums = this.#allSiglums.asReadonly();

  #allSiglumsHR = signal<{ siglumHR: string[] }>({ siglumHR: [] });
  allSiglumsHR = this.#allSiglumsHR.asReadonly();

  private http = inject(HttpClient);

  async getAllSiglums(): Promise<void> {
    try {
      const siglums$ = this.http.get<SiglumAPiResponse>(`${GET_ALL_SIGLUMS}`).pipe(catchError(this.handleError));
      const response = await firstValueFrom(siglums$);
      this.#allSiglums.set(response.content);
      this.#allFormattedSiglums.set(this.formatAllSiglums(response.content));
    } catch (error) {
      this.#allSiglums.set([]);
      this.#allFormattedSiglums.set(null);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  formatAllSiglums(siglums: Siglum[]): AllSiglums {
    const res: AllSiglums = {
      siglumHR: [],
      siglum6: [],
      siglum5: [],
      siglum4: [],
    };
    const allSiglumHR: { siglumHR: string[] } = { siglumHR: [] };
    const siglumKeyObj: Record<string, SIGLUM_TYPES> = {};
    siglums.forEach((siglum) => {
      allSiglumHR.siglumHR.push(siglum.siglumHR);
      siglumKeyObj[siglum.siglumHR] = SIGLUM_TYPES.SIGLUMHR;
      siglumKeyObj[siglum.siglum6] = SIGLUM_TYPES.SIGLUM6;
      siglumKeyObj[siglum.siglum5] = SIGLUM_TYPES.SIGLUM5;
      siglumKeyObj[siglum.siglum4] = SIGLUM_TYPES.SIGLUM4;
    });
    Object.keys(siglumKeyObj).forEach((key) => {
      res[siglumKeyObj[key]].push(key);
    });
    this.#allSiglumsHR.set(allSiglumHR);
    return res;
  }

  getSiglumFilterFields() {
    return Object.values(SIGLUM_TYPES);
  }

  getSiglumFilterValues(field: SIGLUM_TYPES) {
    return this.allFormattedSiglums()![field];
  }
}
