import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  type AfterViewInit,
  Component,
  DestroyRef,
  HostListener,
  OnInit,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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
import * as AOS from 'aos';

@Component({
  selector: 'animation-module',
  standalone: true,
  templateUrl: './animation-module.component.html',
  styleUrl: './animation-module.component.css',
  imports: [CommonModule],
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
    // Reduced motion version of background animation
    trigger('backgroundAnimationReduced', [
      state(
        'active',
        style({
          backgroundPosition: '0% 0%',
        })
      ),
      transition('* => active', [
        animate(
          '1s ease-in-out',
          keyframes([
            style({ backgroundPosition: '0% 0%', offset: 0 }),
            style({ backgroundPosition: '0% 0%', offset: 1 }), // No movement for reduced motion
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
    // Reduced motion version of morph animation
    trigger('morphAnimationReduced', [
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
          '1s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) rotate(0deg)',
              borderRadius: '50%',
              offset: 0,
            }),
            style({
              transform: 'scale(1) rotate(0deg)', // No rotation for reduced motion
              borderRadius: '50%', // No shape change
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '1s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) rotate(0deg)',
              borderRadius: '50%',
              offset: 0,
            }),
            style({
              transform: 'scale(1) rotate(0deg)', // No rotation for reduced motion
              borderRadius: '50%', // No shape change
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
    // Reduced motion version of central morph animation
    trigger('centralMorphAnimationReduced', [
      state(
        'active',
        style({
          transform: 'scale(1) rotate(0deg)',
        })
      ),
      transition('* => active', [
        animate(
          '1s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) rotate(0deg)',
              offset: 0,
            }),
            style({
              transform: 'scale(1) rotate(0deg)', // No scaling or rotation for reduced motion
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
    // Reduced motion version of floating orb animation
    trigger('animateFloatingOrbReduced', [
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
          '0.5s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)', // No movement for reduced motion
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '0.5s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)', // No movement for reduced motion
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
    // Reduced motion version of large floating orb animation
    trigger('animateFloatingOrbLargeReduced', [
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
          '0.5s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)', // No movement for reduced motion
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('* => active2', [
        animate(
          '0.5s ease-in-out',
          keyframes([
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)',
              offset: 0,
            }),
            style({
              transform: 'scale(1) translateX(0px) translateY(0px)', // No movement for reduced motion
              offset: 1,
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AnimationModuleComponent implements AfterViewInit {
  private readonly document: Document = inject(DOCUMENT);
  private readonly platform = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollService = inject(ScrollProgressService);
  private readonly transformService = inject(TransformService);

  // Accessibility: Track user's motion preference
  protected readonly prefersReducedMotion = signal(false);

  // Accessibility: Computed animation trigger names based on motion preference
  protected readonly backgroundAnimationTrigger = computed(() =>
    this.prefersReducedMotion()
      ? 'backgroundAnimationReduced'
      : 'backgroundAnimation'
  );
  protected readonly morphAnimationTrigger = computed(() =>
    this.prefersReducedMotion() ? 'morphAnimationReduced' : 'morphAnimation'
  );
  protected readonly centralMorphAnimationTrigger = computed(() =>
    this.prefersReducedMotion()
      ? 'centralMorphAnimationReduced'
      : 'centralMorphAnimation'
  );
  protected readonly floatingOrbAnimationTrigger = computed(() =>
    this.prefersReducedMotion()
      ? 'animateFloatingOrbReduced'
      : 'animateFloatingOrb'
  );
  protected readonly floatingOrbLargeAnimationTrigger = computed(() =>
    this.prefersReducedMotion()
      ? 'animateFloatingOrbLargeReduced'
      : 'animateFloatingOrbLarge'
  );

  // Configuración de animaciones centralizadas
  private readonly ANIMATION_CONFIG = {
    durations: {
      blob: 20000,
      morph: 20000,
      floatingOrb: 12000,
      floatingOrbLarge: 8000,
      initialDelay: 100,
    },
    // Accessibility: Reduced motion durations (significantly shorter or static)
    reducedMotionDurations: {
      blob: 1000, // Much shorter duration
      morph: 1000, // Much shorter duration
      floatingOrb: 500, // Much shorter duration
      floatingOrbLarge: 500, // Much shorter duration
      initialDelay: 0, // No delay for reduced motion
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
    afterNextRender(() => {
      this.setupMotionPreferenceDetection();
      this.updateCenteredPosition();
      this.scrollService.startScrollListener();
      this.scrollService.startSpringAnimation();
      this.startBackgroundAnimation();
      this.initializeScrollObservables();
      this.initializeTransformations();
      this.startInfiniteAnimation();
    });
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

  /**
   * Sets up reactive detection for user's motion preferences using native browser API
   * Updates the prefersReducedMotion signal when the preference changes
   */
  private setupMotionPreferenceDetection(): void {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }

    // Use native browser API instead of Angular CDK
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      // Set initial value
      this.prefersReducedMotion.set(mediaQuery.matches);

      // Listen for changes
      const listener = (event: MediaQueryListEvent) => {
        this.prefersReducedMotion.set(event.matches);
      };

      mediaQuery.addEventListener('change', listener);

      // Cleanup listener on destroy
      this.destroyRef.onDestroy(() => {
        mediaQuery.removeEventListener('change', listener);
      });
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
    this.transformService
      .combineTransforms(transforms)
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

    // Accessibility: Choose durations based on motion preference
    const getCurrentDurations = () => {
      return this.prefersReducedMotion()
        ? this.ANIMATION_CONFIG.reducedMotionDurations
        : this.ANIMATION_CONFIG.durations;
    };

    // Iniciar la primera animación después de un pequeño delay
    scheduleAnimation(() => {
      this.morphAnimationState.set('active1');
      this.floatingOrbAnimationState.set('active1');
      this.floatingOrbAnimationStateLarge.set('active1');
    }, getCurrentDurations().initialDelay);

    // Animaciones infinitas optimizadas usando configuración centralizada
    createInfiniteAnimation(() => {
      this.blobAnimationState.update((state) =>
        state === 'active' ? 'inactive' : 'active'
      );
    }, getCurrentDurations().blob);

    createInfiniteAnimation(() => {
      this.morphAnimationState.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, getCurrentDurations().morph);

    createInfiniteAnimation(() => {
      this.floatingOrbAnimationState.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, getCurrentDurations().floatingOrb);

    createInfiniteAnimation(() => {
      this.floatingOrbAnimationStateLarge.update((state) =>
        state === 'active1' ? 'active2' : 'active1'
      );
    }, getCurrentDurations().floatingOrbLarge);
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
