import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewContainerRef, inject } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-title',
  template: `
    <h2 [id]="titleID" [ngClass]="className" class="font-bold w-full" [title]="name" [textContent]="title">
    </h2>
  `,
  styleUrls: ['./title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent implements AfterViewInit {
  @Input({ required: true }) public name: string = "";
  @Input({ required: true }) public title: string = "";
  @Input({ required: true }) public strong: string[] = [];
  @Input({ required: true }) public strongStyle: string = "";
  @Input({ required: true }) public titleID: string = "";
  @Input() public className: string = "";

  private viewRef: ViewContainerRef = inject(ViewContainerRef);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
   }

   ngAfterViewInit(): void {
    let titleElement = this.viewRef.element.nativeElement.querySelector(`#${this.titleID}`);
    this.renderFormattedTitle(titleElement);
  }

  protected renderFormattedTitle(titleElement: HTMLElement): void {

    // Verifica que this.titleElement exista antes de acceder a su contenido
    if (!titleElement) {
      console.error("Element with reference 'titleElement' not found.");
      return;
    }
    let content = titleElement.innerHTML;
    
    //Recorre el arreglo de palabras que se requieren resaltar
    this.strong.forEach((word)=>{
      // Expresión regular para buscar la palabra en el contenido
      const expresionRegular = new RegExp(word, "gi");
      // Reemplazar la palabra con el color resaltado usando la etiqueta <span>
      content = content.replace(
        expresionRegular,
        (match: any) => `<span class="${this.strongStyle}">${match}</span>`
      );

    });
    // Asigna la nueva cadena de contenido al elemento
    titleElement.innerHTML = content;
  }
  
}
