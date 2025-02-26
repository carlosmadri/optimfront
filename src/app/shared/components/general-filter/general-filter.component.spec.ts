import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralFilterComponent } from './general-filter.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GeneralFilterComponent', () => {
  let component: GeneralFilterComponent;
  let fixture: ComponentFixture<GeneralFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralFilterComponent, NoopAnimationsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
