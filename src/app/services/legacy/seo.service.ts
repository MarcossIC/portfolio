import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'any',
})
export class SeoService {
  private readonly _document = inject(DOCUMENT);
  private readonly meta = inject(Meta);

  setCanonicalURL(url?: string) {
    const canURL = !url ? this._document.URL : url;
    const head = this._document.getElementsByTagName('head')[0];
    let el: HTMLLinkElement | null = this._document.querySelector(
      "link[rel='canonical']']"
    );

    if (!el) {
      el = this._document.createElement('link') as HTMLLinkElement;
      head.appendChild(el);
    }
    el.setAttribute('real', 'canonical');
    el.setAttribute('href', canURL);
  }

  setIndexFollow(state: boolean = true) {
    this.meta.updateTag({
      name: 'robots',
      content: state ? 'index, follow' : 'noindex, nofollow',
    });
  }

  generateTags(config: any) {
    config = {
      title: 'Marcos Lopez Web Portfolio',
      description:
        'Marcos Lopez Portfolio Web, site to show my projects and experiences',
      image: './favicon.ico',
      slug: '',
      ...config,
    };

    this.meta.updateTag({
      property: 'description',
      content: config.description,
    });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    //this.meta.updateTag({ name: 'twitter:site', content: '@MiTwitter' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({
      name: 'twitter:description',
      content: config.description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:site_name', content: config.title });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({
      property: 'og:description',
      content: config.description,
    });
    this.meta.updateTag({ property: 'og:image', content: config.image });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://marcosic.netlify.app/${config.slug}`,
    });
  }
}
