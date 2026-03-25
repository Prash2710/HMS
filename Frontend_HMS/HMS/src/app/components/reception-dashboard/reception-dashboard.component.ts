import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReceptionService } from '../../services/reception-service.service';
import { AuthService } from '../../services/auth.service';
import { AppointmentDTO } from '../../models';

@Component({
  selector: 'app-reception-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reception-dashboard.component.html',
  styleUrls: ['./reception-dashboard.component.css']
})
export class ReceptionDashboardComponent implements OnInit {

  private receptionService = inject(ReceptionService);
  private auth = inject(AuthService);

  patientCount = 0;
  appointmentCount = 0;

  todayAppointments = 0;
  upcomingAppointments = 0;

  loading = true;

  ngOnInit(): void {

    // Patients count
    this.receptionService.getPatients(0, 1).subscribe({
      next: (res: any) => {
        this.patientCount = res.data?.totalElements ?? 0;
      }
    });

    // 🔥 FIXED METHOD NAME
    this.receptionService.getReceptionAppointments().subscribe({
      next: (res: any) => {

        const list: AppointmentDTO[] = res.data ?? [];

        this.appointmentCount = list.length;

        // 🔥 FIXED TYPES
        this.todayAppointments = list.filter((a: AppointmentDTO) =>
          new Date(a.appointmentDateTime).toDateString() === new Date().toDateString()
        ).length;

        this.upcomingAppointments = list.filter((a: AppointmentDTO) =>
          a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
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