import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  protected valorSeleccionado: string = ""; 
  @Input() public num: number = 0;
  
  constructor() { }

  ngOnInit() {
  }

  ratingChanged(event: any): void {
    this.valorSeleccionado = event.target.value;
    console.log(`Selected rating: ${this.valorSeleccionado}`);
    // Aquí puedes hacer lo que necesites con el valor seleccionado
  }
}
