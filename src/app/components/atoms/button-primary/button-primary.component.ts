import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type ButtonPrimaryMode = 'nebula' | 'ember';
export type ButtonPrimaryType = 'button' | 'submit' | 'reset';
export type ButtonPrimarySize = 'md' | 'sm';

@Component({
  standalone: true,
  selector: 'button-primary',
  templateUrl: './button-primary.component.html',
  styleUrl: './button-primary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class ButtonPrimaryComponent {
  /** Visual theme. Defaults to the violet `nebula` look. */
  public mode = input<ButtonPrimaryMode>('nebula');
  /** Native button type. */
  public type = input<ButtonPrimaryType>('button');
  public size = input<ButtonPrimarySize>('md');
  /** Stretches the button to the full width of its container. */
  public block = input<boolean>(false);
  public disabled = input<boolean>(false);
  /** Disabled look + aria-disabled, but still clickable (form-feedback pattern). */
  public ariaDisabled = input<boolean>(false);
  /** When set, renders an anchor instead of a button (keeps link semantics). */
  public href = input<string>('');
  public target = input<string>('');
  /** Optional accessible label when the projected content is only an icon. */
  public ariaLabel = input<string>('');

  /** Emits the native click event (suppressed while disabled). */
  public clicked = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    this.clicked.emit(event);
  }
}
