import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeverDialogComponent } from '@pages/workout/dialogs/lever-dialog/lever-dialog.component';
import { Lever, LEVER_TYPES } from '@models/lever.model';
import { Employee } from '@models/employee.model';
import { LeversService } from '@services/levers/levers.service';
import { EmployeeService } from '@services/employee/employee.service';
import { DialogService } from '@services/dialog-service/dialog.service';
import { FiltersService } from '@services/filters/filters.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageLeversService {
  private dialog = inject(MatDialog);
  private leversService = inject(LeversService);
  private employeeService = inject(EmployeeService);
  private dialogService = inject(DialogService);
  private filtersService = inject(FiltersService);

  async openLeverDialog(leverTypes: string[], employeeFTE = 0, employeeId?: number, editLever?: Lever): Promise<void> {
    const dialogRef = this.dialog.open(LeverDialogComponent, {
      data: {
        employeeFTE: employeeFTE,
        lever: editLever,
        leverTypes: leverTypes,
      },
    });

    const lever: Lever = await firstValueFrom(dialogRef.afterClosed());

    if (!lever) {
      return; // Dialog was closed without submitting
    }

    if (employeeId) {
      lever.employee = { id: employeeId } as Employee;
    }
    const outputLever = Object.fromEntries(Object.entries(lever).filter(([_, v]) => v != null && _));
    let leverRequest: Promise<Lever>;

    if (editLever) {
      leverRequest = this.leversService.editLever(editLever.id, outputLever as Lever);
    } else {
      leverRequest = this.leversService.addLever(outputLever as Lever);
    }

    try {
      const resLever: Lever = await leverRequest;
      if (resLever.leverType === LEVER_TYPES.REDEPLOYMENT || resLever.leverType === LEVER_TYPES.PERIMETER_CHANGE) {
        await this.handleRedeploymentOrPerimeterChange(resLever);
      } else {
        await this.updateTable();
      }
    } catch (err) {
      this.handleLeverError(editLever);
      throw err;
    }
  }

  private async handleRedeploymentOrPerimeterChange(resLever: Lever): Promise<void> {
    const employee: Employee = resLever.employee!;
    employee.fte = resLever.fte;
    employee.activeWorkforce = resLever.activeWorkforce;
    employee.direct = resLever.direct;
    employee.siglum = { id: resLever.siglumDestination.id };
    employee.costCenter = { id: resLever.costCenter!.id };
    employee.id = resLever.employee!.id;
    const outputEmployee = Object.fromEntries(Object.entries(employee).filter(([_, v]) => v != null && _));

    await this.employeeService.editEmployee(employee.id, outputEmployee as Employee);
    await this.updateTable();
  }

  private async updateTable(): Promise<void> {
    await this.employeeService.getEmployees(this.filtersService.employeeParamsFilter());
  }

  private handleLeverError(editLever?: Lever): void {
    this.dialogService.openMessageDialog(
      `Couldn't ${editLever ? 'edit' : 'add'} new lever`,
      `This could be due to another lever date. Make sure it does not overlap with an existing lever.`,
      'warning',
    );
  }

  async deleteLever(lever: Lever, employeeId: number): Promise<void> {
    const confirmation = await this.dialogService.openConfirmationDialog('Delete Lever', 'This action cannot be undone.');
    if (!confirmation) {
      return; // User cancelled the deletion
    }

    if (lever.leverType === LEVER_TYPES.REDEPLOYMENT || lever.leverType === LEVER_TYPES.PERIMETER_CHANGE) {
      await this.employeeService.deleteEmployee(employeeId);
    } else {
      await this.leversService.deleteLever(lever.id);
    }
    await this.updateTable();
  }
}
