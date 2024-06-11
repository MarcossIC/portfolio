import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'page-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageComponent implements OnInit {
  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);
  constructor() {}

  ngOnInit(): void {
    let t: string = 'About me - Marcos Lopez Web Portfolio';
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      description: 'About me page in Marcos López web portfolio',
      slug: 'about',
    });
  }
}
