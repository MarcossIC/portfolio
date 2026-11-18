export interface FrameWatchdog {
  /** Whether the scene is supposed to be drawing right now. Only active time counts. */
  setActive(active: boolean): void;
  /** A frame reached the screen: the watchdog disarms for good. */
  frame(): void;
  /** Disarms without firing (owner destroyed). */
  dispose(): void;
}

/**
 * Fires `onTimeout` once if no frame arrives within `timeoutMs` of *active* time.
 *
 * A scene that legitimately does not draw (hidden tab, hero off-screen or faded
 * out) pauses the clock instead of failing: only time in which a frame was due
 * counts. Framework-free and timer-based, so it is testable with fake timers.
 *
 * @param startActive the scene's state at creation; it reports changes after that
 */
export function createFrameWatchdog(
  timeoutMs: number,
  onTimeout: () => void,
  startActive = true
): FrameWatchdog {
  let remaining = timeoutMs;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let armedAt = 0;
  let done = false;

  const stop = () => {
    if (timer === undefined) return;
    clearTimeout(timer);
    timer = undefined;
    remaining -= Date.now() - armedAt;
  };
  const start = () => {
    if (done || timer !== undefined) return;
    armedAt = Date.now();
    timer = setTimeout(() => {
      timer = undefined;
      done = true;
      onTimeout();
    }, Math.max(0, remaining));
  };
  const disarm = () => {
    stop();
    done = true;
  };

  if (startActive) start();

  return {
    setActive: (active) => (active ? start() : stop()),
    frame: disarm,
    dispose: disarm,
  };
}
