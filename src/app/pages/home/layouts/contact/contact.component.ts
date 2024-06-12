import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { Observable, Subject, catchError, takeUntil } from 'rxjs';
import { ContactState } from '@app/models/contactState.model';
import { ToastService } from '@app/lib/toast/Toast.service';
import { CommonModule } from '@angular/common';
import { TitleComponent } from '@app/components/atoms/title/title.component';
import { LiquidBannerComponent } from '@app/components/atoms/liquid-banner/liquid-banner.component';
import { ContactFormComponent } from '@app/components/organism/contact-form/contact-form.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';

@Component({
  standalone: true,
  selector: 'contact-layout',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TitleComponent,
    LiquidBannerComponent,
    ContactFormComponent,
    ToastComponent,
  ],
  providers: [ToastService],
})
export class ContactLayoutComponent implements OnDestroy {
  private readonly toast = inject(ToastService);
  private http = inject(HttpClient);
  private destroy$: Subject<void>;
  protected readonly titleID: string = 'e913163167c3';

  constructor() {
    this.destroy$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected handleFormSubmit(event: ContactState) {
    this.toast.info('Sending...', 'We are processing your request');

    let contactForm = new FormData();
    contactForm.append('name', event.name);
    contactForm.append('email', event.email);
    contactForm.append('message', event.message);

    this.sendForm(contactForm)
      .pipe(takeUntil(this.destroy$))
      .pipe(
        catchError((error: any) => {
          this.toast.error(
            'Error',
            'An unexpected error has occurred with the server'
          );
          console.log('error:', error);
          return error;
        })
      )
      .subscribe((response: any) => {
        this.toast.success(
          'Success',
          'Your message has been sent successfully'
        );
      });
  }

  private sendForm(data: FormData): Observable<any> {
    return this.http.post('https://formspree.io/f/xdorrewr', data, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
