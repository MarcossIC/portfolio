/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StudiesLayoutComponent } from './studies.component';

describe('StudiesLayoutComponent', () => {
  let component: StudiesLayoutComponent;
  let fixture: ComponentFixture<StudiesLayoutComponent>;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
