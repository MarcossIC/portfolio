import { Component, OnInit } from '@angular/core';
import { SERVICES } from 'src/constants/appConst';
import AOS from 'aos';

@Component({
  selector: 'service-layout',
  templateUrl: './ourService.component.html',
  styleUrls: ['./ourService.component.css']
})
export class ServiceLayoutComponent implements OnInit {
  SERVICES: any = SERVICES;
  constructor() { }

  ngOnInit() {
    AOS.init();
  }

}
