import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomLink } from '@app/components/atoms/link/custom-link.component';
import { VerifyLinkService } from '@app/services/VerifyLink.service';

@Component({
  standalone: true,
  imports: [CommonModule, CustomLink],
  selector: 'navigate',
  templateUrl: './navigate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigateComponent implements OnInit {
  @Input({ required: true }) public path: string = '';
  @Input({ required: true }) public textLink: string = '';
  @Input({ required: true }) public classNames: string = '';
  @Input({ required: true }) public isHeader: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
