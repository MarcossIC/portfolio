import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { FooterContactComponent } from './footer-contact.component';

describe('FooterContactComponent', () => {
  let component: FooterContactComponent;
  let fixture: ComponentFixture<FooterContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterContactComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
