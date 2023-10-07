import { Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { STUDIES } from 'src/constants/appConst';


@Component({
  selector: 'studies-layout',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.css']
})
export class StudiesLayoutComponent implements OnInit {
  protected STUDIES: any = STUDIES;

  constructor() { }

  ngOnInit(): void {
   
  }

}
