import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let emitted: unknown[];

  const el = () => fixture.nativeElement as HTMLElement;
  const input = (id: string) => el().querySelector<HTMLInputElement>(`#contact-${id}`)!;
  const type = (id: string, value: string) => {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  };
  const submit = () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ContactFormComponent] }).compileComponents();
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.contactState.subscribe((v) => emitted.push(v));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not emit an empty submission and shows inline errors', () => {
    submit();

    expect(emitted).toHaveLength(0);
    expect(input('name').getAttribute('aria-invalid')).toBe('true');
    expect(input('email').getAttribute('aria-invalid')).toBe('true');
    expect(input('message').getAttribute('aria-invalid')).toBe('true');
    expect(el().querySelectorAll('.field-error-text').length).toBe(3);
  });

  it('links each invalid field to its error via aria-describedby', () => {
    submit();
    const describedBy = input('name').getAttribute('aria-describedby')!;
    expect(el().querySelector(`#${describedBy}`)?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('shows no errors before the user touches or submits', () => {
    expect(el().querySelectorAll('.field-error-text').length).toBe(0);
    expect(input('name').getAttribute('aria-invalid')).toBeNull();
  });

  it('shows the error of a touched field only', () => {
    type('email', 'not-an-email');
    expect(input('email').getAttribute('aria-invalid')).toBe('true');
    expect(input('name').getAttribute('aria-invalid')).toBeNull();
  });

  it('rejects emails without a dotted domain', () => {
    type('name', 'Ada');
    type('email', 'ada@host');
    type('message', 'a long enough message');
    submit();
    expect(emitted).toHaveLength(0);
  });

  it('rejects blank (whitespace-only) values', () => {
    type('name', '   ');
    type('email', 'ada@example.com');
    type('message', '          ');
    submit();
    expect(emitted).toHaveLength(0);
  });

  it('emits trimmed values when valid', () => {
    type('name', ' Ada Lovelace ');
    type('email', 'ada@example.com');
    type('message', 'Hello there, this is a message');
    submit();
    expect(emitted).toEqual([
      { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there, this is a message' },
    ]);
  });

  it('focuses the first invalid field on a failed submit', () => {
    type('name', 'Ada');
    submit();
    expect(document.activeElement).toBe(input('email'));
  });

  it('prevents double submit while sending', () => {
    type('name', 'Ada');
    type('email', 'ada@example.com');
    type('message', 'Hello there, this is a message');
    fixture.componentRef.setInput('sending', true);
    fixture.detectChanges();
    submit();
    expect(emitted).toHaveLength(0);
    expect(el().querySelector('button')!.disabled).toBe(true);
  });

  it('does not clear the form after emitting; reset() clears it and the errors', () => {
    type('name', 'Ada');
    type('email', 'ada@example.com');
    type('message', 'Hello there, this is a message');
    submit();
    expect(input('name').value).toBe('Ada');

    component.reset();
    fixture.detectChanges();
    expect(input('name').value).toBe('');
    expect(el().querySelectorAll('.field-error-text').length).toBe(0);
  });
});
