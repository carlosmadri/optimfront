import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamOutlookService } from './team-outlook.service';
import { GET_TEAM_OUTLOOK } from '@app/shared/api.urls';
import { ApiTeamOutlook, TeamOutlook } from '@app/shared/models/team-outlook.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TeamOutlookAdapter } from '@src/app/shared/adapters/team-outlook/team-outlook.adapter';

describe('TeamOutlookService', () => {
  let service: TeamOutlookService;
  let httpMock: HttpTestingController;
  let teamOutlookAdapterMock: jest.Mocked<TeamOutlookAdapter>;

  beforeEach(() => {
    teamOutlookAdapterMock = {
      adapt: jest.fn() as jest.MockedFunction<(apiData: ApiTeamOutlook) => TeamOutlook>,
    } as unknown as jest.Mocked<TeamOutlookAdapter>;

    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), { provide: TeamOutlookAdapter, useValue: teamOutlookAdapterMock }],
    });
    service = TestBed.inject(TeamOutlookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTeamOutlook', () => {
    const mockApiResponse: ApiTeamOutlook = {
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
      optimisticView: 15,
      validationView: 17,
      realisticView: 18,
      optimisticViewAverage: 105,
      validationViewAverage: 107,
      realisticViewAverage: 108,
    };

    it('should fetch team outlook data and update the signal', async () => {
      teamOutlookAdapterMock.adapt.mockReturnValue({} as unknown as TeamOutlook);
      const promise = service.getTeamOutlook();

      const req = httpMock.expectOne(GET_TEAM_OUTLOOK);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);

      await promise;

      const teamOutlook = service.teamOutlook();
      expect(teamOutlook).toBeTruthy();
    });

    it('should handle params correctly', async () => {
      const params = ['param1=value1', 'param2=value2'];
      const promise = service.getTeamOutlook(params);

      const req = httpMock.expectOne(`${GET_TEAM_OUTLOOK}?${params.join('&')}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);

      await promise;
    });

    it('should handle errors and set teamOutlook to null', async () => {
      const promise = service.getTeamOutlook();

      const req = httpMock.expectOne(GET_TEAM_OUTLOOK);
      req.error(new ErrorEvent('Network error'));

      await expect(promise).rejects.toThrow('Something bad happened; please try again later.');

      const teamOutlook = service.teamOutlook();
      expect(teamOutlook).not.toBeTruthy();
      expect(teamOutlook).toBeNull();
    });
  });
});
