import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineElementComponent } from './timeline-element.component';
import { ReducedMotionService } from '@app/services/ReducedMotion.service';

describe('TimelineElementComponent', () => {
  let component: TimelineElementComponent;
  let fixture: ComponentFixture<TimelineElementComponent>;
  let reduced = false;
  let finePointer = true;
  let ioCallback: IntersectionObserverCallback | null = null;
  const host = () => fixture.nativeElement as HTMLElement;
  const card = () => host().querySelector('.timeline-card') as HTMLElement;

  beforeEach(async () => {
    reduced = false;
    finePointer = true;
    ioCallback = null;
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    window.matchMedia = ((q: string) => ({
      matches: q.includes('hover: hover') ? finePointer : false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
    })) as unknown as typeof window.matchMedia;
    (globalThis as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb;
      }
      observe() {}
      disconnect() {}
    };

    await TestBed.configureTestingModule({
      imports: [TimelineElementComponent],
      providers: [{ provide: ReducedMotionService, useValue: { prefersReducedMotion: () => reduced } }],
    }).compileComponents();
  });

  afterEach(() => vi.useRealTimers());

  const create = async () => {
    fixture = TestBed.createComponent(TimelineElementComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('description', 'Test description');
    fixture.componentRef.setInput('state', 'completed');
    fixture.componentRef.setInput('title', 'Test title');
    fixture.componentRef.setInput('cardDirection', 'left');
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should create', async () => {
    await create();
    expect(component).toBeTruthy();
  });

  it('is visible by default (SSR / no JS) and only armed for animation by the client', async () => {
    await create();
    expect(host().classList.contains('is-armed')).toBe(true);
    expect(host().classList.contains('is-visible')).toBe(false);
  });

  it('is never armed under reduced motion', async () => {
    reduced = true;
    await create();
    expect(host().classList.contains('is-armed')).toBe(false);
  });

  it('reveals once intersecting', async () => {
    await create();
    ioCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    fixture.detectChanges();
    expect(host().classList.contains('is-visible')).toBe(true);
  });

  it('reads the card rect once per hover, not per pointermove', async () => {
    await create();
    const spy = vi.fn(() => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect);
    card().getBoundingClientRect = spy;
    card().dispatchEvent(new Event('pointerenter'));
    for (let i = 0; i < 3; i++) {
      card().dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 10 * i, clientY: 20 }));
      vi.advanceTimersByTime(20);
    }
    expect(spy).toHaveBeenCalledTimes(1);
    expect(card().style.transform).toContain('rotateX');
  });

  it('re-reads the rect after a scroll invalidated it', async () => {
    await create();
    const spy = vi.fn(() => ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect);
    card().getBoundingClientRect = spy;
    card().dispatchEvent(new Event('pointerenter'));
    card().dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 5, clientY: 5 }));
    vi.advanceTimersByTime(20);
    window.dispatchEvent(new Event('scroll'));
    card().dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 6, clientY: 6 }));
    vi.advanceTimersByTime(20);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not tilt without hover + fine pointer', async () => {
    finePointer = false;
    await create();
    card().dispatchEvent(new Event('pointerenter'));
    card().dispatchEvent(Object.assign(new Event('pointermove'), { clientX: 5, clientY: 5 }));
    vi.advanceTimersByTime(20);
    expect(card().style.transform).toBe('');
  });
});
