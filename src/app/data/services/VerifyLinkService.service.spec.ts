/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { VerifyLinkService } from './VerifyLink.service';

describe('Service: VerifyLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifyLinkService]
    });
  });

  it('should ...', inject([VerifyLinkService], (service: VerifyLinkService) => {
    expect(service).toBeTruthy();
  }));
});
