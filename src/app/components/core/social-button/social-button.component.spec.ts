import { TestBed } from '@angular/core/testing';
import { SocialButtonComponent } from './social-button.component';

describe('SocialButtonComponent', () => {
  const render = (icon: 'github' | 'linkedin' | 'gmail' | 'cv') => {
    const fixture = TestBed.createComponent(SocialButtonComponent);
    fixture.componentRef.setInput('to', 'https://example.com');
    fixture.componentRef.setInput('icon', icon);
    fixture.componentRef.setInput('title', 'Visit');
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.social-icon') as HTMLElement;
  };

  it.each(['github', 'linkedin', 'gmail', 'cv'] as const)(
    'paints the %s tile with an opaque fill and no backdrop blur',
    (icon) => {
      const tile = render(icon);
      // The gradient stops are solid colors, so a backdrop blur under them is
      // invisible; the extra pass made the GPU compositor stall periodically
      // (~70-90ms) while the WebGL hero animates behind the tiles.
      expect(tile.className).toMatch(/\bfrom-\w+-\d{3}\b(?!\/)/);
      expect(tile.className).not.toMatch(/\bbackdrop-/);
    }
  );
});
