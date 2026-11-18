import { createFrameWatchdog } from './frame-watchdog';

// The scene can exist (a WebGL context was created) and still never put a frame
// on screen: a compile that never settles, a lost context, a driver that eats
// every draw. The watchdog turns "no frame in time" into a fallback, but only
// counts time in which the scene was supposed to be drawing.
describe('createFrameWatchdog', () => {
  const TIMEOUT = 2500;
  let fired: number;
  const onTimeout = () => fired++;

  beforeEach(() => {
    fired = 0;
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('fires once when no frame arrives within the timeout', () => {
    createFrameWatchdog(TIMEOUT, onTimeout);
    vi.advanceTimersByTime(TIMEOUT - 1);
    expect(fired).toBe(0);
    vi.advanceTimersByTime(1);
    expect(fired).toBe(1);
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(1);
  });

  it('never fires once a frame arrived', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    vi.advanceTimersByTime(TIMEOUT - 1);
    dog.frame();
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(0);
  });

  // Hidden tab, hero scrolled away or faded out: not drawing is the scene doing its job.
  it('does not count time while the scene is legitimately idle', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    dog.setActive(false);
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(0);
  });

  it('accumulates only active time across idle stretches', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    vi.advanceTimersByTime(1000); // active: 1000
    dog.setActive(false);
    vi.advanceTimersByTime(60_000); // idle: not counted
    dog.setActive(true);
    vi.advanceTimersByTime(TIMEOUT - 1000 - 1);
    expect(fired).toBe(0);
    vi.advanceTimersByTime(1);
    expect(fired).toBe(1);
  });

  it('can start idle (hero below the fold on load)', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout, false);
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(0);
    dog.setActive(true);
    vi.advanceTimersByTime(TIMEOUT);
    expect(fired).toBe(1);
  });

  it('ignores repeated identical activity reports', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    vi.advanceTimersByTime(1000);
    dog.setActive(true);
    dog.setActive(true);
    vi.advanceTimersByTime(TIMEOUT - 1000);
    expect(fired).toBe(1);
  });

  it('stays silent after dispose (component destroyed)', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    dog.dispose();
    dog.setActive(true);
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(0);
  });

  it('ignores activity reports after the first frame', () => {
    const dog = createFrameWatchdog(TIMEOUT, onTimeout);
    dog.frame();
    dog.setActive(false);
    dog.setActive(true);
    vi.advanceTimersByTime(10 * TIMEOUT);
    expect(fired).toBe(0);
  });
});
