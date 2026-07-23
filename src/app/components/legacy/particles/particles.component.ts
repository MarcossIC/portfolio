import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
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
  imports: [NgParticlesModule],
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
          @if (particlesOptions() && shouldShowParticles()) {
            <ng-particles
              [id]="id"
              [options]="particlesOptions()!"
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
export class ParticlesComponent {
  private readonly currenteColor = '#c48cd8';
  private isMobile = false;
  protected id = 'tsparticles';
  protected readonly particlesOptions = signal<IParticlesProps | undefined>(undefined);
  protected readonly shouldShowParticles = signal(false);

  constructor() {
    afterNextRender(() => {
      this.isMobile = this.detectMobile();
      this.particlesOptions.set(this.isMobile ? this.getMobileConfig() : this.getDesktopConfig());

      if (this.isMobile) {
        timer(2000).pipe(take(1)).subscribe(() => {
          this.shouldShowParticles.set(true);
        });
      } else {
        this.shouldShowParticles.set(true);
      }
    });
  }

  private detectMobile(): boolean {
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
      fpsLimit: 30,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: ClickMode.repulse,
          },
          onHover: {
            enable: false,
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
          distance: 100,
          enable: false,
          opacity: 0.2,
          width: 1,
        },
        collisions: {
          enable: false,
        },
        move: {
          enable: true,
          speed: 0.4,
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
            area: 1200,
          },
          value: 30,
        },
        opacity: {
          value: 0.6,
          anim: {
            enable: false,
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
          value: { min: 1, max: 2 },
          random: true,
          anim: {
            enable: false,
            speed: 2,
            size_min: 0.3,
            sync: true,
          },
        },
      },
      detectRetina: false,
    };
  }

  private getDesktopConfig(): IParticlesProps {
    return {
      background: {
        color: {
          value: 'none',
        },
      },
      fpsLimit: 30,
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
          bubble: {
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
          value: 50,
        },
        opacity: {
          value: 0.8,
          anim: {
            enable: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
          anim: {
            enable: false,
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
