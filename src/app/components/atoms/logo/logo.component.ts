import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import AOS from 'aos';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent implements OnInit{
  constructor() {
  }
  ngOnInit(): void {
    
  }
  
}