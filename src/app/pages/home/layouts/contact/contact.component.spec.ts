import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastService } from '@app/lib/toast/Toast.service';
import { ContactLayout } from './contact.component';

describe('ContactLayout', () => {
  let fixture: ComponentFixture<ContactLayout>;
  let http: HttpTestingController;
  let toast: ToastService;

  const el = () => fixture.nativeElement as HTMLElement;
  const fill = (id: string, value: string) => {
    const f = el().querySelector<HTMLInputElement>(`#contact-${id}`)!;
    f.value = value;
    f.dispatchEvent(new Event('input'));
    f.dispatchEvent(new Event('blur'));
  };
  const submitValid = () => {
    fill('name', 'Ada Lovelace');
    fill('email', 'ada@example.com');
    fill('message', 'Hello there, this is a message');
    fixture.detectChanges();
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };
  const types = () => toast.state().toasts.filter((t) => !t.leaving).map((t) => t.type);

  beforeEach(async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    await TestBed.configureTestingModule({
      imports: [ContactLayout],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    toast = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(ContactLayout);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('never posts an empty form', () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    http.expectNone(() => true);
  });

  it('shows a sending toast, then swaps it for success and resets the form', () => {
    vi.useFakeTimers();
    submitValid();
    const req = http.expectOne('https://formspree.io/f/xdorrewr');
    expect(types()).toEqual(['info']);

    req.flush({ ok: true });
    vi.advanceTimersByTime(500);
    expect(types()).toEqual(['success']);
    fixture.detectChanges();
    expect(el().querySelector<HTMLInputElement>('#contact-name')!.value).toBe('');
  });

  it('dismisses the sending toast and shows an error toast on failure, keeping the values', () => {
    vi.useFakeTimers();
    submitValid();
    http.expectOne('https://formspree.io/f/xdorrewr').flush('boom', {
      status: 500,
      statusText: 'Server Error',
    });
    vi.advanceTimersByTime(500);
    expect(types()).toEqual(['error']);
    fixture.detectChanges();
    expect(el().querySelector<HTMLInputElement>('#contact-name')!.value).toBe('Ada Lovelace');
  });

  it('blocks a second submit while the first is in flight', () => {
    submitValid();
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    http.expectOne('https://formspree.io/f/xdorrewr');
  });

  it('still sends and releases `sending` when toast creation throws', () => {
    vi.spyOn(toast, 'info').mockImplementation(() => {
      throw new Error('boom');
    });
    const sending = () => (fixture.componentInstance as unknown as { sending: () => boolean }).sending();
    submitValid();
    const req = http.expectOne('https://formspree.io/f/xdorrewr');
    expect(sending()).toBe(true);
    req.flush({});
    expect(sending()).toBe(false);
  });
});
