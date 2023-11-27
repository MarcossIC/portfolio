import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {

  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);
  constructor() { }

  ngOnInit(): void {
    let t: string = "Home - Marcos Lopez Web Portfolio";
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      slug: "home"
    });
  }

}
