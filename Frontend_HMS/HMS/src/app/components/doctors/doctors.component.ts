import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../services/doctor-service.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentDTO } from '../../models';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  private doctorService = inject(DoctorService);
  private auth = inject(AuthService);

  appointments: AppointmentDTO[] = [];

  totalAppointments = 0;
  todayAppointments = 0;

  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.doctorService.getMyAppointments().subscribe({
      next: (res: any) => {

        const list: AppointmentDTO[] = res.data ?? [];

        this.appointments = list;
        this.totalAppointments = list.length;

        // ✅ calculate here (NOT in HTML)
        const today = new Date().toDateString();

        this.todayAppointments = list.filter(a =>
          new Date(a.appointmentDateTime).toDateString() === today
        ).length;

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  logout(): void {
    this.auth.logout();
  }
}