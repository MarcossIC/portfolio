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

  private toast: NgToastService = inject(NgToastService);
  private seo: SeoService = inject(SeoService);
  private title: Title = inject(Title);


  protected nameInput: any ={ 
    id: 1, value: '', dirty: false, isEmpty: true, isValid: false,
    pattern: /^[A-Za-zÀ-ÖØ-öø-ÿ'\-]{3,60}(?:\s[A-Za-zÀ-ÖØ-öø-ÿ'\-]{3,60})*$/ 
  };
  
  protected emailInput: any ={ 
    id: 1, value: '', dirty: false, isEmpty: true, isValid: false, 
    pattern: /^\s*(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\s*$/ 
  };

  protected messageInput: any ={ 
    id: 1, value: '', dirty: false, isEmpty: true, isValid: false, 
    pattern: /[A-Za-z0-9]/ 
  };

  constructor() { 
  }

  
  protected validatePattern(patterRegex: RegExp, inputString: string): boolean {
    return patterRegex.test(inputString);
  }

  protected verifyInput(input: any): void {
    input.isEmpty = input.value === "" || !input.value;
    input.isValid = this.validatePattern(input.pattern, input.value);
    input.dirty = true;
  }



  ngOnInit(): void {

    let t: string = "Contact - Marcos Lopez Web Portfolio";
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

  protected onSubmit(){
    this.toast.info({detail: "Procensando", summary: "Se esta enviando tu solicitud", duration: 5000});
    localStorage.setItem("emailSend", "true");

  }
}
