import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit, AfterViewInit {

  constructor(private toastr: ToastrService, private seo: SeoService, private title: Title) { }

  ngOnInit(): void {

    let t: string = "Contact - Marcos Lopez Web Portfolio";
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      description: "Contact page in Marcos López's web portfolio",
      slug: "contact"
    });
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
