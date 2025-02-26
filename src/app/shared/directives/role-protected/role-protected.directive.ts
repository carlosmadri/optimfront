import { Directive, effect, ElementRef, inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { Role } from '@models/user.model';

@Directive({
  selector: '[optimRoleProtected]',
  standalone: true,
})
export class RoleProtectedDirective {
  private auth: AuthService = inject(AuthService);
  private el: ElementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      if (this.auth.user()?.role !== Role.ADMIN) {
        this.el.nativeElement.disabled = true;
      } else {
        this.el.nativeElement.disabled = false;
      }
    });
  }
}
