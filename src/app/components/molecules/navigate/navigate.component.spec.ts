import {
  type ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NavigateComponent } from './navigate.component';
import { NavigationService } from '@app/services/NavigationService.service';

describe('NavigateComponent', () => {
  let component: NavigateComponent;
  let fixture: ComponentFixture<NavigateComponent>;
  let navigationService: NavigationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate when clicking the host element (padding area)', () => {
    const navigateSpy = vi
      .spyOn(navigationService, 'navigateToSection')
      .mockResolvedValue(undefined);
    fixture.componentRef.setInput('fragment', 'projects');
    fixture.detectChanges();

    // Click directo sobre el host: el target es <navigate>, no el <a> interno
    (fixture.nativeElement as HTMLElement).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('projects', undefined);
  });

  it('should declare the host as cursor-interactive so the custom cursor reacts on the whole surface', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.hasAttribute('data-cursor-interactive')).toBe(true);
  });

  it('should navigate only once when clicking the inner anchor', () => {
    const navigateSpy = vi
      .spyOn(navigationService, 'navigateToSection')
      .mockResolvedValue(undefined);
    fixture.componentRef.setInput('fragment', 'projects');
    fixture.detectChanges();

    const anchor = (fixture.nativeElement as HTMLElement).querySelector('a');
    anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
