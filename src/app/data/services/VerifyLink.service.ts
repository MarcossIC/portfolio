import { Injectable } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';

@Injectable({
  providedIn: 'any'
})
export class VerifyLinkService {

constructor(private router: Router) { }

  isLinkActive(url: string): boolean {
    const options: IsActiveMatchOptions = { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' };
    return this.router.isActive(url, options);
  }
}
