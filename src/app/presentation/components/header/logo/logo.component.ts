import { Component, HostListener } from '@angular/core'
import AOS from 'aos';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
})
export class LogoComponent {
  // Variable para mostrar u ocultar el botón
  showScrollButton = false;

  constructor() {

  }

  // Función para desplazarse hacia arriba
  scrollToTop() {
    AOS.refresh();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
  
}