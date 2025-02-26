import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageTableComponent } from './manage-table.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageTableComponent', () => {
  let component: ManageTableComponent;
  let fixture: ComponentFixture<ManageTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTableComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
