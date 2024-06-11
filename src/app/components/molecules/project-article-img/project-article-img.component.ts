import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AtroposDirective } from '@app/lib/directives/AtroposDirective.directive';
import { CustomLink } from '@atoms/link/custom-link.component';

@Component({
  standalone: true,
  imports: [RouterLink, CustomLink, AtroposDirective],
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
