import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { CustomCursorComponent } from './custom-cursor.component';

describe('CustomCursorComponent', () => {
  let fixture: ComponentFixture<CustomCursorComponent>;
  let target: HTMLElement;

  beforeEach(async () => {
    // jsdom no implementa matchMedia; el cursor lo usa para detectar pointer coarse
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );
    // rAF asíncrono (macrotask): síncrono rompería el scheduler zoneless de Angular,
    // que también usa rAF, provocando NG0100 por reentrada en el change detection
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number
    );
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));

    await TestBed.configureTestingModule({
      imports: [CustomCursorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCursorComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => {
    target?.remove();
    vi.unstubAllGlobals();
  });

  async function moveOver(element: HTMLElement): Promise<void> {
    element.dispatchEvent(new MouseEvent('pointermove', { bubbles: true }));
    // Espera el rAF (stubeado como setTimeout) y la estabilización del scheduler zoneless
    await new Promise((resolve) => setTimeout(resolve, 10));
    await fixture.whenStable();
  }

  function cursorDot(): HTMLElement | null {
    return (fixture.nativeElement as HTMLElement).querySelector('.cursor-dot');
  }

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should activate hover state over anchors', async () => {
    target = document.createElement('a');
    document.body.appendChild(target);

    await moveOver(target);

    expect(cursorDot()?.classList.contains('cursor-hover')).toBe(true);
  });

  it('should activate hover state over elements opted in via data-cursor-interactive', async () => {
    target = document.createElement('div');
    target.setAttribute('data-cursor-interactive', '');
    document.body.appendChild(target);

    await moveOver(target);

    expect(cursorDot()?.classList.contains('cursor-hover')).toBe(true);
  });

  it('should not activate hover state over plain elements', async () => {
    target = document.createElement('div');
    document.body.appendChild(target);

    await moveOver(target);

    expect(cursorDot()?.classList.contains('cursor-hover')).toBe(false);
  });
});
