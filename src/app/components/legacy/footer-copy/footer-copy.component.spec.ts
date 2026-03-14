import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { FooterCopyComponent } from './footer-copy.component';

describe('FooterCopyComponent', () => {
  let component: FooterCopyComponent;
  let fixture: ComponentFixture<FooterCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterCopyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
