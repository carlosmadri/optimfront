import { TestBed } from '@angular/core/testing';
import { TeamOutlookAdapter } from './team-outlook.adapter';
import { ApiTeamOutlook } from '../../models/team-outlook.model';

describe('TeamOutlookAdapter', () => {
  let adapter: TeamOutlookAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TeamOutlookAdapter],
    });
    adapter = TestBed.inject(TeamOutlookAdapter);
  });
  describe('adapt', () => {
    it('should correctly adapt API data to TeamOutlook model', () => {
      const apiData: ApiTeamOutlook = {
        fteActives: 100,
        fteNonActives: 10,
        leavers: 5,
        recoveries: 2,
        redeployment: 1,
        perimeterChanges: 0,
        internalMobility: 0,
        filled: 3,
        opened: 4,
        validationProcess: 2,
        onHold: 1,
        hcCeiling: 10,
        optimisticView: 18,
        validationView: 17,
        realisticView: 15,
        optimisticViewAverage: 115,
        validationViewAverage: 117,
        realisticViewAverage: 118,
      };

      const result = adapter.adapt(apiData);

      expect(result.fteTotalValue).toBe(100);
      expect(result.fteNAWF).toBe(10);
      expect(result.leaversSummary).toHaveLength(5);
      expect(result.leaversSummary[1].value).toBe(2);
      expect(result.jrSummary).toHaveLength(4);
      expect(result.eoySummary).toHaveLength(3);
      expect(result.eoySummary[0].value).toBe(15); // Realistic view
      expect(result.eoySummary[1].value).toBe(17); // Validation required
      expect(result.eoySummary[2].value).toBe(18); // Optimistic view
      expect(result.hcCeiling).toBe(10);
      expect(result.avgSummary).toHaveLength(3);
      expect(result.avgSummary[0].value).toBe(115); // Optimistic view average
      expect(result.avgSummary[1].value).toBe(117); // Validation view average
      expect(result.avgSummary[2].value).toBe(118); // Realistic view average
    });
  });
});
