import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[optimDisableFilterOption]',
  standalone: true,
})
export class DisableFilterOptionDirective {
  @Input() field = '';
  @Input() formFilters: FormGroup[] = [];
  constructor(private el: ElementRef) {}
  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.disabled = this.formFilters.find((form) => form.value.field === this.field) ? true : false;
  }
}
