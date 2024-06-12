import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ProjectArticleImgComponent } from '@app/components/molecules/project-article-img/project-article-img.component';

@Component({
  standalone: true,
  selector: 'project-article',
  templateUrl: './project-article.component.html',
  styleUrls: ['./project-article.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectArticleImgComponent],
})
export class ProjectArticleComponent implements OnInit {
  @Input() public PROJECT: any;

  constructor() {}
  ngOnInit(): void {}
}
