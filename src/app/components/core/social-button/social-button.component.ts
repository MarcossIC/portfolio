import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

type IconType = 'github' | 'linkedin' | 'gmail' | 'cv';
interface Icon {
  icon: string;
  color: string;
}

const LIST_DEFAULT_ICONS: Record<IconType, Icon> = {
  github: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 md:w-8 md:h-8 text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>',
    color: "from-gray-700 to-gray-800"
  },
  linkedin: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 md:w-8 md:h-8 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
    color: "from-blue-600 to-blue-700"
  },
  gmail: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 md:w-8 md:h-8 text-white"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>',
    color: "from-red-600 to-red-700"
  },
  cv: {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 md:w-8 md:h-8 text-white"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>',
    color: "from-purple-600 to-purple-700"
  },
}


@Component({
  standalone: true,
  selector: 'social-button',
  imports: [NgClass],
  template: `
  <div class="flex justify-center gap-6 relative z-20 no-outline">
    <a
      [href]="to()"
      target="_blank"
      [rel]="isActiveRel()"
      [title]="title()"
      class="group relative no-outline"
    >
      <div class="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br rounded-[1.5rem] flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 no-outline" [ngClass]="imgIcon().color" [innerHTML]="imgIcon().icon">
      </div>
      <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <p class="visually-hidden" aria-hidden="true" role="contentinfo">
        Social media URL
      </p>
    </a>
  </div>
  `,
  styleUrl: './social-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtonComponent {
  private readonly sanitizer = inject(DomSanitizer);

  public to = input.required<string>();
  public rel = input<boolean>(true);
  public icon = input.required<IconType>();
  public title = input.required<string>();
  public imgIcon = computed(() => {
    const defaultIcon = LIST_DEFAULT_ICONS[this.icon()];
    const icon = this.sanitizer.bypassSecurityTrustHtml(defaultIcon.icon);
    return {
      icon,
      color: defaultIcon.color,
    };
  });

  protected isActiveRel() {
    return this.rel() ? 'noopener noreferrer' : '';
  }
}
