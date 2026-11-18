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
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);
  private readonly i18n = inject(I18nService);
  public toasts = this.toastService.state.asReadonly();
  protected readonly UI = computed(
    () => this.i18n.getConstant('appConst')?.TOAST_UI || TOAST_UI,
  );

  protected close(ID: string): void {
    this.toastService.remove(ID);
  }

  protected pause(ID: string): void {
    this.toastService.pause(ID);
  }

  protected resume(ID: string): void {
    this.toastService.resume(ID);
  }
}
