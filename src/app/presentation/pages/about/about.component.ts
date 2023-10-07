import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'page-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutPageComponent implements OnInit {

  constructor(private seo: SeoService, private title: Title) { }

  ngOnInit(): void {
    let t: string = "About - Marcos Lopez Web Portfolio";
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      description: "About me page in Marcos López's web portfolio",
      slug: "about"
    });

  }

}
