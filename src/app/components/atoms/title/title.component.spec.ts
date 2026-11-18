import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleComponent } from './title.component';
import { ComponentRef } from '@angular/core';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let componentRef: ComponentRef<TitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('name', 'Test Title');
    componentRef.setInput('titleID', 'test-id');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Nesting background-clip: text breaks in Chromium once the accent span gets its own
  // compositing layer: the span's glyphs land in the h2's mask at the h2's origin and a
  // ghost copy of the accent word shows up at the left edge. Each word carries its own
  // gradient instead, so the h2 must never clip its background to text.
  it('does not clip the h2 background to its text', () => {
    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
    expect(h2.classList.contains('bg-clip-text')).toBe(false);
    expect(h2.classList.contains('text-transparent')).toBe(false);
  });
});
