import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service.service';
import { ToastService } from '../../services/toast.service';
import { AppointmentDTO } from '../../models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  private receptionService = inject(ReceptionService);
  private toast = inject(ToastService);

  appointments: AppointmentDTO[] = [];
  loading = true;

  showBooking = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.receptionService.getReceptionAppointments().subscribe({
      next: (res: any) => {
        this.appointments = res.data ?? [];
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load appointments');
        this.loading = false;
      }
    });
  }

  toggleBooking(): void {
    this.showBooking = !this.showBooking;
  }
}