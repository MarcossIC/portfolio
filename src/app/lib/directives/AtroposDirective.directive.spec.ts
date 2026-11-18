import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AtroposDirective, ATROPOS_FACTORY } from './AtroposDirective.directive';

const destroy = vi.fn();
const Atropos = vi.fn(() => ({ destroy }));

@Component({
  standalone: true,
  imports: [AtroposDirective],
  template: `<div class="atropos" useAtropos></div>`,
})
class HostComponent {}

describe('AtroposDirective', () => {
  let ioCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
  const disconnect = vi.fn();

  const mockMedia = (matches: boolean) =>
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduced') ? false : matches }));

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: ATROPOS_FACTORY, useValue: Atropos }],
    });
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(cb: typeof ioCallback) {
          ioCallback = cb;
        }
        observe() {}
        disconnect = disconnect;
      },
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  const create = () => {
    const f = TestBed.createComponent(HostComponent);
    f.detectChanges();
    TestBed.tick();
    return f;
  };

  it('does not instantiate Atropos on touch / no-hover devices', () => {
    mockMedia(false); // (hover: hover) and (pointer: fine) does not match
    create();
    expect(Atropos).not.toHaveBeenCalled();
  });

  it('instantiates only when near viewport and destroys on leave', () => {
    mockMedia(true);
    create();
    expect(Atropos).not.toHaveBeenCalled();
    ioCallback([{ isIntersecting: true }]);
    expect(Atropos).toHaveBeenCalledTimes(1);
    ioCallback([{ isIntersecting: false }]);
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('cleans up on component destroy', () => {
    mockMedia(true);
    const f = create();
    ioCallback([{ isIntersecting: true }]);
    f.destroy();
    expect(destroy).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalled();
  });
});
