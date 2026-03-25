import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../../services/doctor-service.service';
import { ReceptionService } from '../../services/reception-service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private auth = inject(AuthService);
  private doctorService = inject(DoctorService);
  private receptionService = inject(ReceptionService);

  doctorCount = 0;
  patientCount = 0;
  receptionistCount = 0;

  todayEarnings = 0;
  monthEarnings = 0;

  loading = true;

  ngOnInit(): void {

    // Doctors count
    this.doctorService.getAll(0, 1).subscribe({
      next: res => this.doctorCount = res.data?.totalElements ?? 0
    });

    // Patients count
    this.receptionService.getPatients(0, 1).subscribe({
      next: res => this.patientCount = res.data?.totalElements ?? 0
    });

    // Dummy receptionist count (until API available)
    this.receptionistCount = 5;

    // Dummy earnings (replace later with API)
    this.todayEarnings = 12500;
    this.monthEarnings = 320000;

    this.loading = false;
  }

  logout(): void {
  this.auth.logout();
}
}