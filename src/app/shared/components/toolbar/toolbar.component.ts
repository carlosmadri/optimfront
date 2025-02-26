import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Event, NavigationStart, Router, RouterLinkWithHref } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { GeneralFilterComponent } from '@components/general-filter/general-filter.component';
import { FilterYearComponent } from '@components/filter-year/filter-year.component';
import { NgClass } from '@angular/common';
import { ClickStopPropagationDirective } from '@app/shared/directives/click-stop-propagation/click-stop-propagation.directive';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { Role } from '@models/user.model';

@Component({
  selector: 'optim-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLinkWithHref,
    MatExpansionModule,
    GeneralFilterComponent,
    FilterYearComponent,
    NgClass,
    ClickStopPropagationDirective,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {
  router: Router = inject(Router);
  notHome = signal(false);
  readonly panelOpenState = signal(false);
  activeFilters = false;

  authService = inject(AuthService);

  USER_NAMES_TESTING = [
    'admin',
    'pedro.gar.garcia',
    'hrBoss.superboss',
    'hr.colleague',
    'finance.colleague1',
    'qmc.member.T1QA',
    'HO.T1QAA',
    'HO.T1QAC',
    'WL Delegate',
    'HO T1Q',
  ];
  userControl = new FormControl<string>(this.USER_NAMES_TESTING[0]);

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.notHome.set(event.url !== '/');
      }
    });

    this.authService.saveUser({ role: Role.ADMIN, userName: 'admin', JWT: 'test' });
    this.userControl.valueChanges.subscribe((value) => {
      this.authService.saveUser({ role: Role.ADMIN, userName: value!, JWT: 'test' });
    });
  }

  toggleActiveFilters(event: boolean) {
    this.activeFilters = event;
  }

  closeFiltersPanel(close: boolean) {
    if (this.panelOpenState()) {
      this.panelOpenState.set(!close);
    }
  }
}
