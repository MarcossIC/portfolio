import { Component, OnInit } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    AOS.init();
  }

  onBoundsChanged(event: any) {
  
    console.log(event);
    
  }
}
