import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subject, catchError, takeUntil } from 'rxjs';
import { ContactState } from 'src/app/data/models/contactState.model';
import { SeoService } from 'src/app/data/services/seo.service';
import { ToastService } from 'src/app/data/services/toast/Toast.service';

@Component({
  selector: 'contact-page',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent implements OnInit, OnDestroy {

  private readonly toast = inject(ToastService);
  private readonly seo: SeoService = inject(SeoService);
  private readonly title: Title = inject(Title);
  private http = inject(HttpClient);
  private destroy$: Subject<void>;
  protected readonly titleID: string = "e913163167c3";

  constructor() { 
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {

    let t: string = "Contact - Marcos Lopez Web Portfolio";
    this.title.setTitle(t);
    this.seo.generateTags({
      title: t,
      description: "If you liked the work of Marcos Lopez as a developer, contact him now from this page.",
      slug: "contact"
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected handleFormSubmit(event: ContactState){
    console.log("event before:",event);
    this.toast.info("Sending...", "We are processing your request");

    let contactForm = new FormData();
    contactForm.append("name", event.name);
    contactForm.append("email", event.email);
    contactForm.append("message", event.message);

    this.sendForm(contactForm)
    .pipe(takeUntil(this.destroy$))
    .pipe(catchError((error: any)=>{
      this.toast.error("Error", "An unexpected error has occurred with the server");
      console.log("error:", error);
      return error;
    }))
    .subscribe((response: any)=>{
      console.log("event afeter:",response);
      this.toast.success("Success", "Your message has been sent successfully");
    });
  }

  private sendForm(data: FormData): Observable<any> {
    return this.http.post(
      "https://formspree.io/f/xdorrewr", 
      data, 
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
  }
}
