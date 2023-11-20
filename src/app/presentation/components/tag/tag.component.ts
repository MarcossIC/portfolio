import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'tag',
  template: `<span #tagRef class="tag select-none"> </span>`,
  styleUrls: ['./tag.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnInit {
  @Input({ required: true }) public tag: string = "";
  @Input({ required: true }) public background: string = "";
  @Input({ required: true }) public color: string = "";
  @ViewChild('tagRef', { static: true }) tagRef!: ElementRef;

  private renderer: Renderer2 = inject(Renderer2);
  
  constructor() { 
    this.tag = "";
    this.background = "";
    this.color = "";
  }

  ngOnInit(): void {
    const tagSpan: HTMLElement  = this.renderer.selectRootElement(this.tagRef.nativeElement);
    this.renderer.setStyle(tagSpan, "background", this.background);
    this.renderer.setStyle(tagSpan, "color", this.color);
    tagSpan.innerText = this.tag;
  }

}
