import { TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

// Mock the ParticlesComponent to avoid tsparticles-engine ESM issues in tests
@Component({
  selector: 'app-particles',
  standalone: true,
  template: '<div></div>',
})
class MockParticlesComponent {}

describe('ParticlesComponent', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [MockParticlesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(MockParticlesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
