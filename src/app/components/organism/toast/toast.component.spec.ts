import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '@app/lib/toast/Toast.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ToastComponent] }).compileComponents();
    service = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
  });

  afterEach(() => vi.useRealTimers());

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a polite live region', () => {
    expect(el().querySelector('.toast-list')?.getAttribute('aria-live')).toBe('polite');
  });

  it('uses role=status for success and role=alert for errors', () => {
    vi.useFakeTimers();
    service.success('ok', 'fine');
    service.error('bad', 'broken');
    fixture.detectChanges();
    const toasts = el().querySelectorAll('.toast');
    expect(toasts[0].getAttribute('role')).toBe('status');
    expect(toasts[1].getAttribute('role')).toBe('alert');
  });

  it('closes a toast from its button (leaving, then gone)', () => {
    vi.useFakeTimers();
    service.info('t', 'm');
    fixture.detectChanges();
    el().querySelector<HTMLButtonElement>('.btn-close')!.click();
    fixture.detectChanges();
    expect(el().querySelector('.toast.leaving')).not.toBeNull();
    vi.advanceTimersByTime(300);
    fixture.detectChanges();
    expect(el().querySelector('.toast')).toBeNull();
  });

  it('pauses the auto-dismiss while hovered', () => {
    vi.useFakeTimers();
    service.success('t', 'm');
    fixture.detectChanges();
    el().querySelector('.toast')!.dispatchEvent(new Event('mouseenter'));
    vi.advanceTimersByTime(30_000);
    fixture.detectChanges();
    expect(el().querySelector('.toast')).not.toBeNull();
  });

  it('labels the close button through i18n', () => {
    vi.useFakeTimers();
    service.info('t', 'm');
    fixture.detectChanges();
    expect(el().querySelector('.btn-close')?.getAttribute('aria-label')).toBeTruthy();
  });
});
