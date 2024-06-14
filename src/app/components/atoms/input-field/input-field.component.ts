import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Self,
  afterNextRender,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorMessageComponent } from '@atoms/error-message/error-message.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const VALIDATORS: Record<string, ValidatorFn[]> = {
  name: [
    Validators.required,
    Validators.pattern(/^[a-zA-ZÁ-ÿ\u00E0-\u00FC' -]+$/),
  ],
  email: [
    Validators.pattern(
      /^\s*(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\s*$/
    ),
    Validators.required,
  ],
};

@Component({
  standalone: true,
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorMessageComponent, ReactiveFormsModule],
})
export class InputFieldComponent
  implements ControlValueAccessor, OnDestroy, OnInit
{
  private platform = inject(PLATFORM_ID);
  protected readonly fieldControl: FormControl<string | null>;
  private readonly destroy$ = new Subject();
  private _onChange: Function = () => {};
  private _onTouched: Function = () => {};

  @Input() type = 'text';

  @Input() name = '';
  @Input() id = '';

  @Input() autocomplete = 'off';
  @Input() label = '';
  @Input() aria = '';

  @Input() errorMessage = '';

  constructor(@Self() private readonly control: NgControl) {
    this.control.valueAccessor = this;
    this.fieldControl = new FormControl<string | null>(null);
  }

  ngOnInit() {
    this.fieldControl.addValidators(VALIDATORS[this.name]);

    afterNextRender(() => {
      if (isPlatformBrowser(this.platform)) {
        this.control.control?.setValidators([this.fieldControl.validator!]);
        this.control.control?.updateValueAndValidity();
        this.fieldControl.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((fieldValue) => {
            this._onChange(fieldValue);
            this._onTouched();
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  writeValue(fieldValue: string | null): void {
    this.fieldControl.setValue(fieldValue);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.fieldControl.disable() : this.fieldControl.enable();
  }
}
