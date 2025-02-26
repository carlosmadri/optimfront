import { inject, Injectable, signal } from '@angular/core';
import { CRUD_COST_CENTER } from '@app/shared/api.urls';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { CostCenter } from '@models/cost-center.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CostCenterService {
  #allCostCenters = signal<CostCenter[]>([]);
  allCostCenters = this.#allCostCenters.asReadonly();

  private http: HttpClient = inject(HttpClient);

  async getAllCostCenters(): Promise<void> {
    try {
      const costCenters$ = this.http.get<CostCenter[]>(CRUD_COST_CENTER).pipe(catchError(this.handleError));
      const response = await firstValueFrom(costCenters$);
      this.#allCostCenters.set(response);
    } catch (error) {
      this.#allCostCenters.set([]);
      throw error;
    }
  }

  async editCostCenter(id: number, costCenter: Partial<CostCenter>): Promise<CostCenter> {
    const costCenter$ = this.http.put<CostCenter>(`${CRUD_COST_CENTER}/${id}`, costCenter);
    return firstValueFrom(costCenter$);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
