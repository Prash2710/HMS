import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DashboardStats {
  doctors: number;
  patients: number;
  appointmentsToday: number;
  revenue: number;
}

interface Appointment {
  patientName: string;
  doctorName: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'SCHEDULED';
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // 🔹 Inject service
  private authService = inject(AuthService);

  adminName = 'Admin';

  stats: DashboardStats = {
    doctors: 0,
    patients: 0,
    appointmentsToday: 0,
    revenue: 0
  };

  recentAppointments: Appointment[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadAdminInfo();
    this.loadDashboardStats();
    this.loadRecentAppointments();
  }

  /** 🔐 Read admin info from JWT */
  private loadAdminInfo(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.adminName = payload.sub || 'Admin';
    } catch (err) {
      console.error('Invalid JWT');
      this.router.navigate(['/login']);
    }
  }

  /** 📊 Dashboard numbers (replace with API later) */
  private loadDashboardStats(): void {
    // TODO: Replace with API call
    this.stats = {
      doctors: 42,
      patients: 1280,
      appointmentsToday: 96,
      revenue: 345000
    };
  }

  /** 📅 Recent appointments table */
  private loadRecentAppointments(): void {
    // TODO: Replace with API call
    this.recentAppointments = [
      {
        patientName: 'Rahul Sharma',
        doctorName: 'Dr. Mehta',
        date: '05 Feb 2026',
        status: 'COMPLETED'
      },
      {
        patientName: 'Priya Singh',
        doctorName: 'Dr. Kapoor',
        date: '05 Feb 2026',
        status: 'PENDING'
      },
      {
        patientName: 'Amit Verma',
        doctorName: 'Dr. Joshi',
        date: '06 Feb 2026',
        status: 'SCHEDULED'
      }
    ];
  }

  /** 🚪 Logout */
  logout() {
    this.authService.logout();
  }

}
