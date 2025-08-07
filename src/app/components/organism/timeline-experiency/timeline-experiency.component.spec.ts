import {
  waitForAsync,
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TimelineExperiencyComponent } from './timeline-experiency.component';

describe('TimelineExperiencyComponent', () => {
  let component: TimelineExperiencyComponent;
  let fixture: ComponentFixture<TimelineExperiencyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineExperiencyComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineExperiencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
