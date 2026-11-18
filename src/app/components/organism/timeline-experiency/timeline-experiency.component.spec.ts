import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineExperiencyComponent } from './timeline-experiency.component';

describe('TimelineExperiencyComponent', () => {
  let component: TimelineExperiencyComponent;
  let fixture: ComponentFixture<TimelineExperiencyComponent>;

  beforeEach(async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    await TestBed.configureTestingModule({
      imports: [TimelineExperiencyComponent],
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

  describe('node ignition', () => {
    const items = [1, 2, 3].map((i) => ({ ID: i, ROLE: 'r', COMPANY: 'c', DESCRIPTION: 'd', STACK: [], TIME: '' }));
    const centers = [100, 400, 700];
    beforeEach(() => {
      vi.stubGlobal(
        'IntersectionObserver',
        class {
          observe() {}
          disconnect() {}
        }
      );
    });
    beforeEach(() => {
      window.matchMedia = (() => ({ matches: false })) as unknown as typeof window.matchMedia;
    });
    afterEach(() => vi.unstubAllGlobals());

    const createWithItems = async () => {
      fixture = TestBed.createComponent(TimelineExperiencyComponent);
      fixture.componentRef.setInput('ITEMS', items);
      fixture.detectChanges();
      // jsdom has no layout: fake node centers via offsetTop (host 0 + node offset)
      const nodes = Array.from(fixture.nativeElement.querySelectorAll('.timeline-node')) as HTMLElement[];
      nodes.forEach((n, i) => {
        Object.defineProperty(n, 'offsetTop', { configurable: true, value: centers[i] });
        Object.defineProperty(n, 'offsetHeight', { configurable: true, value: 0 });
      });
      Object.defineProperty(container(), 'offsetHeight', { configurable: true, value: 1000 });
      await fixture.whenStable();
      vi.advanceTimersByTime(20);
    };
    const lit = () =>
      (Array.from(fixture.nativeElement.querySelectorAll('.timeline-node__badge')) as HTMLElement[]).map((b) =>
        b.classList.contains('is-lit')
      );
    const scrollTo = (top: number) => {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
      container().getBoundingClientRect = () => ({ top, height: 1000 }) as DOMRect;
      window.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(20);
    };

    it('lights nodes as the rail fill passes them and dims them when scrolling back', async () => {
      await createWithItems();
      scrollTo(400); // fill 0.4 -> nodes at 0.1, 0.4 lit
      expect(lit()).toEqual([true, true, false]);
      scrollTo(-100); // fill 0.9
      expect(lit()).toEqual([true, true, true]);
      scrollTo(600); // fill 0.2
      expect(lit()).toEqual([true, false, false]);
    });
  });
});
