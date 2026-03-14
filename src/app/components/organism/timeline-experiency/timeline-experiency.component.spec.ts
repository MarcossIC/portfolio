import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineExperiencyComponent } from './timeline-experiency.component';

describe('TimelineExperiencyComponent', () => {
  let component: TimelineExperiencyComponent;
  let fixture: ComponentFixture<TimelineExperiencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineExperiencyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineExperiencyComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ITEMS', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
