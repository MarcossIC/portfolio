import { Component, OnInit } from '@angular/core';
import { VerifyLinkServiceService } from '../data/services/VerifyLinkService.service';

import { PATHS } from '../../constants/appConst';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {
    PATHS: any = PATHS;

    constructor(protected routerService: VerifyLinkServiceService) { 
    }

    ngOnInit() {
    }

}
