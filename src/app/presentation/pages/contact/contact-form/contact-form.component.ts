import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactState } from 'src/app/data/models/contactState.model';
import { ErrorMessageComponent } from 'src/app/presentation/components/error-message/error-message.component';

@Component({
  standalone: true,
  imports: [CommonModule, ErrorMessageComponent, ReactiveFormsModule],
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit, OnDestroy {
  @Output() public contactState: EventEmitter<ContactState>;
  private formBuilder: FormBuilder = inject(FormBuilder);
  protected contactForm!: FormGroup;
  constructor() { 
    this.contactState = new EventEmitter<ContactState>();
    this.contactForm = this.createContactForm();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.contactForm.reset();
  }

  private createContactForm(): FormGroup{
    return this.formBuilder.group({
      fullName:    ['', [Validators.required, Validators.pattern(
        /^[a-zA-ZÁ-ÿ\u00E0-\u00FC' -]+$/
      )]],
      email: ['', [Validators.pattern(
        /^\s*(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\s*$/,
      ), Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  private get controls(){
    return this.contactForm.controls;
  }

  protected onSubmit(){
    const fullname = this.controls['fullName'].value;
    const email    = this.controls['email'].value;
    const message  = this.controls['message'].value;

    this.contactState.emit({
      name: fullname,
      email: email,
      message: message
    } as ContactState);

    this.contactForm.reset();
  }
}
