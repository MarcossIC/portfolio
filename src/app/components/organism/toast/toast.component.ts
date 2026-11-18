import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ToastService } from '@app/lib/toast/Toast.service';
import { I18nService } from '@app/services/i18n.service';
import { TOAST_UI } from '@constants/appConst';

@Component({
  standalone: true,
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:focusin)': 'trackFocus($event)' },
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  private readonly i18n = inject(I18nService);
  public toasts = this.toastService.state.asReadonly();
  protected readonly UI = computed(
    () => this.i18n.getConstant('appConst')?.TOAST_UI || TOAST_UI,
  );

  /** Last focused element outside the toasts: where focus returns when a focused toast goes away. */
  private lastOutside: Element | null = null;

  protected trackFocus(e: FocusEvent): void {
    const t = e.target;
    if (t instanceof Element && !t.closest('.toast-list')) this.lastOutside = t;
  }

  protected close(ID: string): void {
    const active = typeof document !== 'undefined' ? document.activeElement : null;
    if (active instanceof HTMLElement && active.closest(`[id="${ID}"]`)) {
      const prev = this.lastOutside;
      const fallback = document.querySelector<HTMLElement>('main');
      if (prev instanceof HTMLElement && prev.isConnected) prev.focus({ preventScroll: true });
      else if (fallback) {
        if (!fallback.hasAttribute('tabindex')) fallback.setAttribute('tabindex', '-1');
        fallback.focus({ preventScroll: true });
      }
    }
    this.toastService.remove(ID);
  }

  protected pause(ID: string): void {
    this.toastService.pause(ID);
  }

  protected resume(ID: string): void {
    this.toastService.resume(ID);
  }
}
