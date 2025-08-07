import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  type OnDestroy,
  Output,
  computed,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import type { ContactState } from '@app/models/contactState.model';
import { I18nService } from '@app/services/i18n.service';
import { InputFieldComponent } from '@atoms/input-field/input-field.component';
import { TextAreaFieldComponent } from '@atoms/text-area-field/text-area-field.component';
import { CONTACT_FORM } from '@constants/appConst';

@Component({
  standalone: true,
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    TextAreaFieldComponent,
  ],
})
export class ContactFormComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  protected readonly i18nService = inject(I18nService);
  protected readonly CONTACT_FORM = computed(() => this.i18nService.getConstant('appConst')?.CONTACT_FORM || CONTACT_FORM);

  @Output() public contactState = new EventEmitter<ContactState>();
  protected contactForm = this.createContactForm();

  ngOnDestroy(): void {
    this.contactForm.reset();
  }

  private createContactForm(): FormGroup {
    return this.formBuilder.group({
      name: '',
      email: '',
      message: '',
    });
  }

  private get controls() {
    return this.contactForm.controls;
  }

  protected onSubmit() {
    const fullname = this.controls['name'].value;
    const email = this.controls['email'].value;
    const message = this.controls['message'].value;
    this.contactState.emit({
      name: fullname,
      email: email,
      message: message,
    } as ContactState);

    this.contactForm.reset();
  }
}
