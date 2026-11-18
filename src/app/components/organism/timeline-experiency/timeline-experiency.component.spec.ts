import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineExperiencyComponent } from './timeline-experiency.component';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

describe('TimelineExperiencyComponent', () => {
  let component: TimelineExperiencyComponent;
  let fixture: ComponentFixture<TimelineExperiencyComponent>;
  let reduced = false;

  beforeEach(async () => {
    reduced = false;
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    await TestBed.configureTestingModule({
      imports: [TimelineExperiencyComponent],
      providers: [{ provide: ReducedMotionService, useValue: { prefersReducedMotion: () => reduced } }],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  const create = async () => {
    fixture = TestBed.createComponent(TimelineExperiencyComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ITEMS', []);
    fixture.detectChanges();
    await fixture.whenStable();
    vi.advanceTimersByTime(20);
  };
  const progress = () => fixture.nativeElement.querySelector('.timeline-progress') as HTMLElement;
  const container = () => fixture.nativeElement.querySelector('.timeline') as HTMLElement;

  it('should create', async () => {
    await create();
    expect(component).toBeTruthy();
  });

  it('writes --timeline-scale directly on scroll without a signal', async () => {
    await create();
    expect('timelineFill' in (component as object)).toBe(false);
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    container().getBoundingClientRect = () => ({ top: 400, height: 800 }) as DOMRect;
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(20);
    expect(progress().style.getPropertyValue('--timeline-scale')).toBe('0.5');
  });

  it('fills completely under reduced motion', async () => {
    reduced = true;
    await create();
    expect(progress().style.getPropertyValue('--timeline-scale')).toBe('1');
  });
});
