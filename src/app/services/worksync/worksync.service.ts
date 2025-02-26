import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { WorkloadEvolutionAdapter } from '@src/app/shared/adapters/workload-evolution/workload-evolution.adapter';
import { WorkloadPerProgramAdapter } from '@src/app/shared/adapters/workload-per-program.adapter';
import { WorkloadWorkforceAdapter } from '@src/app/shared/adapters/workload-workforce/workload-workforce.adapter';
import {
  CRUD_PPSID,
  CRUD_WORKLOAD,
  GET_WORKLOAD_DIRECT_RATIO,
  GET_WORKLOAD_EVOLUTION,
  GET_WORKLOAD_OWN_SUB_RATIO,
  GET_WORKLOAD_PER_PROGRAM,
  GET_WORKLOAD_PREVIEW,
  GET_WORKLOAD_WORKFORCE,
} from '@src/app/shared/api.urls';
import { DirectIndirect } from '@src/app/shared/models/employee.model';
import { LineDetailChartData } from '@src/app/shared/models/graphs/line-detail-chart.model';
import {
  Ppsid,
  Workload,
  WorkloadsApiResponse,
  WorkloadEvolution,
  WorkloadEvolutionAPI,
  WorkloadPerProgramAPI,
  WorkloadWorkforce,
  WorkloadWorkforceAPI,
  WorksyncOwnSub,
  WorkloadPreview,
} from '@src/app/shared/models/worksync.model';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorksyncService {
  #workloads = signal<Workload[]>([]);
  workloads = this.#workloads.asReadonly();

  #ppsids = signal<string[]>([]);
  ppsids = this.#ppsids.asReadonly();

  #totalWorkloads = signal<number>(0);
  totalWorkloads = this.#totalWorkloads.asReadonly();
  #directRatio = signal<DirectIndirect | null>(null);
  directRatio = this.#directRatio.asReadonly();

  #ownSub = signal<WorksyncOwnSub | null>(null);
  ownSub = this.#ownSub.asReadonly();

  #perProgram = signal<LineDetailChartData[]>([]);
  perProgram = this.#perProgram.asReadonly();

  #evolution = signal<WorkloadEvolution | null>(null);
  evolution = this.#evolution.asReadonly();

  #workloadWorkforce = signal<WorkloadWorkforce[]>([]);
  workloadWorkforce = this.#workloadWorkforce.asReadonly();

  #workloadPreview = signal<WorkloadPreview | null>(null);
  workloadPreview = this.#workloadPreview.asReadonly();

  private http: HttpClient = inject(HttpClient);
  private workloadEvolutionAdaper: WorkloadEvolutionAdapter = inject(WorkloadEvolutionAdapter);
  private workloadPerProgramAdaper: WorkloadPerProgramAdapter = inject(WorkloadPerProgramAdapter);
  private workloadPWorkforceAdaper: WorkloadWorkforceAdapter = inject(WorkloadWorkforceAdapter);

  async getWorkloads(params?: string[]): Promise<void> {
    try {
      const workloadsAPI$ = this.http.get<WorkloadsApiResponse>(`${CRUD_WORKLOAD}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const workloadsAPI = await firstValueFrom(workloadsAPI$);
      this.#workloads.set(workloadsAPI.content);
      return this.#totalWorkloads.set(workloadsAPI.totalElements);
    } catch (error) {
      this.#workloads.set([]);
      throw error;
    }
  }

  async addWorkload(workload: Partial<Workload>): Promise<Workload> {
    const workload$ = this.http.post<Workload>(`${CRUD_WORKLOAD}`, workload);
    return firstValueFrom(workload$);
  }

  addEmptyWorkload() {
    this.#workloads.set([{ go: true } as Workload, ...this.workloads()]);
  }

  async editWorkload(id: number, workload: Partial<Workload>): Promise<Workload> {
    const workload$ = this.http.put<Workload>(`${CRUD_WORKLOAD}/${id}`, workload);
    return firstValueFrom(workload$);
  }

  async getPpsids(): Promise<void> {
    try {
      const ppsids$ = this.http.get<string[]>(`${CRUD_PPSID}/all`).pipe(catchError(this.handleError));
      this.#ppsids.set(await firstValueFrom(ppsids$));
    } catch (error) {
      this.#ppsids.set([]);
      throw error;
    }
  }

  async getPpsid(ppsid: string): Promise<Ppsid> {
    const response$ = this.http.get<Ppsid>(`${CRUD_PPSID}/ppsid/${ppsid}`).pipe(catchError(this.handleError));
    return firstValueFrom(response$);
  }

  async editPpsid(id: number, ppsid: Partial<Ppsid>): Promise<Workload> {
    const workload$ = this.http.put<Workload>(`${CRUD_PPSID}/${id}`, ppsid);
    return firstValueFrom(workload$);
  }

  async getDirectRatio(params?: string[]): Promise<void> {
    try {
      const ratioAPI$ = this.http.get<DirectIndirect>(`${GET_WORKLOAD_DIRECT_RATIO}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const ratioAPI = await firstValueFrom(ratioAPI$);
      this.#directRatio.set(ratioAPI);
    } catch (error) {
      this.#directRatio.set(null);
      throw error;
    }
  }

  async getOwnSubRatio(params?: string[]): Promise<void> {
    try {
      const ratioAPI$ = this.http
        .get<WorksyncOwnSub>(`${GET_WORKLOAD_OWN_SUB_RATIO}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const ratioAPI = await firstValueFrom(ratioAPI$);
      this.#ownSub.set(ratioAPI);
    } catch (error) {
      this.#ownSub.set(null);
      throw error;
    }
  }

  async getWorkLoadPerProgram(params?: string[]): Promise<void> {
    try {
      const programsAPI$ = this.http
        .get<WorkloadPerProgramAPI[]>(`${GET_WORKLOAD_PER_PROGRAM}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const programsAPI = await firstValueFrom(programsAPI$);
      const perProgramData = this.workloadPerProgramAdaper.adapt(programsAPI);
      this.#perProgram.set(perProgramData);
    } catch (error) {
      this.#perProgram.set([]);
      throw error;
    }
  }

  async getWorkLoadEvolution(params?: string[]): Promise<void> {
    try {
      const dataAPI$ = this.http
        .get<WorkloadEvolutionAPI>(`${GET_WORKLOAD_EVOLUTION}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const dataAPI = await firstValueFrom(dataAPI$);
      const evolution: WorkloadEvolution | null = this.workloadEvolutionAdaper.adapt(dataAPI);
      this.#evolution.set(evolution);
    } catch (error) {
      this.#evolution.set(null);
      throw error;
    }
  }

  async getWorkLoadWorkforce(params?: string[]): Promise<void> {
    try {
      const dataAPI$ = this.http
        .get<WorkloadWorkforceAPI>(`${GET_WORKLOAD_WORKFORCE}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const dataAPI = await firstValueFrom(dataAPI$);
      const workloadWorkforce: WorkloadWorkforce[] = this.workloadPWorkforceAdaper.adapt(dataAPI);
      this.#workloadWorkforce.set(workloadWorkforce);
    } catch (error) {
      this.#workloadWorkforce.set([]);
      throw error;
    }
  }

  async getWorkloadPreview(params?: string[]): Promise<void> {
    try {
      const dataPreview$ = this.http.get<WorkloadPreview>(`${GET_WORKLOAD_PREVIEW}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const dataPreview = await firstValueFrom(dataPreview$);
      this.#workloadPreview.set(dataPreview);
    } catch (error) {
      this.#workloadPreview.set(null);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.' + error.message));
  }
}
