import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'optim-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SidenavComponent, ToolbarComponent, RouterOutlet, RouterLinkWithHref, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'optim-ui';
}
