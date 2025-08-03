import {
  DestroyRef,
  DOCUMENT,
  inject,
  Injectable,
  OnDestroy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  animationFrameScheduler,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  observeOn,
  shareReplay,
  startWith,
  Subscription,
} from 'rxjs';

/**
 * Configuración para animaciones tipo spring (resorte)
 * Estos parámetros controlan el comportamiento de la animación suave
 */
export interface SpringConfig {
  /**
   * Rigidez del resorte (0-1000)
   * - Mayor valor: Animación más rápida y agresiva hacia el objetivo
   * - Menor valor: Animación más lenta y suave
   * - Default: 100
   */
  stiffness: number;

  /**
   * Amortiguación del resorte (0-100)
   * - Mayor valor: Reduce el rebote y oscilaciones, animación más controlada
   * - Menor valor: Permite más rebote y oscilaciones, animación más elástica
   * - Default: 30
   */
  damping: number;

  /**
   * Delta de reposo (0.001-1)
   * - Mayor valor: La animación se detiene antes, menos precisión pero mejor rendimiento
   * - Menor valor: La animación es más precisa pero puede durar más tiempo
   * - Default: 0.001
   */
  restDelta: number;

  /**
   * Masa del resorte (0-10)
   * - Mayor valor: La animación es más suave pero puede ser más lenta
   * - Menor valor: La animación es más rápida pero puede ser más agresiva
   * - Default: 1
   */
  mass: number;
}

@Injectable({ providedIn: 'root' })
export class ScrollProgressService implements OnDestroy {
  private scrollYProgress$ = new BehaviorSubject<number>(0);
  private smoothScrollYProgress$ = new BehaviorSubject<number>(0);
  private animationFrame: number | null = null;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private springAnimationSubscription: Subscription | null = null;

  // Configuración del spring (similar a Framer Motion)
  private defaultSpringConfig: SpringConfig = {
    stiffness: 400,
    damping: 40,
    restDelta: 0.01,
    mass: 1,
  };

  private currentValue = 0;
  private targetValue = 0;
  private velocity = 0;
  private isAnimating = false;
  // private animationId: number | null = null;

  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Obtiene la posición Y del scroll en píxeles
   */
  getScrollY(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(0),
      map(() => window.scrollY),
      distinctUntilChanged(),
      observeOn(animationFrameScheduler),
      shareReplay(1)
    );
  }

  /**
   * Obtiene las dimensiones del documento para cálculos
   */
  getScrollDimensions(): {
    height: number;
    viewportHeight: number;
    maxScroll: number;
  } {
    const html = this.document.documentElement;
    const body = this.document.body;

    const height = Math.max(html.scrollHeight, body.scrollHeight);
    const viewportHeight = window.innerHeight;
    const maxScroll = Math.max(0, height - viewportHeight);

    return { height, viewportHeight, maxScroll };
  }

  getScrollYProgress(): Observable<number> {
    if (!this.scrollYProgress$.observed) {
      this.startScrollListener();
    }
    return this.scrollYProgress$.asObservable();
  }

  /**
   * Obtiene el progreso del scroll con animación smooth spring
   */
  getSmoothScrollYProgress(config?: Partial<SpringConfig>): Observable<number> {
    const springConfig = { ...this.defaultSpringConfig, ...config };

    if (!this.scrollYProgress$.observed) {
      this.startScrollListener();
    }
    this.springAnimationSubscription?.unsubscribe();

    // Suscribirse a los cambios del scroll para actualizar el target
    this.springAnimationSubscription = this.scrollYProgress$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((progress) => {
        this.targetValue = progress;
        if (!this.isAnimating) {
          this.startSpringAnimation(springConfig);
        }
      });

    return this.smoothScrollYProgress$.asObservable();
  }

  getSmoothScrollProgress(): Observable<number> {
    return this.smoothScrollYProgress$.asObservable();
  }

  startScrollListener() {
    fromEvent(window, 'scroll')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(0),
        map(() => this.calculateScrollProgress()),
        distinctUntilChanged((prev, curr) => Math.abs(prev - curr) < 0.0001),
        observeOn(animationFrameScheduler)
      )
      .subscribe((progress) => {
        this.scrollYProgress$.next(progress);
      });

    // Recalcular en resize
    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(100),
        map(() => this.calculateScrollProgress())
      )
      .subscribe((progress) => {
        this.scrollYProgress$.next(progress);
      });
  }

  private calculateScrollProgress(): number {
    const { maxScroll } = this.getScrollDimensions();
    if (maxScroll === 0) return 0;

    const scrollY = window.scrollY;
    let progress = scrollY / maxScroll;

    // Mejorar la precisión y suavidad
    progress = Math.max(0, Math.min(1, progress));
    // Aplicar una curva suave para mejorar la sensibilidad
    // Esto hace que los cambios pequeños sean más notables
    progress = this.applySensitivityCurve(progress);

    return progress;
  }

  /**
   * Aplica una curva de sensibilidad para mejorar la respuesta
   */
  private applySensitivityCurve(value: number): number {
    // Curva que amplifica ligeramente los cambios pequeños
    // pero mantiene la continuidad
    return value * (2 - value * 0.3);
  }

  startSpringAnimation(config = this.defaultSpringConfig): void {
    this.isAnimating = true;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const rawDeltaTime = (currentTime - lastTime) / 1000;

      // Apply adaptive clamping based on expected refresh rate
      // Allow for up to 240Hz (4.17ms) but cap at reasonable maximum for stability
      const deltaTime = Math.min(Math.max(rawDeltaTime, 0.001), 0.033);
      // const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016); // Max 60fps
      lastTime = currentTime;

      const displacement = this.targetValue - this.currentValue;

      // Algoritmo spring optimizado (similar a Framer Motion)
      const c = config.damping / (2 * Math.sqrt(config.stiffness * config.mass));

      if (c < 1) {
        // Underdamped (sistema con oscilación)
        const omega = Math.sqrt(config.stiffness / config.mass);
        const dampedOmega = omega * Math.sqrt(1 - c * c);

        const springForce = displacement * config.stiffness;
        const dampingForce = this.velocity * config.damping;
        const acceleration = (springForce - dampingForce) / config.mass;

        this.velocity += acceleration * deltaTime;
        this.currentValue += this.velocity * deltaTime;
      } else {
        // Critically damped or overdamped (más suave)
        const targetVelocity = displacement * config.stiffness / config.damping;
        const velocityDelta = targetVelocity - this.velocity;
        const dampingFactor = Math.exp(-config.damping * deltaTime / config.mass);

        this.velocity += velocityDelta * (1 - dampingFactor);
        this.currentValue += this.velocity * deltaTime;
      }

      // Clamp para evitar valores fuera de rango
      this.currentValue = Math.max(0, Math.min(1, this.currentValue));
      // Scale rest criteria based on deltaTime for consistent behavior across refresh rates
      const restDeltaThreshold = config.restDelta * (deltaTime / 0.016); // Normalize to 60fps baseline
      const velocityThreshold = config.restDelta * 5 * (deltaTime / 0.016);

      // Verificar si la animación debe continuar (criterio más preciso)
      const isAtRest =
      Math.abs(displacement) < restDeltaThreshold &&
      Math.abs(this.velocity) < velocityThreshold;

      this.smoothScrollYProgress$.next(this.currentValue);

      if (!isAtRest) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        this.animationFrame = null;
        // Snap exacto al valor target para evitar drift
        this.currentValue = this.targetValue;
        this.velocity = 0;
        this.smoothScrollYProgress$.next(this.currentValue);
      }
    };

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.animationFrame = requestAnimationFrame(animate);
  }

  /**
   * Scroll programático con animación suave
   */
  scrollTo(target: number, duration: number = 800): Promise<void> {
    return new Promise((resolve) => {
      const start = window.scrollY;
      const distance = target - start;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, start + distance * easeOut);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isAnimating = false;
    this.scrollYProgress$.complete();
    this.smoothScrollYProgress$.complete();
  }
}
