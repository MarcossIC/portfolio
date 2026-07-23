import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonPrimaryComponent } from './button-primary.component';
import { Component, ComponentRef, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [ButtonPrimaryComponent],
  template: `
    <button-primary [href]="href()">
      <span class="projected">Resume</span>
    </button-primary>
  `,
})
class HostComponent {
  href = signal('');
}

describe('ButtonPrimaryComponent', () => {
  let component: ButtonPrimaryComponent;
  let fixture: ComponentFixture<ButtonPrimaryComponent>;
  let componentRef: ComponentRef<ButtonPrimaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrimaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonPrimaryComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a native button by default', () => {
    const button = fixture.nativeElement.querySelector('button.ml-btn-primary');
    expect(button).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a.ml-btn-primary')).toBeNull();
    expect(button.getAttribute('type')).toBe('button');
  });

  it('applies the nebula mode class by default', () => {
    const button = fixture.nativeElement.querySelector('.ml-btn-primary');
    expect(button.classList.contains('mode-nebula')).toBe(true);
  });

  it('applies the ember mode class when mode is ember', () => {
    componentRef.setInput('mode', 'ember');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.ml-btn-primary');
    expect(button.classList.contains('mode-ember')).toBe(true);
    expect(button.classList.contains('mode-nebula')).toBe(false);
  });

  it('emits clicked on click', () => {
    const clicked = vi.fn();
    component.clicked.subscribe(clicked);
    fixture.nativeElement.querySelector('button').click();
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  it('does not emit clicked while disabled', () => {
    componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const clicked = vi.fn();
    component.clicked.subscribe(clicked);
    fixture.nativeElement.querySelector('button').click();
    expect(clicked).not.toHaveBeenCalled();
  });

  describe('anchor variant', () => {
    beforeEach(() => {
      componentRef.setInput('href', 'https://example.com/cv.pdf');
      fixture.detectChanges();
    });

    it('renders an anchor instead of a button when href is set', () => {
      const anchor = fixture.nativeElement.querySelector('a.ml-btn-primary');
      expect(anchor).toBeTruthy();
      expect(fixture.nativeElement.querySelector('button')).toBeNull();
      expect(anchor.getAttribute('href')).toBe('https://example.com/cv.pdf');
    });

    it('sets rel noopener noreferrer when target is _blank', () => {
      componentRef.setInput('target', '_blank');
      fixture.detectChanges();
      const anchor = fixture.nativeElement.querySelector('a.ml-btn-primary');
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('applies mode classes on the anchor too', () => {
      componentRef.setInput('mode', 'ember');
      fixture.detectChanges();
      const anchor = fixture.nativeElement.querySelector('a.ml-btn-primary');
      expect(anchor.classList.contains('mode-ember')).toBe(true);
    });
  });

  describe('content projection', () => {
    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
    });

    it('projects content inside the button variant', () => {
      const projected = hostFixture.nativeElement.querySelector('button .projected');
      expect(projected?.textContent).toBe('Resume');
    });

    it('projects content inside the anchor variant', () => {
      hostFixture.componentInstance.href.set('https://example.com/cv.pdf');
      hostFixture.detectChanges();
      const projected = hostFixture.nativeElement.querySelector('a .projected');
      expect(projected?.textContent).toBe('Resume');
    });
  });

  describe('block (full width)', () => {
    it('does not apply the is-block class by default', () => {
      const button = fixture.nativeElement.querySelector('.ml-btn-primary');
      expect(button.classList.contains('is-block')).toBe(false);
    });

    it('applies the is-block class on wrapper and button when block is true', () => {
      componentRef.setInput('block', true);
      fixture.detectChanges();
      const wrapper = fixture.nativeElement.querySelector('.ml-btn-wrapper');
      const button = fixture.nativeElement.querySelector('.ml-btn-primary');
      expect(wrapper.classList.contains('is-block')).toBe(true);
      expect(button.classList.contains('is-block')).toBe(true);
    });
  });

  describe('ariaDisabled (soft disabled)', () => {
    beforeEach(() => {
      componentRef.setInput('ariaDisabled', true);
      fixture.detectChanges();
    });

    it('sets aria-disabled and the soft-disabled class without disabling the button', () => {
      const button = fixture.nativeElement.querySelector('button.ml-btn-primary');
      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.classList.contains('is-soft-disabled')).toBe(true);
      expect(button.disabled).toBe(false);
    });

    it('still emits clicked so the consumer can give feedback', () => {
      const clicked = vi.fn();
      component.clicked.subscribe(clicked);
      fixture.nativeElement.querySelector('button').click();
      expect(clicked).toHaveBeenCalledTimes(1);
    });
  });

  describe('sizes', () => {
    it('uses the default size without the size-sm class', () => {
      const button = fixture.nativeElement.querySelector('.ml-btn-primary');
      expect(button.classList.contains('size-sm')).toBe(false);
    });

    it('applies the size-sm class when size is sm', () => {
      componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('.ml-btn-primary');
      expect(button.classList.contains('size-sm')).toBe(true);
    });
  });
});
