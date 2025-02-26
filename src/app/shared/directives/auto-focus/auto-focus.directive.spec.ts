import { AutoFocusDirective } from './auto-focus.directive';
import { ElementRef } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }

  override nativeElement = {
    disabled: false,
  };
}
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [{ provide: ElementRef, useValue: MockElementRef }],
  });
});
describe('AutoFocusDirective', () => {
  it('should create an instance', inject([ElementRef], (el: ElementRef) => {
    const directive = new AutoFocusDirective(el);
    expect(directive).toBeTruthy();
  }));
});
