import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AtroposDirective } from '@lib/directives/AtroposDirective.directive';

@Component({
  standalone: true,
  imports: [RouterLink, AtroposDirective],
  selector: 'project-article-img',
  templateUrl: './project-article-img.component.html',
  styleUrls: ['./project-article-img.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectArticleImgComponent implements OnInit {
  @Input() public REPO = '';
  @Input() public SRC = '';

  @Input() public TITLE = '';
  @Input() public ID = '';

  constructor() {}
  ngOnInit(): void {}
}
