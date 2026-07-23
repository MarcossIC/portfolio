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
