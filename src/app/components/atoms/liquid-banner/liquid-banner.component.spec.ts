import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { LiquidBannerComponent } from './liquid-banner.component';

describe('LiquidBannerComponent', () => {
  let component: LiquidBannerComponent;
  let fixture: ComponentFixture<LiquidBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiquidBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
