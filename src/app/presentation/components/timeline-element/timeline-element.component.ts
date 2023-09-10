import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DIRECTION } from 'src/constants/appConst';

@Component({
  selector: 'timeline-element',
  templateUrl: './timeline-element.component.html',
  styleUrls: ['./timeline-element.component.css']
})
export class TimelineElementComponent implements OnInit {
  protected DIRECTION: any = DIRECTION;
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef<HTMLHeadingElement>;
  
  @Input() public description: string = "";
  @Input() public state: string = "";
  @Input() public title: string = "";
  @Input() public strong: string = "";
  @Input() public strongStyle: string = "";
  @Input() public cardDirection: string = "";
  

  constructor() { }

  ngOnInit() {
  }

  strongText() {
    // Verifica que this.titleElement exista antes de acceder a su contenido
    if (!this.titleElement || !this.titleElement.nativeElement) {
      console.error("Element with reference 'titleElement' not found.");
      return;
    }

    const title: HTMLElement = this.titleElement.nativeElement;
    const content = title.innerText;

    // Expresión regular para buscar la palabra en el contenido
    const expresionRegular = new RegExp(this.strong, "gi");

    // Reemplazar la palabra con el color resaltado usando la etiqueta <span>
    const newContent = content.replace(
      expresionRegular,
      (match) => `<span class="${this.strongStyle}">${match}</span>`
    );

    // Asigna la nueva cadena de contenido al elemento
    title.innerHTML = newContent;
  }
}
