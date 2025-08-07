import { Injectable } from '@angular/core';
import { ScrollProgressService } from '@app/services/ScrollProgressService.service';
import {
  animationFrameScheduler,
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  observeOn,
} from 'rxjs';

export type EasingFunction = (t: number) => number;

export interface TransformConfig {
  inputRange: number[];
  outputRange: number[];
  easing?: EasingFunction;
  clamp?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TransformService {
  public readonly easings = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
    easeInOut: (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    bounce: (t: number) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) return n1 * t * t;
      else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
      else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
      else return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    smoothOut: (t: number) => 1 - Math.pow(1 - t, 4),
    smoothInOut: (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
  };

  /**
   * Crea múltiples transformaciones basadas en el scroll progress
   */
  createScrollTransforms(scrollProgress$: Observable<number>) {
    return {
      // Movimiento de fondo parallax
      backgroundY: this.useTransform(scrollProgress$, [0, 1], [0, -500], {
        easing: this.easings.smoothOut, amplify: 1
      }),

      // Escala del elemento líquido
      liquidScale: this.useTransform(
        scrollProgress$,
        [0, 0.5, 1],
        [1, 1.5, 2],
        { easing: this.easings.smoothInOut, amplify: 5 }
      ),

      // Opacidad del elemento líquido
      liquidOpacity: this.useTransform(
        scrollProgress$,
        [0, 0.3, 0.7, 1],
        [0.8, 0.6, 0.3, 0],
        { easing: this.easings.smoothOut, amplify: 2 }
      ),

      // Blur del elemento líquido
      liquidBlur: this.useTransform(
        scrollProgress$,
        [0, 0.5, 1],
        [40, 80, 120],
        { easing: this.easings.smoothInOut, amplify: 2 }
      ),

      // Opacidad del texto
      textOpacity: this.useTransform(
        scrollProgress$,
        [0, 0.2, 0.5],
        [0.05, 0.03, 0],
        { easing: this.easings.smoothOut, amplify: 2 }
      ),

      // Rotación de elementos geométricos
      geometryRotate: this.useTransform(scrollProgress$, [0, 1], [0, 360],
        { easing: this.easings.linear, amplify: 2 }
      ),

      // Escala de elementos geométricos
      geometryScale: this.useTransform(
        scrollProgress$,
        [0, 0.5, 1],
        [1, 0.8, 0.5],
        { easing: this.easings.smoothInOut, amplify: 2 }
      ),
    };
  }

  // Función similar a useTransform de Framer Motion
  useTransform<T extends number>(
    source$: Observable<number>,
    inputRange: number[],
    outputRange: T[],
    options?: {
      easing?: EasingFunction;
      clamp?: boolean;
      extrapolate?: 'extend' | 'clamp';
      amplify?: number; // Factor de amplificación
      sensitivity?: number; // Sensibilidad para cambios pequeños
    }
  ): Observable<T> {
    const {
      easing = this.easings.linear,
      clamp = true,
      extrapolate = 'extend',
      amplify = 1,
      sensitivity = 1,
    } = options || {};

    return source$.pipe(
      map((value) => {
        let processedValue = value;
        if (sensitivity !== 1) {
          processedValue = this.applySensitivity(value, sensitivity);
        }

        let result = this.interpolate(
          processedValue,
          inputRange,
          outputRange,
          easing,
          clamp,
          extrapolate
        ) as T;

        if (amplify !== 1) {
          const baseValue = outputRange[0];
          const delta = result - baseValue;
          result = (baseValue + delta * amplify) as T;
        }

        return result;
      }),
      distinctUntilChanged((prev, curr) => Math.abs(prev - curr) < 0.001)
    );
  }

  /**
 * Aplica una curva de sensibilidad al valor de entrada
 */
  private applySensitivity(value: number, sensitivity: number): number {
    if (sensitivity === 1) return value;

    // Curva exponencial suave para amplificar cambios pequeños
    const sign = Math.sign(value);
    const absValue = Math.abs(value);
    const processed = Math.pow(absValue, 1 / sensitivity);

    return sign * processed;
  }

  /**
   * Función de interpolación personalizada
   */
  private interpolate(
    value: number,
    inputRange: number[],
    outputRange: number[],
    easing: EasingFunction,
    clamp: boolean,
    extrapolate: 'extend' | 'clamp'
  ): number {
    const inSize = inputRange.length;
    const outSize = outputRange.length;
    if (inSize !== outSize)
      throw new Error('Input and output ranges must have the same length');
    if (inSize === 0) return 0;
    if (inSize === 1) return outputRange[0];

    // Manejar extrapolación inferior
    if (value <= inputRange[0]) {
      if (extrapolate === 'clamp' || clamp) {
        return outputRange[0];
      }
      // Extrapolación lineal hacia abajo
      if (inSize >= 2) {
        const slope = (outputRange[1] - outputRange[0]) / (inputRange[1] - inputRange[0]);
        return outputRange[0] + slope * (value - inputRange[0]);
      }
      return outputRange[0];
    }

    // Manejar extrapolación superior
    if (value >= inputRange[inSize - 1]) {
      if (extrapolate === 'clamp' || clamp) {
        return outputRange[outSize - 1];
      }
      // Extrapolación lineal hacia arriba
      if (inSize >= 2) {
        const lastIndex = inSize - 1;
        const slope = (outputRange[lastIndex] - outputRange[lastIndex - 1]) /
          (inputRange[lastIndex] - inputRange[lastIndex - 1]);
        return outputRange[lastIndex] + slope * (value - inputRange[lastIndex]);
      }
      return outputRange[outSize - 1];
    }

    // Encontrar el segmento correcto en el inputRange
    let leftIndex = 0;
    while (leftIndex < inSize - 1 && value > inputRange[leftIndex + 1]) {
      leftIndex++;
    }
    const rightIndex = Math.min(leftIndex + 1, inSize - 1);

    const inputStart = inputRange[leftIndex];
    const inputEnd = inputRange[rightIndex];
    const outputStart = outputRange[leftIndex];
    const outputEnd = outputRange[rightIndex];

    if (inputStart === inputEnd) {
      return outputStart;
    }

    // Normalizar el valor entre 0 y 1
    const normalizedValue = (value - inputStart) / (inputEnd - inputStart);
    // Aplicar easing
    const easedValue = easing(normalizedValue);
    // Interpolación lineal con el valor eased
    return outputStart + (outputEnd - outputStart) * easedValue;
  }

  /**
 * Función utilitaria para crear una transformación personalizada
 */
  createCustomTransform<T extends number>(
    source$: Observable<number>,
    transformFn: (value: number) => T
  ): Observable<T> {
    return source$.pipe(map(transformFn));
  }

  /**
   * Combina múltiples transformaciones en un objeto usando combineLatest para mejor performance
   */
  combineTransforms<T extends Record<string, Observable<any>>>(
    transforms: T
  ): Observable<{
    [K in keyof T]: T[K] extends Observable<infer U> ? U : never;
  }> {
    const keys = Object.keys(transforms) as (keyof T)[];
    const observables = keys.map((key) => transforms[key]);

    return new Observable((subscriber) => {
      const values: any = {};
      let initialized = 0;
      const subscriptions = keys.map((key, index) => {
        return observables[index].subscribe({
          next: (value) => {
            const wasInitialized = values.hasOwnProperty(key);
            values[key] = value;

            if (!wasInitialized) {
              initialized++;
            }

            // Solo emitir cuando todos los valores estén inicializados
            if (initialized === keys.length) {
              subscriber.next({ ...values });
            }
          },
          error: (error) => subscriber.error(error),
        });
      });

      return () => {
        subscriptions.forEach((sub) => sub.unsubscribe());
      };
    }).pipe(
      distinctUntilChanged((prev: any, curr: any) => {
        // Comparación optimizada para evitar renders innecesarios
        return keys.every(key => Math.abs(prev[key] - curr[key]) < 0.001);
      }),
      observeOn(animationFrameScheduler)
    );
  }

  /**
   * Crea una animación de tipo "spring" para suavizar valores
   */
  createSpringTransform(
    source$: Observable<number>,
    config: { stiffness?: number; damping?: number; mass?: number } = {}
  ): Observable<number> {
    const { stiffness = 100, damping = 10, mass = 1 } = config;

    return new Observable((subscriber) => {
      let currentValue = 0;
      let velocity = 0;
      let targetValue = 0;
      let animationId: number | null = null;

      const animate = () => {
        const force = -stiffness * (currentValue - targetValue);
        const damping_force = -damping * velocity;
        const acceleration = (force + damping_force) / mass;

        velocity += acceleration * 0.016; // 60fps
        currentValue += velocity * 0.016;

        subscriber.next(currentValue);

        if (
          Math.abs(velocity) > 0.01 ||
          Math.abs(currentValue - targetValue) > 0.01
        ) {
          animationId = requestAnimationFrame(animate);
        } else {
          animationId = null;
        }
      };

      const subscription = source$.subscribe((value) => {
        targetValue = value;
        if (!animationId) {
          animationId = requestAnimationFrame(animate);
        }
      });

      return () => {
        subscription.unsubscribe();
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      };
    });
  }
}
