import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ToastService } from 'src/app/data/services/toast/Toast.service';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnInit {
  private readonly toastService = inject(ToastService);

  public readonly toasts = this.toastService.state.asReadonly();

  constructor() { }

  ngOnInit(): void {
  }

  protected close(ID: string): void{
    this.toastService.remove(ID);
  }

  public trackBtyFn(index: number, toast: any): string{
    return toast.ID;
  }
}
