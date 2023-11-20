import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'project-card-body',
  template: `
    <div class="flex-pr min-[1500px]:mb-5">

      <div class="flex justify-between w-full mb-2 gap-x-1">
        <span class="project-title w-auto" role="heading" aria-label="Nombre del proyecto.">
          {{ PROJECT_NAME }}
        </span>

        <a class="w-auto deploy" [href]="PROJECT_LINK" target="_blank" role="button" aria-label="Link al repositorio del proyecto en github.">
          {{ TEXT_ANCHOR }}
          <svg aria-hidden="true" role="img" width="2em" height="2em" color="black" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor"><line y2="12" x2="19" y1="12" x1="5"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>

      <p class="details" role="contentinfo" aria-label="Descripción del proyecto.">
        {{ PROJECT_DESCRIPTION }}
      </p>
    </div>
  `,
  styleUrls: ['./project-card-body.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardBodyComponent implements OnInit {
  @Input({ required: true }) public PROJECT_NAME = "";
  @Input({ required: true }) public TEXT_ANCHOR = "";
  @Input({ required: true }) public PROJECT_LINK = "";
  @Input({ required: true }) public PROJECT_DESCRIPTION = "";

  constructor() { }

  ngOnInit(): void {
  }

}
