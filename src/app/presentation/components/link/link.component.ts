import { Component, Input, OnInit } from '@angular/core';
import { VerifyLinkServiceService } from 'src/app/data/services/VerifyLinkService.service';

@Component({
  selector: 'navigate',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  @Input() public path: string = "";
  @Input() public textLink: string = "";
  @Input() public classNames: string = "";
  @Input() public isHeader: boolean = false;
  @Input() public isRequiredBar: boolean = true;

  
  constructor(protected routerService: VerifyLinkServiceService) { }

  ngOnInit() {
  }

}
