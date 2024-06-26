import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ErrorIconComponent } from '@app/components/icons/error-icon.component';

@Component({
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ErrorIconComponent],
  selector: 'error-message',
  template: `
    @if(showError){
    <span class=" flex mt-1 text-xs select-none" [ngClass]="errorClass">
      <ErrorIcon />
      {{ errorMessage }} </span
    >}
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  @Input({ required: true }) public errorMessage: string = '';
  @Input({ required: true }) public showError: any = false;
  @Input() public errorClass: string = '';
}
