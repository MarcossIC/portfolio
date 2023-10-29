import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgToastService } from 'ng-angular-popup';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactPageComponent implements OnInit, AfterViewInit {

  private toast: NgToastService = inject(NgToastService);
  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);

  constructor() { }

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
    if(value === "true"){
      this.toast.success({detail: "Completado", summary: "Su mensaje se ha enviado correctamente", duration: 5000});
      setTimeout(()=>localStorage.setItem("emailSend", "false"), 1000);
    }
  }

  onBoundsChanged(event: any) {
    console.log(event);
  }

  onSubmit(){
    localStorage.setItem("emailSend", "true");
  }
}
