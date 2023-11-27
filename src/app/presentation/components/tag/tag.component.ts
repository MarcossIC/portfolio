import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'tag',
  template: `<span #tagRef class="tag select-none"> </span>`,
  styles: [`
    .tag{
      margin-top: 5px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 10px;
      padding-block: 5px;
      padding-inline: 13px;
      font-size: 14px;
      font-weight: 500;
      user-select: none;
    }

      @media screen and (min-width: 1580px){
        .tag {
          font-size: 1.6rem;
        }
      }
    
  `],
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
