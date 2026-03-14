import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineElementComponent } from './timeline-element.component';

describe('TimelineElementComponent', () => {
  let component: TimelineElementComponent;
  let fixture: ComponentFixture<TimelineElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineElementComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('description', 'Test description');
    fixture.componentRef.setInput('state', 'completed');
    fixture.componentRef.setInput('title', 'Test title');
    fixture.componentRef.setInput('cardDirection', 'left');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
