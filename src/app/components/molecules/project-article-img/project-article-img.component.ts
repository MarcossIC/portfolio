import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Input,
  PLATFORM_ID,
  ViewChild,
  inject,
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
  @ViewChild('projectImg', { static: true }) containerRef!: ElementRef;
  private readonly platform = inject(PLATFORM_ID);
  @Input() public REPO = '';
  @Input() public SRC = '';

  @Input() public TITLE = '';
  @Input() public ID = '';

  protected tooltipX: number = 0;
  protected tooltipY: number = 0;

  onMouseMove(event: MouseEvent) {
    if (isPlatformBrowser(this.platform)) {
      const rect = this.containerRef.nativeElement.getBoundingClientRect();
      this.tooltipX = event.clientX - rect.left + 10; // 10px de offset
      this.tooltipY = event.clientY - rect.top + 10; // 10px de offset
    }
  }
}
