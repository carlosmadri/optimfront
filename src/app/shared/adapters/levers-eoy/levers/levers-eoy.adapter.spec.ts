import { TestBed } from '@angular/core/testing';

import { LeversEoyAdapter } from './levers-eoy.adapter';
import { LeversTotal, LeversTotalAPI } from '@src/app/shared/models/levers-total.model';

describe('LeversAdapter', () => {
  let adapter: LeversEoyAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeversEoyAdapter],
    });
    adapter = TestBed.inject(LeversEoyAdapter);
  });

  it('should adapt data with both leaver and recovery', () => {
    const apiData: LeversTotalAPI[] = [{ leverType: 'Perimeter Change', leaver: -1.0, recovery: 2.0 }];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([
      { leverType: 'Perimeter Change', totalAmount: -1.0 },
      { leverType: 'Perimeter Change', totalAmount: 2.0 },
    ]);
  });

  it('should adapt data with only leaver', () => {
    const apiData: LeversTotalAPI[] = [{ leverType: 'Redeployment', leaver: -1.0, recovery: 0.0 }];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([{ leverType: 'Redeployment', totalAmount: -1.0 }]);
  });

  it('should adapt data with only recovery', () => {
    const apiData: LeversTotalAPI[] = [{ leverType: 'Hiring', leaver: 0.0, recovery: 3.0 }];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([{ leverType: 'Hiring', totalAmount: 3.0 }]);
  });

  it('should handle empty input', () => {
    const apiData: LeversTotalAPI[] = [];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([]);
  });

  it('should handle multiple items', () => {
    const apiData: LeversTotalAPI[] = [
      { leverType: 'Perimeter Change', leaver: -1.0, recovery: 2.0 },
      { leverType: 'Redeployment', leaver: -1.0, recovery: 0.0 },
      { leverType: 'Mobility Out', leaver: 0.0, recovery: 3.0 },
    ];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([
      { leverType: 'Perimeter Change', totalAmount: -1.0 },
      { leverType: 'Perimeter Change', totalAmount: 2.0 },
      { leverType: 'Redeployment', totalAmount: -1.0 },
      { leverType: 'Mobility Out', totalAmount: 3.0 },
    ]);
  });

  it('should ignore items with both leaver and recovery as zero', () => {
    const apiData: LeversTotalAPI[] = [
      { leverType: 'No Change', leaver: 0.0, recovery: 0.0 },
      { leverType: 'Perimeter Change', leaver: -1.0, recovery: 2.0 },
    ];

    const result: LeversTotal[] = adapter.adapt(apiData);

    expect(result).toEqual([
      { leverType: 'Perimeter Change', totalAmount: -1.0 },
      { leverType: 'Perimeter Change', totalAmount: 2.0 },
    ]);
  });
});
