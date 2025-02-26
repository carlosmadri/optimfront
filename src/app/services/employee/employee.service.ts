import { inject, Injectable, signal } from '@angular/core';
import { GET_ALL_EMPLOYEES, GET_BORROWED_LEASED, GET_EMPLOYEE_DIRECT_RATIO, GET_EMPLOYEE_NAWF_REASON, GET_MONTHLY_DISTRIBUTION } from '@app/shared/api.urls';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DirectIndirect, EmployeeSummaryNAWF } from '@app/shared/models/employee.model';
import { Employee, EmployeeApiResponse } from '@models/employee.model';
import { LineChartData } from '@src/app/shared/models/graphs/line-chart.model';
import { MonthlyDistributionAPI } from '@src/app/shared/models/monthly-distribution.model';
import { BorrowedLeased, BorrowedLeasedAPI } from '@src/app/shared/models/borrowed-leased.model';
import { MonthlyDistributionAdapter } from '@src/app/shared/adapters/monthly-distribution/monthly-distribution.adapter';
import { BorrowedLeasedAdapter } from '@src/app/shared/adapters/borrowed-leased/borrowed-leased.adapter';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  #employees = signal<Employee[]>([]);
  employees = this.#employees.asReadonly();

  #totalEmployees = signal<number>(0);
  totalEmployees = this.#totalEmployees.asReadonly();

  #monthlyData = signal<LineChartData | null>(null);
  monthlyData = this.#monthlyData.asReadonly();

  #borrowedData = signal<BorrowedLeased | null>(null);
  borrowedData = this.#borrowedData.asReadonly();

  #directRatio = signal<DirectIndirect | null>(null);
  directRatio = this.#directRatio.asReadonly();

  #summaryNAWF = signal<EmployeeSummaryNAWF[] | []>([]);
  summaryNAWF = this.#summaryNAWF.asReadonly();

  private monthlyAdapter: MonthlyDistributionAdapter = inject(MonthlyDistributionAdapter);
  private borrowedAdapter: BorrowedLeasedAdapter = inject(BorrowedLeasedAdapter);
  private http: HttpClient = inject(HttpClient);

  async getEmployees(params?: string[]): Promise<void> {
    try {
      const employees$ = this.http.get<EmployeeApiResponse>(`${GET_ALL_EMPLOYEES}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const response = await firstValueFrom(employees$);
      this.#employees.set(response.content);
      this.#totalEmployees.set(response.totalElements);
    } catch (error) {
      this.#employees.set([]);
      throw error;
    }
  }

  async editEmployee(id: number, employee: Employee): Promise<Employee> {
    const employee$ = this.http.put<Employee>(`${GET_ALL_EMPLOYEES}/${id}`, employee);
    return firstValueFrom(employee$);
  }

  async deleteEmployee(id: number): Promise<Employee> {
    const employee$ = this.http.delete<Employee>(`${GET_ALL_EMPLOYEES}/${id}`);
    return firstValueFrom(employee$);
  }

  async getMonthlyDistribution(params?: string[]): Promise<void> {
    try {
      const monthlyAPI$ = this.http
        .get<MonthlyDistributionAPI>(`${GET_MONTHLY_DISTRIBUTION}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const monthlyData = await firstValueFrom(monthlyAPI$);
      const lineChartData: LineChartData | null = this.monthlyAdapter.adapt(monthlyData);
      this.#monthlyData.set(lineChartData);
    } catch (error) {
      this.#monthlyData.set(null);
      throw error;
    }
  }

  async getBorrowedLeased(params?: string[]): Promise<void> {
    try {
      const borrowedAPI$ = this.http.get<BorrowedLeasedAPI>(`${GET_BORROWED_LEASED}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));

      const borrowedData = await firstValueFrom(borrowedAPI$);
      const borrowedLeased = this.borrowedAdapter.adapt(borrowedData);

      this.#borrowedData.set(borrowedLeased);
    } catch (error) {
      this.#borrowedData.set(null);
      throw error;
    }
  }

  async getDirectRatio(params?: string[]): Promise<void> {
    try {
      const ratioAPI$ = this.http.get<DirectIndirect>(`${GET_EMPLOYEE_DIRECT_RATIO}${params ? `?${params.join('&')}` : ''}`).pipe(catchError(this.handleError));
      const ratioAPI = await firstValueFrom(ratioAPI$);
      this.#directRatio.set(ratioAPI);
    } catch (error) {
      this.#directRatio.set(null);
      throw error;
    }
  }

  async getSummaryNAWF(params?: string[]): Promise<void> {
    try {
      const ratioAPI$ = this.http
        .get<EmployeeSummaryNAWF[]>(`${GET_EMPLOYEE_NAWF_REASON}${params ? `?${params.join('&')}` : ''}`)
        .pipe(catchError(this.handleError));
      const summaryAPI = await firstValueFrom(ratioAPI$);
      this.#summaryNAWF.set(summaryAPI);
    } catch (error) {
      this.#summaryNAWF.set([]);
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('Something bad happened; please try again later.' + error.message));
  }
}
