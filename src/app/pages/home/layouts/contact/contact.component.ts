import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { type Observable, EMPTY, catchError, finalize } from 'rxjs';
import type { ContactState } from '@app/models/contactState.model';
import { ToastService } from '@app/lib/toast/Toast.service';
import { ContactFormComponent } from '@app/components/organism/contact-form/contact-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CONTACT_FORM, CONTACT_TITLE } from '@constants/appConst';
import { I18nService } from '@app/services/i18n.service';
import { USER } from '@constants/userConst';
import { ScrollAnimationDirective } from '@lib/directives/ScrollAnimation.directive';

@Component({
  standalone: true,
  selector: 'contact-layout',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContactFormComponent,
    ScrollAnimationDirective,
  ],
})
export class ContactLayout {
  protected readonly i18nService = inject(I18nService);
  protected readonly CONTACT_TITLE = computed(() => this.i18nService.getConstant('appConst')?.CONTACT_TITLE || CONTACT_TITLE);
  protected readonly CONTACT_FORM = computed(() => this.i18nService.getConstant('appConst')?.CONTACT_FORM || CONTACT_FORM);
  protected readonly USER = computed(() => this.i18nService.getConstant('userConst')?.USER || USER);
  private readonly toast = inject(ToastService);
  private http = inject(HttpClient);
  private destroy = inject(DestroyRef);

  /** True while the POST is in flight; drives the form's disabled/spinner state. */
  protected readonly sending = signal(false);
  private readonly form = viewChild(ContactFormComponent);

  protected handleFormSubmit(event: ContactState) {
    if (this.sending()) return;

    const texts = this.CONTACT_FORM().TOAST;
    // A notification failure must never block the send nor leave `sending` stuck.
    let sendingToastId: string | null = null;
    try {
      sendingToastId = this.toast.info(texts.SENDING_TITLE, texts.SENDING_MESSAGE);
    } catch {
      sendingToastId = null;
    }
    this.sending.set(true);

    const contactForm = new FormData();
    contactForm.append('name', event.name);
    contactForm.append('email', event.email);
    contactForm.append('message', event.message);

    this.sendForm(contactForm)
      .pipe(
        takeUntilDestroyed(this.destroy),
        catchError(() => {
          this.toast.error(texts.ERROR_TITLE, texts.ERROR_MESSAGE);
          return EMPTY;
        }),
        // Runs on success, error and unsubscribe: the "sending" toast must never linger.
        finalize(() => {
          this.sending.set(false);
          if (sendingToastId) this.toast.remove(sendingToastId);
        }),
      )
      .subscribe(() => {
        this.toast.success(texts.SUCCESS_TITLE, texts.SUCCESS_MESSAGE);
        this.form()?.reset();
      });
  }

  private sendForm(data: FormData): Observable<unknown> {
    return this.http.post('https://formspree.io/f/xdorrewr', data, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
