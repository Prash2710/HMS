import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionService } from '../../services/reception-service.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { PatientDTO } from '../../models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  private auth = inject(AuthService);
  private receptionService = inject(ReceptionService);
  private toast = inject(ToastService);

  patients: PatientDTO[] = [];
  filtered: PatientDTO[] = [];

  // 🔥 REQUIRED (your error was here)
  isAdmin: boolean = false;

  loading: boolean = true;
  search: string = '';

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdmin; // 🔥 IMPORTANT
    this.load();
  }

  load(): void {
    this.loading = true;

    this.receptionService.getPatients(0, 100).subscribe({
      next: (r) => {
        this.patients = r.data?.content ?? [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load patients');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered = q
      ? this.patients.filter(p =>
          `${p.firstName} ${p.lastName} ${p.email} ${p.phone}`.toLowerCase().includes(q)
        )
      : [...this.patients];
  }

  getInitials(p: PatientDTO): string {
    return `${p.firstName?.[0] ?? ''}${p.lastName?.[0] ?? ''}`.toUpperCase();
  }

  // 🔥 REQUIRED METHODS (your error was here)
  edit(p: PatientDTO): void {
    this.toast.success('Edit feature coming soon');
  }

  delete(p: PatientDTO): void {
    this.toast.success('Delete feature coming soon');
  }
}