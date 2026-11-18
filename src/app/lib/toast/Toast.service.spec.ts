import { TestBed } from '@angular/core/testing';
import { ToastService } from './Toast.service';

describe('Service: Toast', () => {
  let service: ToastService;

  const list = () => service.state().toasts;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns the id of the created toast', () => {
    const id = service.info('t', 'm');
    expect(list().map((t) => t.ID)).toEqual([id]);
  });

  it('remove() notifies signal readers and purges after the leave animation', () => {
    const id = service.info('t', 'm');
    const before = service.state();

    service.remove(id);
    expect(service.state()).not.toBe(before);
    expect(list()[0].leaving).toBe(true);

    vi.advanceTimersByTime(400);
    expect(list()).toHaveLength(0);
  });

  it('auto-dismisses success toasts after ~5s', () => {
    service.success('t', 'm');
    vi.advanceTimersByTime(4900);
    expect(list()).toHaveLength(1);
    vi.advanceTimersByTime(600);
    expect(list()).toHaveLength(0);
  });

  it('auto-dismisses error toasts after ~5s', () => {
    service.error('t', 'm');
    vi.advanceTimersByTime(5600);
    expect(list()).toHaveLength(0);
  });

  it('pause() holds the countdown and resume() restarts it', () => {
    const id = service.success('t', 'm');
    vi.advanceTimersByTime(3000);
    service.pause(id);
    vi.advanceTimersByTime(60_000);
    expect(list()).toHaveLength(1);

    service.resume(id);
    vi.advanceTimersByTime(1900);
    expect(list()).toHaveLength(1);
    vi.advanceTimersByTime(600);
    expect(list()).toHaveLength(0);
  });

  it('removing an info toast manually cancels its timer without errors', () => {
    const id = service.info('t', 'm');
    service.remove(id);
    vi.advanceTimersByTime(200_000);
    expect(list()).toHaveLength(0);
  });
});
