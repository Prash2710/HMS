import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast { id: number; message: string; type: 'success' | 'error'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private nextId = 0;

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }

  private show(message: string, type: 'success' | 'error'): void {
    const id = this.nextId++;
    this.toastsSubject.next([...this.toastsSubject.value, { id, message, type }]);
    setTimeout(() => this.remove(id), 3500);
  }
  remove(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}