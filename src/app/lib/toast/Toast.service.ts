import { Injectable } from '@angular/core';
import {
  ToastModel,
  ToastPosition,
  ToastProps,
  ToastType,
} from '@app/models/toast.model';
import { SignalsStoreService } from '../store/StoreSignals.service';

@Injectable({ providedIn: 'root' })
export class ToastService extends SignalsStoreService<ToastProps> {
  constructor() {
    super({} as ToastProps);
  }

  public remove(ID: string | number): void {
    this.state.update((currentValue) => {
      currentValue.toasts = currentValue.toasts.filter(
        (val: any) => val.ID !== ID
      );
      return currentValue;
    });
  }

  private removeFirst(): void {
    this.state.update((currentValue) => {
      currentValue.toasts.shift();
      return currentValue;
    });
  }

  private show(
    title: string,
    message: string,
    seconds: number,
    type: ToastType,
    position: ToastPosition
  ): void {
    console.log('Llego al show');
    if (!seconds || seconds <= 0) seconds = 5;

    console.log('No paso los seconds');
    const toastModel: ToastModel = {
      ID: crypto.randomUUID(),
      title: title,
      message: message,
      visible: true,
      type: type,
      seconds: seconds,
    };
    console.log('Creo el model toast');
    let toasts = this.select('toasts')();
    console.log('Hago el select');
    if (!toasts) toasts = [];
    if (toasts.length >= 6) this.removeFirst();

    console.log('Push model: ', toastModel);
    toasts.push(toastModel);
    this.set('position', position);
    this.set('toasts', toasts);

    const autoClose = seconds * 1000;
    console.log('Creo el auto close');
    setTimeout(() => {
      console.log('Auto close');
      this.remove(toastModel.ID);
    }, autoClose);
  }

  public info(
    title: string,
    message: string,
    seconds: number = 100,
    position: ToastPosition = ToastPosition.TOP_RIGHT
  ): void {
    this.show(title, message, seconds, ToastType.INFO, position);
  }

  public success(
    title: string,
    message: string,
    seconds: number = 100,
    position: ToastPosition = ToastPosition.TOP_RIGHT
  ): void {
    this.show(title, message, seconds, ToastType.SUCCESS, position);
  }

  public waring(
    title: string,
    message: string,
    seconds: number = 100,
    position: ToastPosition = ToastPosition.TOP_RIGHT
  ): void {
    this.show(title, message, seconds, ToastType.WARNING, position);
  }

  public error(
    title: string,
    message: string,
    seconds: number = 100,
    position: ToastPosition = ToastPosition.TOP_RIGHT
  ): void {
    this.show(title, message, seconds, ToastType.ERROR, position);
  }
}
