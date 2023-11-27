import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { USER } from 'src/constants/userConst';
import { HERO } from 'src/constants/appConst';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'hero-text',
  templateUrl: './herotext.component.html',
  styleUrls: ['./herotext.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTextComponent implements OnInit {
  protected readonly USER: any = USER;
  protected readonly HERO: any = HERO;

  constructor() { }

  ngOnInit(): void { }
}
