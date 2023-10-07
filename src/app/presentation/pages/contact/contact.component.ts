import { AfterViewInit, Component, OnInit } from '@angular/core';
import AOS from 'aos';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit, AfterViewInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    AOS.init();
  }

  ngAfterViewInit(): void {
    const value = localStorage.getItem("emailSend");

    console.log(value);
    if(value === "true"){
      this.toastr.success('Su mensaje se ha enviado correctamente', 'Completado');
      setTimeout(()=>localStorage.setItem("emailSend", "false"), 500);
    }
  }

  onBoundsChanged(event: any) {
    console.log(event);
  }

  onSubmit(){
    localStorage.setItem("emailSend", "true");
  }
}
