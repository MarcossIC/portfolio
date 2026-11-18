import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomePage } from './home.component';
import { NavigationService } from '@app/services/NavigationService.service';

describe('HomePageComponent', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const navigation = { scrollToHash: vi.fn(() => Promise.resolve(false)) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: NavigationService, useValue: navigation }],
    })
    .overrideComponent(HomePage, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('scrolls to the URL hash after the first render', async () => {
    await fixture.whenStable();
    expect(navigation.scrollToHash).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
