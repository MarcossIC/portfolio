import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements AfterViewInit  {
  @ViewChild('titleElement', { static: true }) titleElement!: ElementRef<HTMLHeadingElement>;

  @Input() name: string = "";
  @Input() title: string = "";
  @Input() strong: string[] = [];
  @Input() strongStyle: string = "";
  @Input() className: string = "";

  constructor() {
   }

   ngAfterViewInit() {
    this.strongText();
  }


  strongText() {
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
