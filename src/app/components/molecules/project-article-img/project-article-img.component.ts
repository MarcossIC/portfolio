import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { ToolTipComponent } from '@app/components/atoms/tool-tip/tool-tip.component';
import { AtroposDirective } from '@lib/directives/AtroposDirective.directive';

@Component({
  standalone: true,
  imports: [AtroposDirective, ToolTipComponent],
  selector: 'project-article-img',
  templateUrl: './project-article-img.component.html',
  styleUrls: ['./project-article-img.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectArticleImgComponent {
  private readonly platform = inject(PLATFORM_ID);
  public containerRef = viewChild.required<ElementRef>('projectImg');
  public REPO = input.required<string>();
  public SRC = input.required<string>();

  public TITLE = input.required<string>();
  public ID = input.required<string>();

  protected tooltipX: number = 0;
  protected tooltipY: number = 0;

  onMouseMove(event: MouseEvent) {
    if (isPlatformBrowser(this.platform)) {
      const rect = this.containerRef().nativeElement.getBoundingClientRect();
      this.tooltipX = event.clientX - rect.left + 10;
      this.tooltipY = event.clientY - rect.top + 10;
    }
  }
}
