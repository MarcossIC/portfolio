/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerifyLinkServiceService } from './VerifyLinkService.service';

describe('Service: VerifyLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyLinkServiceService]
    });
  });

  it('should ...', inject([VerifyLinkServiceService], (service: VerifyLinkServiceService) => {
    expect(service).toBeTruthy();
  }));
});
