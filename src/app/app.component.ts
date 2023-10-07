import { Component, OnInit } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(){ }
  
  ngOnInit(): void { 
    AOS.init(); 
  }
}
