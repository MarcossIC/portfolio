import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AtmosphereService, ATMOS_STORAGE_KEY } from './atmosphere.service';

describe('AtmosphereService', () => {
  const html = () => document.documentElement;

  beforeEach(() => {
    delete html().dataset['atmos'];
    localStorage.removeItem(ATMOS_STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  it('defaults to nebula when <html> has no data-atmos', () => {
    const service = TestBed.inject(AtmosphereService);

    expect(service.atmos()).toBe('nebula');
    expect(html().dataset['atmos']).toBeUndefined();
  });

  it('initializes as ember when the pre-paint script already set data-atmos', () => {
    html().dataset['atmos'] = 'ember';

    const service = TestBed.inject(AtmosphereService);

    expect(service.atmos()).toBe('ember');
  });

  it('commit("ember") sets data-atmos on <html>, persists it and updates the signal', () => {
    const service = TestBed.inject(AtmosphereService);

    service.commit('ember');

    expect(html().dataset['atmos']).toBe('ember');
    expect(localStorage.getItem(ATMOS_STORAGE_KEY)).toBe('ember');
    expect(service.atmos()).toBe('ember');
  });

  it('commit("nebula") removes the attribute so :root defaults apply again', () => {
    html().dataset['atmos'] = 'ember';
    const service = TestBed.inject(AtmosphereService);

    service.commit('nebula');

    expect(html().dataset['atmos']).toBeUndefined();
    expect(localStorage.getItem(ATMOS_STORAGE_KEY)).toBe('nebula');
    expect(service.atmos()).toBe('nebula');
  });

  it('toggle() flips between the two atmospheres', () => {
    const service = TestBed.inject(AtmosphereService);

    service.toggle();
    expect(service.atmos()).toBe('ember');
    expect(html().dataset['atmos']).toBe('ember');

    service.toggle();
    expect(service.atmos()).toBe('nebula');
    expect(html().dataset['atmos']).toBeUndefined();
  });

  it('survives a storage failure without throwing (private mode / blocked storage)', () => {
    const service = TestBed.inject(AtmosphereService);
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota');
      });

    expect(() => service.commit('ember')).not.toThrow();
    expect(service.atmos()).toBe('ember');

    setItem.mockRestore();
  });
});

// Regression (NG0751 report / SSR crash): Angular's server DOM implements
// get/set/removeAttribute but NOT `Element.dataset` — there is not a single
// reference to it in @angular/platform-server. Touching `dataset` while building
// the service threw `Cannot read properties of undefined (reading 'atmos')` and
// took the whole server render down.
describe('AtmosphereService (server DOM, no Element.dataset)', () => {
  const serverHtml = () => {
    const attrs = new Map<string, string>();
    return {
      attrs,
      getAttribute: (name: string) => attrs.get(name) ?? null,
      setAttribute: (name: string, value: string) => {
        attrs.set(name, value);
      },
      removeAttribute: (name: string) => {
        attrs.delete(name);
      },
    };
  };

  const mount = (documentElement: ReturnType<typeof serverHtml>) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DOCUMENT, useValue: { documentElement } },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    return TestBed.inject(AtmosphereService);
  };

  it('constructs on the server without reading dataset', () => {
    const html = serverHtml();

    expect(() => mount(html)).not.toThrow();
    expect(TestBed.inject(AtmosphereService).atmos()).toBe('nebula');
  });

  it('reads the atmosphere the pre-paint script left on <html>', () => {
    const html = serverHtml();
    html.setAttribute('data-atmos', 'ember');

    expect(mount(html).atmos()).toBe('ember');
  });

  it('commits through attributes, and skips localStorage off the browser', () => {
    const html = serverHtml();
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const service = mount(html);

    service.commit('ember');
    expect(html.getAttribute('data-atmos')).toBe('ember');

    service.commit('nebula');
    expect(html.getAttribute('data-atmos')).toBeNull();
    expect(setItem).not.toHaveBeenCalled();

    setItem.mockRestore();
  });
});
