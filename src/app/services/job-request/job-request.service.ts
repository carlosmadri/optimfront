import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CRUD_JR, GET_JR_COUNT_BY_TYPE } from '@src/app/shared/api.urls';
import { JobRequest, JobRequestApiResponse, JobRequestSummaryTypes } from '@src/app/shared/models/job-request.model';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobRequestService {
  #jobRequests = signal<JobRequest[]>([]);
  jobRequests = this.#jobRequests.asReadonly();

  #totalJobRequests = signal<number>(0);
  totalJobRequests = this.#totalJobRequests.asReadonly();

  #summaryType = signal<JobRequestSummaryTypes[]>([]);
  summaryType = this.#summaryType.asReadonly();

  private http: HttpClient = inject(HttpClient);

  async getJobRequests(params?: string[]): Promise<void> {
    try {
      const jobRequests$ = this.http.get<JobRequestApiResponse>(`${CRUD_JR}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const JRApiResponse = await firstValueFrom(jobRequests$);
      this.#jobRequests.set(JRApiResponse.content);
      this.#totalJobRequests.set(JRApiResponse.totalElements);
    } catch (error) {
      this.#jobRequests.set([]);
      throw error;
    }
  }

  async getTypesSummary(params?: string[]): Promise<void> {
    try {
      const summaryAPI$ = this.http
        .get<JobRequestSummaryTypes[]>(`${GET_JR_COUNT_BY_TYPE}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const summaryAPI = await firstValueFrom(summaryAPI$);
      this.#summaryType.set(summaryAPI);
    } catch (error) {
      this.#summaryType.set([]);
      throw error;
    }
  }

  async getJobRequest(jobRequestId: number): Promise<JobRequest> {
    const jrAPI$ = this.http.get<JobRequest>(`${CRUD_JR}${jobRequestId}`).pipe(catchError(this.handleError));
    const jobRequestAPI = await firstValueFrom(jrAPI$);
    return jobRequestAPI;
  }

  async createJobRequest(jobRequest: JobRequest): Promise<JobRequest> {
    const jrAPI$ = this.http.post<JobRequest>(`${CRUD_JR}`, jobRequest).pipe(catchError(this.handleError));
    const jobRequestAPI = await firstValueFrom(jrAPI$);
    return jobRequestAPI;
  }

  async updateJobRequest(jobRequest: JobRequest, id: string): Promise<JobRequest> {
    const jrAPI$ = this.http.put<JobRequest>(`${CRUD_JR}/${id}`, jobRequest).pipe(catchError(this.handleError));
    const jobRequestAPI = await firstValueFrom(jrAPI$);
    return jobRequestAPI;
  }

  async deleteJobRequest(id: string): Promise<void> {
    const jrAPI$ = this.http
      .delete<void>(`${CRUD_JR}/${id}`, {
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
    const response: HttpResponse<void> = await firstValueFrom(jrAPI$);
    if (response.status === 204) {
      console.log('Job request deleted successfully');
      return;
    } else {
      console.warn(`Unexpected status code: ${response.status}`);
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.' + error.message));
  }
}
