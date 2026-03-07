import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DoctorService, AppointmentService } from '../../services/api.service';
import { Doctor, Appointment } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  // Signals
  doctors = signal<Doctor[]>([]);
  appointments = signal<Appointment[]>([]);
  loading = signal(true);

  // Computed values
  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isDoctor = this.authService.isDoctor;
  isPatient = this.authService.isPatient;

  availableDoctorsCount = computed(() => 
    this.doctors().filter(d => d.status === 'AVAILABLE').length
  );

  upcomingAppointmentsCount = computed(() =>
    this.appointments().filter(a => 
      a.status === 'SCHEDULED' || a.status === 'CONFIRMED'
    ).length
  );

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    // Load doctors
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors.set(data.slice(0, 6));
      },
      error: (error) => console.error('Error loading doctors', error)
    });

    // Load appointments
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments.set(data.slice(0, 5));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.loading.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateToBooking(doctorId: number): void {
    this.router.navigate(['/patient/book-appointment'], { 
      queryParams: { doctorId } 
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace('_', '-');
  }
}