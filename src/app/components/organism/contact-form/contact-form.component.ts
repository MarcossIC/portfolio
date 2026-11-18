import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import type { ContactState } from '@app/models/contactState.model';
import { I18nService } from '@app/services/i18n.service';
import { CONTACT_FORM } from '@constants/appConst';
import { ButtonPrimaryComponent } from '@atoms/button-primary/button-primary.component';
import {
  notBlank,
  strictEmail,
  trimmedMinLength,
} from './contact-form.validators';

type FieldName = 'name' | 'email' | 'message';
const FIELD_ORDER: readonly FieldName[] = ['name', 'email', 'message'];

@Component({
  standalone: true,
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonPrimaryComponent],
})
export class ContactFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly i18nService = inject(I18nService);
  protected readonly CONTACT_FORM = computed(
    () => this.i18nService.getConstant('appConst')?.CONTACT_FORM || CONTACT_FORM,
  );

  /** True while the parent is posting the message: blocks double submits. */
  public readonly sending = input(false);
  public readonly contactState = output<ContactState>();

  protected readonly contactForm = this.formBuilder.group({
    name: ['', [notBlank, trimmedMinLength(2), Validators.maxLength(80)]],
    email: ['', [notBlank, strictEmail, Validators.maxLength(254)]],
    message: ['', [notBlank, trimmedMinLength(10), Validators.maxLength(1000)]],
  });

  protected readonly shakeForm = signal(false);
  protected readonly focused = signal<string | null>(null);
  private readonly submitted = signal(false);
  /** Bumped on every control event so OnPush/zoneless re-reads validity & touched. */
  private readonly formTick = signal(0);

  /** Translated error per field, or null while it should stay quiet. */
  protected readonly errors = computed<Record<FieldName, string | null>>(() => {
    this.formTick();
    const submitted = this.submitted();
    const texts = this.CONTACT_FORM().FIELDS;
    const result: Record<FieldName, string | null> = {
      name: null,
      email: null,
      message: null,
    };
    for (const field of FIELD_ORDER) {
      const control = this.contactForm.controls[field];
      if (!control.invalid || !(control.touched || submitted)) continue;
      const e = control.errors ?? {};
      const msgs = texts[field.toUpperCase() as 'NAME' | 'EMAIL' | 'MESSAGE'].ERRORS;
      result[field] =
        (e['required'] && msgs.REQUIRED) ||
        (e['email'] && msgs.INVALID) ||
        (e['minlength'] && msgs.MIN_LENGTH) ||
        (e['maxlength'] && msgs.MAX_LENGTH) ||
        null;
    }
    return result;
  });

  constructor() {
    this.contactForm.events
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.formTick.update((n) => n + 1));
  }

  /** Clears values, touched state and error messages (called by the parent on success). */
  public reset(): void {
    this.submitted.set(false);
    this.contactForm.reset();
  }

  protected onSubmit(): void {
    if (this.sending()) return;

    this.submitted.set(true);
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.shakeForm.set(true);
      this.focusFirstInvalid();
      return;
    }

    const { name, email, message } = this.contactForm.getRawValue();
    this.contactState.emit({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  }

  private focusFirstInvalid(): void {
    const first = FIELD_ORDER.find((f) => this.contactForm.controls[f].invalid);
    if (!first) return;
    this.host.nativeElement.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
  }

  protected onShakeEnd(): void {
    this.shakeForm.set(false);
  }

  protected setFocus(field: string | null): void {
    this.focused.set(field);
  }
}
