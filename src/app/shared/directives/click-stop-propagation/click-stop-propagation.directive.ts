import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[optimClickStopPropagation]',
  standalone: true,
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
