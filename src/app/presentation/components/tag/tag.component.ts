import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() public tag: string;
  @Input() public background: string;
  @Input() public color: string;
  @ViewChild('tagRef', { static: true }) tagRef!: ElementRef;
  // [style]="'background-color:'+background+'; color:'+color+';'"
  //{{tag}}
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
