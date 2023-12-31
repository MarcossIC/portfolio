import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerifyLinkService } from 'src/app/data/services/VerifyLink.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'navigate',
  templateUrl: './navigate.component.html',
  styles: [`
    span{
      width: 0px;
      opacity: 0.95;
    }

    .active-link span{
        width: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigateComponent implements OnInit {
  @Input({ required: true }) public path: string = "";
  @Input({ required: true }) public textLink: string = "";
  @Input({ required: true }) public classNames: string = "";
  @Input({ required: true }) public isHeader: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
