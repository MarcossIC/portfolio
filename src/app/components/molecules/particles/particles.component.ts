import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit, OnDestroy, PLATFORM_ID, Inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type IParticlesProps, NgParticlesModule } from 'ng-particles';
import {
  ClickMode,
  type Container,
  type Engine,
  HoverMode,
  MoveDirection,
  OutMode,
} from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { take, timer } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, NgParticlesModule],
  selector: 'app-particles',
  template: `
    <div class="w-[1310px] h-full absolute right-0 bottom-0">
      <div
        class="bg-none lg:bg-explosion lg:bg-cover lg:bg-right lg:bg-no-repeat w-full h-full"
      >
        <!-- Contenedor específico para las partículas -->
        <div
          class="w-full h-full absolute mix-blend-color-dodge"
          style="z-index: -1;"
        >
          @if (particlesOptions$ && shouldShowParticles) {
            <ng-particles
              [id]="id"
              [options]="particlesOptions$"
              [particlesInit]="particlesInit"
              (particlesLoaded)="particlesLoaded($event)"
            ></ng-particles>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./particles.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticlesComponent implements OnInit {
  private currenteColor: string;
  private isMobile: boolean = false;
  private loadTimeout?: number;
  protected id = 'tsparticles';
  protected particlesOptions$: IParticlesProps | undefined;
  protected shouldShowParticles: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.currenteColor = '#c48cd8';
    this.isMobile = this.detectMobile();
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId) || this.shouldShowParticles) {
        return;
      }
      if (this.isMobile) {
        timer(2000).pipe(take(1)).subscribe(() => {
          this.shouldShowParticles = true;
        });
      } else {
        this.shouldShowParticles = true;
      }
    });
  }
  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Configurar partículas según el dispositivo
    this.particlesOptions$ = this.isMobile ? this.getMobileConfig() : this.getDesktopConfig();
    if (this.isMobile) {
      timer(2000).pipe(take(1)).subscribe(() => {
        this.shouldShowParticles = true;
      });
    } else {
      this.shouldShowParticles = true;
    }
  }

  private detectMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 768;

    return isMobileDevice || isSmallScreen;
  }

  private getMobileConfig(): IParticlesProps {
    return {
      background: {
        color: {
          value: 'none',
        },
      },
      fpsLimit: 30, // Reducido para móviles
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: ClickMode.repulse,
          },
          onHover: {
            enable: false, // Deshabilitado en móviles
            mode: HoverMode.bubble,
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 2,
          },
          repulse: {
            distance: 200,
            duration: 0.2,
          },
        },
      },
      particles: {
        color: {
          value: this.currenteColor,
        },
        links: {
          color: this.currenteColor,
          distance: 100, // Reducido
          enable: false,
          opacity: 0.2, // Menos opacidad
          width: 1,
        },
        collisions: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 0.4, // Mucho más lento
          direction: MoveDirection.topLeft,
          random: false,
          straight: false,
          outModes: {
            default: OutMode.out,
          },
        },
        number: {
          density: {
            enable: true,
            area: 1200, // Mayor área = menos densidad
          },
          value: 30, // Muchas menos partículas
        },
        opacity: {
          value: 0.6, // Menos opacidad
          anim: {
            enable: false, // Sin animación de opacidad
            speed: 1,
            opacity_min: 0,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#fff',
          },
        },
        size: {
          value: { min: 1, max: 2 }, // Partículas más pequeñas
          random: true,
          anim: {
            enable: false, // Sin animación de tamaño
            speed: 2,
            size_min: 0.3,
            sync: true,
          },
        },
      },
      detectRetina: false, // Deshabilitado en móviles
    };
  }

  private getDesktopConfig(): IParticlesProps {
    return {
      background: {
        color: {
          value: 'none',
        },
      },
      fpsLimit: 60, // Reducido de 120 a 60
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: ClickMode.repulse,
          },
          onHover: {
            enable: true,
            mode: HoverMode.bubble,
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 400,
            duration: 0.4,
          },
          bubble: { // Corregido el typo "buble"
            distance: 250,
            size: 0,
            duration: 2,
            opacity: 0,
            speed: 3,
          },
        },
      },
      particles: {
        color: {
          value: this.currenteColor,
        },
        links: {
          color: this.currenteColor,
          distance: 150,
          enable: false,
          opacity: 0.4,
          width: 1,
        },
        collisions: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: MoveDirection.topLeft,
          random: false,
          straight: false,
          outModes: {
            default: OutMode.out,
          },
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80, // Reducido de 100 a 80
        },
        opacity: {
          value: 0.9,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#fff',
          },
          polygon: {
            nb_sides: 5,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
          anim: {
            enable: true,
            speed: 4,
            size_min: 0.3,
            sync: true,
          },
        },
      },
      detectRetina: true,
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  particlesLoaded(container: Container): void {}

  async particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }
}
