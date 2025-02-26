import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CRUD_LEVER, GET_TOTAL_LEVERS_EOY } from '@app/shared/api.urls';
import { LeversTotal, LeversTotalAPI } from '@app/shared/models/levers-total.model';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { Lever } from '@models/lever.model';
import { LeversEoyAdapter } from '@src/app/shared/adapters/levers-eoy/levers/levers-eoy.adapter';

@Injectable({
  providedIn: 'root',
})
export class LeversService {
  #totalByEoY = signal<LeversTotal[]>([]);
  totalByEoY = this.#totalByEoY.asReadonly();

  private http: HttpClient = inject(HttpClient);
  private leversEoyAdapter: LeversEoyAdapter = inject(LeversEoyAdapter);

  async addLever(lever: Lever): Promise<Lever> {
    const lever$ = this.http.post<Lever>(CRUD_LEVER, lever).pipe(catchError(this.handleError));
    return firstValueFrom(lever$);
  }

  async getLever(id: number): Promise<Lever> {
    const lever$ = this.http.get<Lever>(`${CRUD_LEVER}/${id}`);
    return firstValueFrom(lever$);
  }

  async editLever(id: number, lever: Lever): Promise<Lever> {
    const lever$ = this.http.put<Lever>(`${CRUD_LEVER}/${id}`, lever);
    return firstValueFrom(lever$);
  }

  async deleteLever(id: number): Promise<Lever> {
    const lever$ = this.http.delete<Lever>(`${CRUD_LEVER}/${id}`).pipe(catchError(this.handleError));
    return firstValueFrom(lever$);
  }

  async getTotalByEoY(params?: string[]): Promise<void> {
    try {
      const leversAPI$ = this.http.get<LeversTotalAPI[]>(`${GET_TOTAL_LEVERS_EOY}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const responseAPI = await firstValueFrom(leversAPI$);
      const response = this.leversEoyAdapter.adapt(responseAPI);
      this.#totalByEoY.set(response);
    } catch (error) {
      this.#totalByEoY.set([]);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
