import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericDialogComponent } from './generic-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  template: '<ng-template #testTemplate>Test Content</ng-template>',
  standalone: true,
})
class TestComponent {
  @ViewChild('testTemplate', { static: true }) testTemplate!: TemplateRef<unknown>;
}

describe('GenericDialogComponent', () => {
  let component: GenericDialogComponent;
  let fixture: ComponentFixture<GenericDialogComponent>;
  let testComponent: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDialogComponent, TestComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useFactory: () => {
            const testFixture = TestBed.createComponent(TestComponent);
            testComponent = testFixture.componentInstance;
            testFixture.detectChanges();
            return {
              title: 'Test Title',
              content: testComponent.testTemplate,
            };
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
