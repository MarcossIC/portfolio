import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'custom-link',
  templateUrl: './custom-link.html',
  styleUrl: './custom-link.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomLink implements OnInit {
  @Input({ required: true }) public to: string = '';
  @Input({ required: true }) public classNames: string = '';

  constructor() {}

  ngOnInit(): void {}
}
