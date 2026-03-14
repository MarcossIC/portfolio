import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { StudiesLayout } from './studies.component';

describe('StudiesLayoutComponent', () => {
  let component: StudiesLayout;
  let fixture: ComponentFixture<StudiesLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesLayout],
      providers: [provideNoopAnimations()],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .overrideComponent(StudiesLayout, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudiesLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
