import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FiltersService } from '@app/services/filters/filters.service';

const MIN_YEARS = -1;
const MAX_YEARS = 5;

@Component({
  selector: 'optim-filter-year',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './filter-year.component.html',
  styleUrl: './filter-year.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterYearComponent implements OnInit {
  filtersService: FiltersService = inject(FiltersService);
  selectedYear = this.filtersService.yearFilter;
  currentYear = 0;
  minYear = 0;
  maxYear = 0;

  ngOnInit() {
    this.currentYear = this.selectedYear();
    this.minYear = this.currentYear + MIN_YEARS;
    this.maxYear = this.currentYear + MAX_YEARS;
  }

  previous() {
    if (this.selectedYear() > this.minYear) {
      this.filtersService.setYearFilter(this.selectedYear() - 1);
    }
  }

  next() {
    if (this.selectedYear() < this.maxYear) {
      this.filtersService.setYearFilter(this.selectedYear() + 1);
    }
  }
}
