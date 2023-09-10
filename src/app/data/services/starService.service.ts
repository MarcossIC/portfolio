import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarServiceService {
  color: string;
  changeColor: EventEmitter<string>;

  constructor() {
    this.color = "#c48cd8";
    this.changeColor = new EventEmitter<string>;
   }

}
