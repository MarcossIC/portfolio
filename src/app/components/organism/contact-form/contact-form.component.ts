import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContactState } from '@app/models/contactState.model';
import { ErrorMessageComponent } from '@atoms/error-message/error-message.component';
import { InputFieldComponent } from '@atoms/input-field/input-field.component';
import { TextAreaFieldComponent } from '@atoms/text-area-field/text-area-field.component';

@Component({
  standalone: true,
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ErrorMessageComponent,
    ReactiveFormsModule,
    InputFieldComponent,
    TextAreaFieldComponent,
  ],
})
export class ContactFormComponent implements OnDestroy, OnInit {
  @Output() public contactState = new EventEmitter<ContactState>();
  private formBuilder: FormBuilder = inject(FormBuilder);
  private platform = inject(PLATFORM_ID);
  protected contactForm!: FormGroup;
  constructor() {}
  ngOnInit(): void {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platform)) {
        this.contactForm = this.createContactForm();
      }
    });
  }
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
