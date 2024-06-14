import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterLinkComponent } from '@atoms/router-link/router-link.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLinkComponent],
  selector: 'navigate',
  templateUrl: './navigate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigateComponent implements OnInit {
  @Input({ required: true }) public path: string = '';
  @Input({ required: true }) public fragment: string = '';
  @Input() public classNames: string = '';

  constructor() {}

  ngOnInit(): void {}
}
