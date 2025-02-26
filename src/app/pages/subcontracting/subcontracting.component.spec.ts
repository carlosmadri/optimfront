import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractingComponent } from './subcontracting.component';

describe('SubcontractingComponent', () => {
  let component: SubcontractingComponent;
  let fixture: ComponentFixture<SubcontractingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcontractingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcontractingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
