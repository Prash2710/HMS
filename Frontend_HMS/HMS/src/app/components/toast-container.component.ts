import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of (toastService.toasts$ | async)"
           class="toast" [class.toast-success]="t.type==='success'" [class.toast-error]="t.type==='error'">
        <span style="font-size:1.1rem;font-weight:700">{{ t.type === 'success' ? '✓' : '✕' }}</span>
        <span>{{ t.message }}</span>
        <button style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;font-size:1rem;padding:0 4px" (click)="toastService.remove(t.id)">✕</button>
      </div>
    </div>`
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}