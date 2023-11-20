import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-title',
  template: `
    <h2 #titleElement [ngClass]="className" class="font-bold w-full" [title]="name">
      {{ title }}
    </h2>
  `,
  styleUrls: ['./title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent implements AfterViewInit  {
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef<HTMLHeadingElement>;

  @Input({ required: true }) name: string = "";
  @Input({ required: true }) title: string = "";
  @Input({ required: true }) strong: string[] = [];
  @Input({ required: true }) strongStyle: string = "";
  @Input() className: string = "";

  constructor() {
   }

   ngAfterViewInit() {
    this.strongText();
  }


  protected strongText(): void {
    // Verifica que this.titleElement exista antes de acceder a su contenido
    if (!this.titleElement || !this.titleElement.nativeElement) {
      console.error("Element with reference 'titleElement' not found.");
      return;
    }

    const title: HTMLElement = this.titleElement.nativeElement;
    let content = title.innerText;

    
    //Recorre el arreglo de palabras que se requieren resaltar
    this.strong.forEach((textStrong)=>{
      // Expresión regular para buscar la palabra en el contenido
      const expresionRegular = new RegExp(textStrong, "gi");

      
      // Reemplazar la palabra con el color resaltado usando la etiqueta <span>
      content = content.replace(
        expresionRegular,
        (match) => `<span class="${this.strongStyle}">${match}</span>`
      );

    });
    // Asigna la nueva cadena de contenido al elemento
    title.innerHTML = content;
  }
  
}
