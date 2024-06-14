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
  implements ControlValueAccessor, OnDestroy, OnInit
{
  private platform = inject(PLATFORM_ID);
  protected readonly fieldControl: FormControl<string | null>;
  private readonly destroy$ = new Subject();
  private _onChange: Function = () => {};
  private _onTouched: Function = () => {};

  @Input() name = '';
  @Input() id = '';
  @Input() cols = '';
  @Input() rows = '';
  @Input() label = '';
  @Input() aria = '';
  @Input() errorMessage = '';

  constructor(@Self() private readonly control: NgControl) {
    this.control.valueAccessor = this;
    this.fieldControl = new FormControl<string | null>(null);
  }

  ngOnInit(): void {
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
