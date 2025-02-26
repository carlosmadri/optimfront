import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogClose } from '@angular/material/dialog';

interface Siglum {
  id: number;
  name: string;
  checked: boolean;
}

type SiglumCategory = 'allSiglums' | 'selectedSiglums' | 'rejectedSiglums';

@Component({
  selector: 'optim-siglum-selection',
  standalone: true,
  imports: [MatListModule, FormsModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, MatCardModule, MatDialogClose],
  templateUrl: './siglum-selection.component.html',
  styleUrl: './siglum-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiglumSelectionComponent {
  isSubmit = input<boolean>(false);

  siglumsSelection = output<{ selectedSiglums: Siglum[]; rejectedSiglums: Siglum[] }>();

  allSiglums: Siglum[] = [
    { id: 1, name: 'Siglum 1', checked: false },
    { id: 2, name: 'Siglum 2', checked: false },
    { id: 3, name: 'Siglum 3', checked: false },
    { id: 4, name: 'Siglum 4', checked: false },
    { id: 5, name: 'Siglum 5', checked: false },
    { id: 6, name: 'Siglum 6', checked: false },
    { id: 7, name: 'Siglum 7', checked: false },
    { id: 8, name: 'Siglum 8', checked: false },
    { id: 9, name: 'Siglum 9', checked: false },
    { id: 10, name: 'Siglum 10', checked: false },
    { id: 11, name: 'Siglum 11', checked: false },
    { id: 12, name: 'Siglum 12', checked: false },
    { id: 13, name: 'Siglum 13', checked: false },
    { id: 14, name: 'Siglum 14', checked: false },
    { id: 15, name: 'Siglum 15', checked: false },
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  getSiglums(category: SiglumCategory): Siglum[] {
    return this.form.get(category)?.value || [];
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      allSiglums: [this.allSiglums],
      selectedSiglums: [[]],
      rejectedSiglums: [[]],
    });
  }

  addToSelected(): void {
    this.moveItems('allSiglums', 'selectedSiglums');
  }

  removeFromSelected(): void {
    this.moveItems('selectedSiglums', 'allSiglums');
  }

  addToRejected(): void {
    this.moveItems('allSiglums', 'rejectedSiglums');
  }

  removeFromRejected(): void {
    this.moveItems('rejectedSiglums', 'allSiglums');
  }

  onSelectionChange(event: MatSelectionListChange, category: SiglumCategory): void {
    const siglums = this.getSiglums(category);
    const selectedValues = new Set(event.source.selectedOptions.selected.map((option) => option.value));
    siglums.forEach((siglum) => (siglum.checked = selectedValues.has(siglum.id)));
    this.form.get(category)?.setValue(siglums);
  }

  private moveItems(fromList: SiglumCategory, toList: SiglumCategory): void {
    const fromSiglums = this.getSiglums(fromList);
    const toSiglums = this.getSiglums(toList);

    const itemsToMove = fromSiglums.filter((siglum) => siglum.checked);
    const remainingItems = fromSiglums.filter((siglum) => !siglum.checked);

    itemsToMove.forEach((siglum) => (siglum.checked = false));

    this.form.get(fromList)?.setValue(remainingItems);
    this.form.get(toList)?.setValue([...toSiglums, ...itemsToMove]);
  }

  confirm() {
    this.siglumsSelection.emit({
      selectedSiglums: this.getSiglums('selectedSiglums'),
      rejectedSiglums: this.getSiglums('rejectedSiglums'),
    });
  }
}
