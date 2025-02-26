import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GET_TEAM_OUTLOOK } from '@app/shared/api.urls';
import { ApiTeamOutlook, TeamOutlook } from '@app/shared/models/team-outlook.model';
import { TeamOutlookAdapter } from '@src/app/shared/adapters/team-outlook/team-outlook.adapter';
import { firstValueFrom, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamOutlookService {
  #teamOutlook = signal<TeamOutlook | null>(null);
  teamOutlook = this.#teamOutlook.asReadonly();

  private http: HttpClient = inject(HttpClient);
  private teamOutlookAdapter: TeamOutlookAdapter = inject(TeamOutlookAdapter);

  async getTeamOutlook(params?: string[]): Promise<void> {
    try {
      const apiData$ = this.http.get<ApiTeamOutlook>(`${GET_TEAM_OUTLOOK}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const response = await firstValueFrom(apiData$);
      const teamOutlook = this.teamOutlookAdapter.adapt(response);
      this.#teamOutlook.set(teamOutlook);
    } catch (error) {
      this.#teamOutlook.set(null);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.' + error.message));
  }
}
