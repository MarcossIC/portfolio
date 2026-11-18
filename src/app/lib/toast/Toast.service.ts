import { Injectable } from '@angular/core';
import type { ToastModel, ToastProps } from '@app/models/toast.model';
import { ToastType, ToastPosition } from '@app/models/toast.model';
import { SignalsStoreService } from '../store/StoreSignals.service';

/** Duration of the exit animation; the toast is purged from the state afterwards. */
const LEAVE_MS = 220;
const MAX_TOASTS = 6;
const DEFAULT_SECONDS = 5;
/** Info toasts usually track a pending task and are dismissed by the caller. */
const INFO_SECONDS = 30;

interface CountdownTimer {
  handle: ReturnType<typeof setTimeout> | null;
  remainingMs: number;
  startedAt: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService extends SignalsStoreService<ToastProps> {
  private readonly timers = new Map<string, CountdownTimer>();

  constructor() {
    super({ toasts: [], position: ToastPosition.TOP_RIGHT } as ToastProps);
  }

  /** Starts the exit animation, then purges the toast. Safe to call twice. */
  public remove(ID: string | number): void {
    const id = String(ID);
    this.clearTimer(id);

    const target = this.state().toasts.find((t) => t.ID === id);
    if (!target || target.leaving) return;

    this.patch(id, { leaving: true });
    setTimeout(() => this.purge(id), LEAVE_MS);
  }

  /** Freezes the auto-dismiss countdown (e.g. while hovered or focused). */
  public pause(ID: string): void {
    const timer = this.timers.get(ID);
    if (!timer?.handle) return;
    clearTimeout(timer.handle);
    timer.handle = null;
    timer.remainingMs = Math.max(0, timer.remainingMs - (Date.now() - timer.startedAt));
  }

  /** Restarts a paused countdown with the time it had left. */
  public resume(ID: string): void {
    const timer = this.timers.get(ID);
    if (!timer || timer.handle) return;
    this.arm(ID, timer, timer.remainingMs);
  }

  private purge(id: string): void {
    this.state.update((s) => ({
      ...s,
      toasts: s.toasts.filter((t) => t.ID !== id),
    }));
  }

  private patch(id: string, changes: Partial<ToastModel>): void {
    this.state.update((s) => ({
      ...s,
      toasts: s.toasts.map((t) => (t.ID === id ? { ...t, ...changes } : t)),
    }));
  }

  private arm(id: string, timer: CountdownTimer, ms: number): void {
    timer.remainingMs = ms;
    timer.startedAt = Date.now();
    timer.handle = setTimeout(() => this.remove(id), ms);
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    this.timers.delete(id);
  }

  private show(
    title: string,
    message: string,
    seconds: number,
    type: ToastType,
    position: ToastPosition,
  ): string {
    if (!seconds || seconds <= 0) seconds = DEFAULT_SECONDS;

    const toast: ToastModel = {
      ID: crypto.randomUUID(),
      title,
      message,
      visible: true,
      type,
      seconds,
    };

    const overflow = this.state().toasts.length + 1 - MAX_TOASTS;
    if (overflow > 0) {
      this.state().toasts.slice(0, overflow).forEach((t) => this.clearTimer(t.ID));
    }
    this.state.update((s) => ({
      ...s,
      position,
      toasts: [...s.toasts, toast].slice(-MAX_TOASTS),
    }));

    const timer: CountdownTimer = { handle: null, remainingMs: 0, startedAt: 0 };
    this.timers.set(toast.ID, timer);
    this.arm(toast.ID, timer, seconds * 1000);
    return toast.ID;
  }

  public info(
    title: string,
    message: string,
    seconds = INFO_SECONDS,
    position: ToastPosition = ToastPosition.TOP_RIGHT,
  ): string {
    return this.show(title, message, seconds, ToastType.INFO, position);
  }

  public success(
    title: string,
    message: string,
    seconds = DEFAULT_SECONDS,
    position: ToastPosition = ToastPosition.TOP_RIGHT,
  ): string {
    return this.show(title, message, seconds, ToastType.SUCCESS, position);
  }

  public waring(
    title: string,
    message: string,
    seconds = DEFAULT_SECONDS,
    position: ToastPosition = ToastPosition.TOP_RIGHT,
  ): string {
    return this.show(title, message, seconds, ToastType.WARNING, position);
  }

  public error(
    title: string,
    message: string,
    seconds = DEFAULT_SECONDS,
    position: ToastPosition = ToastPosition.TOP_RIGHT,
  ): string {
    return this.show(title, message, seconds, ToastType.ERROR, position);
  }
}
