import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  Self,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorMessageComponent } from '@atoms/error-message/error-message.component';

const VALIDATORS: Record<string, ValidatorFn[]> = {
  message: [Validators.required, Validators.maxLength(300)],
};

@Component({
  standalone: true,
  selector: 'app-textarea-field',
  templateUrl: './text-area-field.component.html',
  styleUrl: './text-area-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ErrorMessageComponent, ReactiveFormsModule],
})
export class TextAreaFieldComponent
  implements ControlValueAccessor, AfterViewInit
{
  private destroy = inject(DestroyRef);
  protected readonly fieldControl: FormControl<string | null>;
  private _onChange: Function = () => {};
  private _onTouched: Function = () => {};

  public name = input<string>('');
  public id = input.required<string>();
  public label = input<string>('');
  public aria = input<string>('');
  public errorMessage = input.required<string>();

  public cols = input<string>('');
  public rows = input<string>('');

  constructor(@Self() private readonly control: NgControl) {
    this.control.valueAccessor = this;
    this.fieldControl = new FormControl<string | null>(null);
  }

  ngAfterViewInit() {
    this.fieldControl.addValidators(VALIDATORS[this.name()]);

    this.control.control?.setValidators([this.fieldControl.validator!]);
    this.control.control?.updateValueAndValidity();
    this.fieldControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((fieldValue) => {
        this._onChange(fieldValue);
        this._onTouched();
      });
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

  protected get showError() {
    return (
      this.fieldControl.touched &&
      (this.fieldControl.hasError('required') ||
        this.fieldControl.hasError('maxLength'))
    );
  }
}
