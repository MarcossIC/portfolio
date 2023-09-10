import { Component, OnInit } from '@angular/core';
import { StarServiceService } from 'src/app/data/services/starService.service';
import { HEADER, PATHS } from 'src/constants/appConst';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  HEADER: any = HEADER;
  PATHS: any = PATHS;
  isOpenMore: boolean = false;
  selected: boolean[] = [false, false, false, false, false, false, false, true];
  
  constructor(protected starService: StarServiceService) { }

  ngOnInit() {
  }

  change(i: number){
    
    this.HEADER.MORE.STAR.OPTIONS.forEach((value:any, index:number) => {
      if(value.SELECTED == true){
        value.SELECTED = false;
      }
      if(value.SELECTED == false && index == i){
        value.SELECTED = true;
      } 
    });
    this.starService.color = this.HEADER.MORE.STAR.OPTIONS[i].COLOR;
    console.log("ANTES DE EMITIR");
    this.starService.changeColor.emit(this.HEADER.MORE.STAR.OPTIONS[i].COLOR);
  }

}
