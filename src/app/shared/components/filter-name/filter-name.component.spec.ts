import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNameComponent } from './filter-name.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

describe('FilterNameComponent', () => {
  let component: FilterNameComponent;
  let fixture: ComponentFixture<FilterNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterNameComponent, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatExpansionModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.filterForm.get('firstName')).toBeTruthy();
    expect(component.filterForm.get('lastName')).toBeTruthy();
    expect(component.filterForm.get('firstName')?.value).toBe('');
    expect(component.filterForm.get('lastName')?.value).toBe('');
  });

  it('should validate firstName input correctly', () => {
    const firstNameControl = component.filterForm.get('firstName');
    firstNameControl?.setValue('Ab');
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.hasError('invalidLength')).toBeTruthy();

    firstNameControl?.setValue('Abc');
    expect(firstNameControl?.valid).toBeTruthy();
    expect(firstNameControl?.hasError('invalidLength')).toBeFalsy();

    firstNameControl?.setValue('');
    expect(firstNameControl?.valid).toBeTruthy();
    expect(firstNameControl?.hasError('invalidLength')).toBeFalsy();
  });

  it('should validate lastName input correctly', () => {
    const lastNameControl = component.filterForm.get('lastName');
    lastNameControl?.setValue('Xy');
    expect(lastNameControl?.valid).toBeFalsy();
    expect(lastNameControl?.hasError('invalidLength')).toBeTruthy();

    lastNameControl?.setValue('Xyz');
    expect(lastNameControl?.valid).toBeTruthy();
    expect(lastNameControl?.hasError('invalidLength')).toBeFalsy();

    lastNameControl?.setValue('');
    expect(lastNameControl?.valid).toBeTruthy();
    expect(lastNameControl?.hasError('invalidLength')).toBeFalsy();
  });

  it('should mark control as touched and update validity on input change', () => {
    const firstNameControl = component.filterForm.get('firstName');
    jest.spyOn(firstNameControl!, 'markAsTouched');
    jest.spyOn(firstNameControl!, 'updateValueAndValidity');

    component.onInputChange('firstName');

    expect(firstNameControl?.markAsTouched).toHaveBeenCalled();
    expect(firstNameControl?.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should emit filter values when form is valid', () => {
    const filterByNameSpy = jest.spyOn(component.filterByName, 'emit');

    component.filterForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
    });

    component.onSubmitFilter();

    expect(filterByNameSpy).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(component.activeFilters()).toBe(true);
  });

  it('should not emit filter values when form is invalid', () => {
    const filterByNameSpy = jest.spyOn(component.filterByName, 'emit');

    component.filterForm.patchValue({
      firstName: 'Jo',
      lastName: 'Do',
    });

    component.onSubmitFilter();

    expect(filterByNameSpy).not.toHaveBeenCalled();
    expect(component.activeFilters()).toBe(false);
  });

  it('should set activeFilters to false when form is empty', () => {
    component.filterForm.patchValue({
      firstName: '',
      lastName: '',
    });

    component.onSubmitFilter();

    expect(component.activeFilters()).toBe(false);
  });
});
