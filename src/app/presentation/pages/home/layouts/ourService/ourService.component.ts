import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ServiceCardComponent } from 'src/app/presentation/components/service-card/service-card.component';
import { TitleComponent } from 'src/app/presentation/components/title/title.component';
import { SERVICES } from 'src/constants/appConst';


@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent, ServiceCardComponent],
  selector: 'service-layout',
  templateUrl: './ourService.component.html',
  styleUrls: ['./ourService.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceLayoutComponent implements OnInit {
  protected readonly SERVICES: any = SERVICES;
  protected readonly titleID: string = "df4f9aa1";
  constructor() { }

  ngOnInit(): void { }

  protected trackByFn(index: number, data: any): number | string{
    return data.ID;
  }
}
