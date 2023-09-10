/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StarServiceService } from './starService.service';

describe('Service: StarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarServiceService]
    });
  });

  it('should ...', inject([StarServiceService], (service: StarServiceService) => {
    expect(service).toBeTruthy();
  }));
});
