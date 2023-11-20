import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NgToastService } from 'ng-angular-popup';
import { SeoService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnInit, AfterViewInit {
  protected contactForm: FormGroup;
  protected formBuilder: FormBuilder = inject(FormBuilder);
  private toast: NgToastService = inject(NgToastService);
  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);

  constructor() { 
    this.contactForm = this.formBuilder.group({
      name:    ['', [Validators.required, Validators.pattern(
        /^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{3,60}(?:\s[A-Za-zÀ-ÖØ-öø-ÿ'\-]{3,60})*$/
      )]],
      email: ['', [Validators.pattern(
        /^\s*(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\s*$/,
      ), Validators.required]],
      message: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    let t: string = "Marcos Lopez - Contact - Portfolio";
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      description: "Contact page in Marcos López web portfolio",
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

  onSubmit(){
    localStorage.setItem("emailSend", "true");
  }
}
