import { AfterViewInit, Component, OnInit } from '@angular/core';
import AOS from 'aos';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
    AOS.init();
  }

  ngAfterViewInit(): void {
    const value = localStorage.getItem("emailSend");

    console.log(value);
    if(value === "true"){
      localStorage.setItem("emailSend", "false");
    }
  }

  onBoundsChanged(event: any) {
    console.log(event);
  }

  onSubmit(){
    localStorage.setItem("emailSend", "true");
  }
}
