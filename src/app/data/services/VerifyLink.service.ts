import { Injectable, inject } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';

@Injectable({
  providedIn: 'any'
})
export class VerifyLinkService {
  private router: Router = inject(Router);

  constructor() { }

  isLinkActive(url: string): boolean {
    console.log(url);
    const options: IsActiveMatchOptions = { paths: 'exact', queryParams: 'exact', fragment: 'exact', matrixParams: 'exact' };
    return this.router.isActive(url, options);
  }
}
