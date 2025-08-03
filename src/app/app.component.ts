import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { FooterComponent } from '@organism/footer/footer.component';
import { HeaderComponent } from '@organism/header/header.component';
import { ParticlesComponent } from '@molecules/particles/particles.component';
import { LayoutComponent } from './components/legacy/layout/layout.component';
import { ToastComponent } from '@app/components/organism/toast/toast.component';
import { I18nService } from '@app/services/i18n.service';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransformService } from '@app/services/TransformService.service';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    ParticlesComponent,
    HeaderComponent,
    FooterComponent,
    ToastComponent,
  ],
  animations: [
    trigger('backgroundAnimation', [
      state(
        'active',
        style({
          backgroundPosition: '0% 0%',
        })
      ),
      transition('* => active', [
        animate(
          '20s ease-in-out',
          keyframes([
            style({ backgroundPosition: '0% 0%', offset: 0 }),
            style({ backgroundPosition: '100% 100%', offset: 0.5 }),
            style({ backgroundPosition: '0% 0%', offset: 1 }),
          ])
        ),
      ]),
    ]),
    trigger('morphAnimation', [
      state(
        'active1',
        style({
          transform: 'scale(1) rotate(0deg)',
          borderRadius: '50%',
        })
      ),
      state(
        'active2',
        style({
          transform: 'scale(1) rotate(0deg)',
          borderRadius: '50%',
        })
      ),
      transition('* => active1', [
        animate(
          '20s ease-in-out',
          keyframes([
            // Keyframe 0% - Estado inicial
            style({
              transform: 'scale(1) rotate(0deg)',
              borderRadius: '50%',
              offset: 0,
            }),
            // Keyframe 25% - Primera transformación
            style({
              transform: 'scale(1.2) rotate(90deg)',
              borderRadius: '40%',
              offset: 0.25,
            }),
            // Keyframe 50% - Segunda transformación
            style({
              transform: 'scale(0.8) rotate(180deg)',
              borderRadius: '60%',
              offset: 0.5,
            }),
            // Keyframe 75% - Tercera transformación
            style({
              transform: 'scale(1) rotate(270deg)',
              borderRadius: '30%',
              offset: 0.75,
            }),
            // Keyframe 100% - Vuelta al estado inicial
            style({
              transform: 'scale(1) rotate(360deg)',
              borderRadius: '50%',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '20s ease-in-out',
          keyframes([
            // Keyframe 0% - Estado inicial
            style({
              transform: 'scale(1) rotate(0deg)',
              borderRadius: '50%',
              offset: 0,
            }),
            // Keyframe 25% - Primera transformación
            style({
              transform: 'scale(1.2) rotate(90deg)',
              borderRadius: '40%',
              offset: 0.25,
            }),
            // Keyframe 50% - Segunda transformación
            style({
              transform: 'scale(0.8) rotate(180deg)',
              borderRadius: '60%',
              offset: 0.5,
            }),
            // Keyframe 75% - Tercera transformación
            style({
              transform: 'scale(1) rotate(270deg)',
              borderRadius: '30%',
              offset: 0.75,
            }),
            // Keyframe 100% - Vuelta al estado inicial
            style({
              transform: 'scale(1) rotate(360deg)',
              borderRadius: '50%',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
    trigger('centralMorphAnimation', [
      state(
        'active',
        style({
          transform: 'scale(1) rotate(0deg)',
        })
      ),
      transition('* => active', [
        animate(
          '15s ease-in-out',
          keyframes([
            // Keyframe 0% - Estado inicial
            style({
              transform: 'scale(1) rotate(0deg)',
              offset: 0,
            }),
            // Keyframe 33% - Primera transformación
            style({
              transform: 'scale(1.3) rotate(180deg)',
              offset: 0.25,
            }),
            // Keyframe 66% - Segunda transformación
            style({
              transform: 'scale(0.9) rotate(360deg)',
              offset: 0.5,
            }),
            // Keyframe 100% - Vuelta al estado inicial
            style({
              transform: 'scale(1) rotate(0deg)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
    trigger('animateFloatingOrb', [
      state(
        'active1',
        style({
          transform: 'scale(1) translateX(0px) translateY(0px)',
        })
      ),
      state(
        'active2',
        style({
          transform: 'scale(1) translateX(0px) translateY(0px)',
        })
      ),
      transition('* => active1', [
        animate(
          '10s 2s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(0.9) translateX(-25px) translateY(25px)',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '10s 2s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(0.9) translateX(-25px) translateY(25px)',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
    trigger('animateFloatingOrbLarge', [
      state(
        'active1',
        style({
          transform: 'scale(1) translateX(0px) translateY(0px)',
        })
      ),
      state(
        'active2',
        style({
          transform: 'scale(1) translateX(0px) translateY(0px)',
        })
      ),
      transition('* => active1', [
        animate(
          '8s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1.1) translateX(30px) translateY(-20px)',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '8s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1.1) translateX(30px) translateY(-20px)',
              offset: 0.5,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AppComponent implements AfterViewInit, OnInit {
  private readonly document: Document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly i18nService = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollService = inject(ScrollProgressService);
  private readonly transformService = inject(TransformService);

  // Configuración de animaciones centralizadas
  private readonly ANIMATION_CONFIG = {
    durations: {
      blob: 20000,
      morph: 20000,
      floatingOrb: 12000,
      floatingOrbLarge: 8000,
      initialDelay: 100,
    },
    spring: {
      stiffness: 400,
      damping: 40,
      restDelta: 0.01,
      mass: 1,
    },
    mouse: {
      exitOffset: 400,
      initialPosition: { x: -400, y: -400 },
    },
  };

  public readonly followerElement = viewChild<any>('followerElement');
  protected mousePosition = signal(this.ANIMATION_CONFIG.mouse.initialPosition);
  protected mousePositionPercentage = signal({ x: 0, y: 0 });
  protected elementSize = signal({ width: 0, height: 0 });
  protected isActive = signal(false);
  animationState = 'inactive';
  protected readonly blobAnimationState = signal('active');
  protected readonly morphAnimationState = signal('active1');
  protected readonly floatingOrbAnimationState = signal('active1');
  protected readonly floatingOrbAnimationStateLarge = signal('active1');

  // Observables para el scroll
  scrollProgress$!: Observable<number>;
  smoothProgress$!: Observable<number>;

  // transforms = {
  //   backgroundY: 0,
  //   liquidScale: 1,
  //   liquidOpacity: 0.8,
  //   liquidBlur: 40,
  //   textOpacity: 0.05,
  //   geometryRotate: 0,
  //   geometryScale: 1
  // }
  public readonly backgroundY = signal(0);
  public readonly liquidScale = signal(1);
  public readonly liquidOpacity = signal(0.8);
  public readonly liquidBlur = signal(40);
  public readonly textOpacity = signal(0.05);
  public readonly geometryRotate = signal(0);
  public readonly geometryScale = signal(1);
  public readonly style = computed(() => ({
    transform: `translate(-50%, -50%) scale(${this.liquidScale()})`,
    opacity: this.liquidOpacity(),
    filter: `blur(${this.liquidBlur()}px)`,
  }));

  public readonly floatingOrbStyle = computed(() => ({
    transform: `translateY(${this.backgroundY()}px)`,
    opacity: this.liquidOpacity(),
  }));
  public readonly followerPosition = computed(() => ({
    transform: `translateX(${this.mousePosition().x}px) translateY(${
      this.mousePosition().y
    }px)`,
  }));

  constructor() {
    this.i18nService.initializeLanguage();
    afterNextRender(() => {
      this.updateCenteredPosition();
      this.scrollService.startScrollListener();
      this.scrollService.startSpringAnimation();
      this.startBackgroundAnimation();
      this.initializeScrollObservables();
      this.initializeTransformations();
      this.startInfiniteAnimation();
    });
  }

  ngOnInit(): void {
    // this.initializeScrollObservables();
    // this.initializeTransformations();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.document.onreadystatechange = function () {
        if (document.readyState == 'complete') {
          AOS.init({
            once: true,
            startEvent: 'DOMContentLoaded',
            easing: 'ease',
          });
          AOS.refresh();
        }
      };
    }
  }

  private initializeScrollObservables() {
    // Obtener el progreso básico del scroll
    this.scrollProgress$ = this.scrollService
      .getScrollYProgress()
      .pipe(takeUntilDestroyed(this.destroyRef));

    // Obtener el progreso suavizado con spring
    this.smoothProgress$ = this.scrollService
      .getSmoothScrollYProgress(this.ANIMATION_CONFIG.spring)
      .pipe(takeUntilDestroyed(this.destroyRef));
  }

  private initializeTransformations() {
    // Crear todas las transformaciones usando el progreso suavizado
    const transforms = this.transformService.createScrollTransforms(
      this.smoothProgress$
    );

    // Combinar todas las transformaciones en una sola suscripción
    this.transformService.combineTransforms(transforms)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        // Batch update de todos los signals para mejor performance
        this.backgroundY.set(values.backgroundY);
        this.liquidScale.set(values.liquidScale);
        this.liquidOpacity.set(values.liquidOpacity);
        this.liquidBlur.set(values.liquidBlur);
        this.textOpacity.set(values.textOpacity);
        this.geometryRotate.set(values.geometryRotate);
        this.geometryScale.set(values.geometryScale);
      });
  }

  @HostListener('document:pointermove', ['$event'])
  onMouseMove(evt: PointerEvent) {
    // const { left, top } = this.document.documentElement.getBoundingClientRect();
    // const [x, y] = this.getFixedCoords([evt.pageX - left , evt.pageY - top ]);
    const [x, y] = this.getFixedCoords([evt.clientX, evt.clientY]);
    this.mousePosition.set({
      x: x - this.elementSize().width / 2,
      y: y - this.elementSize().height / 2,
    });
    this.setMousePositionPercentage(evt);
  }
  @HostListener('document:pointerleave', ['$event'])
  onMouseLeave(event: PointerEvent) {
    const exitPosition = this.getExitPosition();
    this.mousePosition.set(exitPosition);
  }

  @HostListener('document:pointerenter', ['$event'])
  onMouseEnter(evt: PointerEvent) {
    // const [x, y] = this.getFixedCoords([evt.pageX - left , evt.pageY - top ]);
    const [x, y] = this.getFixedCoords([evt.clientX, evt.clientY]);
    this.mousePosition.set({
      x: x - this.elementSize().width / 2,
      y: y - this.elementSize().height / 2,
    });
  }

  private updateCenteredPosition() {
    const elementRect =
      this.followerElement()?.nativeElement?.getBoundingClientRect?.();
    if (elementRect) {
      this.elementSize.set({
        width: Math.round(elementRect.width),
        height: Math.round(elementRect.height),
      });
    }
  }

  private setMousePositionPercentage(evt: PointerEvent) {
    const rect = this.document.documentElement.getBoundingClientRect();
    const relatX = Math.round(((evt.clientX - rect.left) / rect.width) * 100);
    const relatY = Math.round(((evt.clientY - rect.top) / rect.height) * 100);
    this.mousePositionPercentage.set({
      x: Math.max(0, Math.min(100, relatX)),
      y: Math.max(0, Math.min(100, relatY)),
    });
  }

  private getFixedCoords(axis: [number, number]) {
    const [X, Y] = axis;
    return [Math.floor(X) + 0.5, Math.floor(Y) + 0.5];
  }

  /**
   * Determina hacia qué esquina debe salir el elemento flotante
   * basándose en la última posición conocida del mouse y dividiendo
   * el viewport en 4 cuadrantes
   */
  private getExitPosition(): { x: number; y: number } {
    if (!isPlatformBrowser(this.platform)) {
      return this.ANIMATION_CONFIG.mouse.initialPosition;
    }

    const currentPosition = this.mousePosition();
    const elementSize = this.elementSize();

    // Calcular la posición real del mouse (compensando el offset del elemento)
    const realMouseX = currentPosition.x + elementSize.width / 2;
    const realMouseY = currentPosition.y + elementSize.height / 2;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const exitOffset = this.ANIMATION_CONFIG.mouse.exitOffset;

    // Dividir el viewport en 4 cuadrantes
    const isLeftSide = realMouseX < viewportWidth / 2;
    const isTopSide = realMouseY < viewportHeight / 2;

    let exitX: number;
    let exitY: number;

    if (isLeftSide && isTopSide) {
      // Cuadrante superior izquierdo → esquina superior izquierda
      exitX = -exitOffset;
      exitY = -exitOffset;
    } else if (!isLeftSide && isTopSide) {
      // Cuadrante superior derecho → esquina superior derecha
      exitX = viewportWidth + exitOffset;
      exitY = -exitOffset;
    } else if (isLeftSide && !isTopSide) {
      // Cuadrante inferior izquierdo → esquina inferior izquierda
      exitX = -exitOffset;
      exitY = viewportHeight + exitOffset;
    } else {
      // Cuadrante inferior derecho → esquina inferior derecha
      exitX = viewportWidth + exitOffset;
      exitY = viewportHeight + exitOffset;
    }

    // Compensar el tamaño del elemento para que salga completamente de la pantalla
    return {
      x: exitX - elementSize.width / 2,
      y: exitY - elementSize.height / 2,
    };
  }

  private startBackgroundAnimation() {
    this.animationState = 'active';
    this.blobAnimationState.set('active');
  }

  private startInfiniteAnimation() {
    // Usar un enfoque más performante con timeouts para animaciones
    const scheduleAnimation = (callback: () => void, delay: number) => {
      const timeoutId = setTimeout(callback, delay);
      this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
    };

    // Función recursiva para animaciones infinitas más eficiente
    const createInfiniteAnimation = (
      callback: () => void,
      duration: number,
      immediate = false
    ) => {
      const animate = () => {
        if (!immediate) callback();
        scheduleAnimation(animate, duration);
      };

      if (immediate) {
        callback();
        scheduleAnimation(animate, duration);
      } else {
        scheduleAnimation(animate, duration);
      }
    };

    // Iniciar la primera animación después de un pequeño delay
    scheduleAnimation(() => {
      this.morphAnimationState.set('active1');
      this.floatingOrbAnimationState.set('active1');
      this.floatingOrbAnimationStateLarge.set('active1');
    }, this.ANIMATION_CONFIG.durations.initialDelay);

    // Animaciones infinitas optimizadas usando configuración centralizada
    createInfiniteAnimation(() => {
      this.blobAnimationState.update((state) =>
        state === 'active' ? 'inactive' : 'active'
      );
    }, this.ANIMATION_CONFIG.durations.blob);

    createInfiniteAnimation(() => {
      this.morphAnimationState.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, this.ANIMATION_CONFIG.durations.morph);

    createInfiniteAnimation(() => {
      this.floatingOrbAnimationState.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, this.ANIMATION_CONFIG.durations.floatingOrb);

    createInfiniteAnimation(() => {
      this.floatingOrbAnimationStateLarge.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, this.ANIMATION_CONFIG.durations.floatingOrbLarge);
  }

  get blobLiquidBackground(): string {
    return `
    radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)
    `;
  }
  get centralBackground(): string {
    return `
      radial-gradient(circle,
        rgba(139, 92, 246, 0.6) 0%,
        rgba(59, 130, 246, 0.4) 30%,
        rgba(236, 72, 153, 0.3) 60%,
          transparent 100%
      )
    `;
  }
}
