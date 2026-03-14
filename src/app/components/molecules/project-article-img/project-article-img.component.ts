import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { AtroposDirective } from '@lib/directives/AtroposDirective.directive';

@Component({
  standalone: true,
  imports: [AtroposDirective],
  selector: 'project-article-img',
  templateUrl: './project-article-img.component.html',
  styleUrls: ['./project-article-img.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectArticleImgComponent {
  public containerRef = viewChild.required<ElementRef>('projectImg');
  public REPO = input.required<string>();
  public SRC = input.required<string>();

  public TITLE = input.required<string>();
  public ID = input.required<string>();
}
