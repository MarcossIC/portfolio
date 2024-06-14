import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AboutIntroLayoutComponent } from '@app/components/legacy/introduction/introduction.component';
import { StudiesLayoutComponent } from '@app/pages/about/layouts/studies/studies.component';
import { SeoService } from '@app/services/legacy/seo.service';

@Component({
  standalone: true,
  selector: 'page-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AboutIntroLayoutComponent, StudiesLayoutComponent],
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
