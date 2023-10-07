import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerifyLinkService } from 'src/app/data/services/VerifyLink.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {
  @Input() public path: string = "";
  @Input() public textLink: string = "";
  @Input() public classNames: string = "";
  @Input() public isHeader: boolean = false;
  @Input() public isRequiredBar: boolean = true;

  constructor(protected routerService: VerifyLinkService) { }

  ngOnInit() {
  }

}
