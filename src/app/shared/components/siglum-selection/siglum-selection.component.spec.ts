import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SiglumSelectionComponent } from './siglum-selection.component';

describe('SiglumSelectionComponent', () => {
  let component: SiglumSelectionComponent;
  let fixture: ComponentFixture<SiglumSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatListModule, NoopAnimationsModule, SiglumSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiglumSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with all siglums in allSiglums list', () => {
    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length);
    expect(component.getSiglums('selectedSiglums').length).toBe(0);
    expect(component.getSiglums('rejectedSiglums').length).toBe(0);
  });

  it('should move checked items from allSiglums to selectedSiglums', () => {
    const allSiglums = component.getSiglums('allSiglums');
    allSiglums[0].checked = true;
    allSiglums[1].checked = true;
    component.addToSelected();

    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length - 2);
    expect(component.getSiglums('selectedSiglums').length).toBe(2);
  });

  it('should move checked items from allSiglums to rejectedSiglums', () => {
    const allSiglums = component.getSiglums('allSiglums');
    allSiglums[2].checked = true;
    allSiglums[3].checked = true;
    component.addToRejected();

    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length - 2);
    expect(component.getSiglums('rejectedSiglums').length).toBe(2);
  });

  it('should move checked items from selectedSiglums back to allSiglums', () => {
    // First, move items to selectedSiglums
    const allSiglums = component.getSiglums('allSiglums');
    allSiglums[0].checked = true;
    allSiglums[1].checked = true;
    component.addToSelected();

    // Then, check and move them back
    const selectedSiglums = component.getSiglums('selectedSiglums');
    selectedSiglums[0].checked = true;
    selectedSiglums[1].checked = true;
    component.removeFromSelected();

    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length);
    expect(component.getSiglums('selectedSiglums').length).toBe(0);
  });

  it('should move checked items from rejectedSiglums back to allSiglums', () => {
    // First, move items to rejectedSiglums
    const allSiglums = component.getSiglums('allSiglums');
    allSiglums[2].checked = true;
    allSiglums[3].checked = true;
    component.addToRejected();

    // Then, check and move them back
    const rejectedSiglums = component.getSiglums('rejectedSiglums');
    rejectedSiglums[0].checked = true;
    rejectedSiglums[1].checked = true;
    component.removeFromRejected();

    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length);
    expect(component.getSiglums('rejectedSiglums').length).toBe(0);
  });

  it('should not move items when none are checked', () => {
    component.addToSelected();
    component.addToRejected();

    expect(component.getSiglums('allSiglums').length).toBe(component.allSiglums.length);
    expect(component.getSiglums('selectedSiglums').length).toBe(0);
    expect(component.getSiglums('rejectedSiglums').length).toBe(0);
  });

  it('should uncheck items after moving', () => {
    const allSiglums = component.getSiglums('allSiglums');
    allSiglums[0].checked = true;
    allSiglums[1].checked = true;
    component.addToSelected();

    const selectedSiglums = component.getSiglums('selectedSiglums');
    expect(selectedSiglums[0].checked).toBeFalsy();
    expect(selectedSiglums[1].checked).toBeFalsy();
  });
});
