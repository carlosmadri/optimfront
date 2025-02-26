import { Injectable } from '@angular/core';
import { LeversTotal, LeversTotalAPI } from '@src/app/shared/models/levers-total.model';
import { Adapter } from '../../adapter.interface';

@Injectable({
  providedIn: 'root',
})
export class LeversEoyAdapter implements Adapter<LeversTotalAPI[], LeversTotal[]> {
  adapt(apiData: LeversTotalAPI[]): LeversTotal[] {
    return apiData.reduce((acc: LeversTotal[], item: LeversTotalAPI) => {
      if (item.leaver !== 0) {
        acc.push({
          leverType: item.leverType,
          totalAmount: item.leaver,
        });
      }

      if (item.recovery !== 0) {
        acc.push({
          leverType: item.leverType,
          totalAmount: item.recovery,
        });
      }

      return acc;
    }, []);
  }
}
