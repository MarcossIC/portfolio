import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  @Input() public REPO = '';
  @Input() public SRC = '';

  @Input() public TITLE = '';
  @Input() public ID = '';
}
