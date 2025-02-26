import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AutoFocusDirective } from '@app/shared/directives/auto-focus/auto-focus.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AsyncPipe, CommonModule } from '@angular/common';

export interface CustomSelect {
  id: number;
  value: string;
  description: string;
  label: string;
}

@Component({
  selector: 'optim-dynamic-input',
  standalone: true,
  imports: [AutoFocusDirective, FormsModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe, CommonModule],
  templateUrl: './dynamic-input.component.html',
  styleUrl: './dynamic-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicInputComponent implements AfterViewInit {
  value = input<string | number>();
  key = input<string>();
  type = input<string>();
  go = input<boolean>(true);
  selectValues = input<string[]>([]);
  selectObjects = input<CustomSelect[]>([]);
  trueLabel = input<string>();
  falseLabel = input<string>();
  outputValue = signal<string | number>('');
  sendObject = output<Record<string, string | number | boolean | null>>();
  inputMode = false;
  useType = computed(() => {
    return this.type() ?? typeof this.value();
  });
  noValueInput = false;

  valueControl = new FormControl<string | number>('');
  filteredValues: string[] = [];
  filteredObjects: CustomSelect[] = [];

  ngAfterViewInit() {
    if (this.value()) {
      this.outputValue.set(this.value()!);
    } else {
      this.outputValue.set('No value');
      this.noValueInput = true;
    }
    this.valueControl.setValue(this.outputValue()!, { emitEvent: false });
  }

  onClick() {
    this.inputMode = this.go();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.inputMode = this.go();
    }
  }

  onFocusOut() {
    this.inputMode = false;
    if (this.valueControl.value === '') {
      this.valueControl.setValue(this.outputValue());
    } else if (this.valueControl.value !== this.outputValue()) {
      this.sendObject.emit({ [this.key()!]: this.valueControl.value });
      this.outputValue.set(this.valueControl.value!);
      this.noValueInput = false;
    }
  }

  onSelect(event: MatAutocompleteSelectedEvent) {
    this.valueControl.setValue(event.option.value);
    this.onFocusOut();
  }

  onObjectSelect(event: MatAutocompleteSelectedEvent) {
    this.valueControl.setValue(event.option.value.value);
    this.inputMode = false;
    if (this.valueControl.value !== this.outputValue()) {
      this.sendObject.emit(event.option.value);
      this.outputValue.set(this.valueControl.value!);
      this.noValueInput = false;
    }
  }

  onBooleanSelect(event: MatAutocompleteSelectedEvent) {
    this.valueControl.setValue(event.option.value);
    this.inputMode = false;
    if (this.valueControl.value !== this.outputValue()) {
      this.sendObject.emit({ [this.key()!]: event.option.value === this.trueLabel() });
      this.outputValue.set(this.valueControl.value!);
      this.noValueInput = false;
    }
  }

  filter(input?: HTMLInputElement) {
    const value = input?.value ?? '';
    const filterValue = this._normalizeValue(value);
    this.filteredValues = this.selectValues().filter((selectValue) => this._normalizeValue(selectValue).includes(filterValue));
  }

  filterObject(input?: HTMLInputElement) {
    const value = input?.value ?? '';
    const filterValue = this._normalizeValue(value);
    this.filteredObjects = this.selectObjects().filter((object) => this._normalizeValue(object.value).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
