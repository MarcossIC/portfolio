import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ServiceLayoutComponent } from './ourService.component';

describe('OurServiceComponent', () => {
  let component: ServiceLayoutComponent;
  let fixture: ComponentFixture<ServiceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceLayoutComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
