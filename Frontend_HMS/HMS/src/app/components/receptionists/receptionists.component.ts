import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ReceptionistDTO } from '../../models';

@Component({
  selector: 'app-receptionists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receptionists.component.html',
  styleUrls: ['./receptionists.component.css']
})
export class ReceptionistsComponent implements OnInit {
  receptionists: ReceptionistDTO[] = [];
  filtered: ReceptionistDTO[] = [];
  loading = true;
  search = '';
  showModal = false;
  editMode = false;
  saving = false;
  selectedId: number | null = null;
  deleteId: number | null = null;
  showDeleteConfirm = false;

  form = { username:'', email:'', password:'', firstName:'', lastName:'', phone:'', shift:'MORNING' };
  shifts = ['MORNING','AFTERNOON','EVENING','NIGHT'];

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAllReceptionists().subscribe({
      next: r => { this.receptionists = r.data ?? []; this.applyFilter(); this.loading = false; },
      error: () => { this.toast.error('Failed to load receptionists'); this.loading = false; }
    });
  }

  applyFilter(): void {
    const q = this.search.toLowerCase();
    this.filtered = q ? this.receptionists.filter(r =>
      `${r.firstName} ${r.lastName} ${r.email} ${r.shift}`.toLowerCase().includes(q)
    ) : [...this.receptionists];
  }

  openAdd(): void {
    this.editMode = false; this.selectedId = null;
    this.form = { username:'', email:'', password:'', firstName:'', lastName:'', phone:'', shift:'MORNING' };
    this.showModal = true;
  }

  openEdit(r: ReceptionistDTO): void {
    this.editMode = true; this.selectedId = r.id;
    this.form = { username: r.email, email: r.email, password: '', firstName: r.firstName, lastName: r.lastName, phone: r.phone, shift: r.shift };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.firstName || !this.form.email) { this.toast.error('Please fill all required fields'); return; }
    this.saving = true;
    const obs = this.editMode && this.selectedId
      ? this.api.updateReceptionist(this.selectedId, this.form)
      : this.api.createReceptionist(this.form as any);
    obs.subscribe({
      next: () => { this.toast.success(this.editMode ? 'Updated successfully' : 'Receptionist created'); this.showModal = false; this.load(); this.saving = false; },
      error: err => { this.toast.error(err.error?.message || 'Operation failed'); this.saving = false; }
    });
  }

  confirmDelete(id: number): void { this.deleteId = id; this.showDeleteConfirm = true; }
  doDelete(): void {
    if (!this.deleteId) return;
    this.api.deleteReceptionist(this.deleteId).subscribe({
      next: () => { this.toast.success('Receptionist deleted'); this.showDeleteConfirm = false; this.load(); },
      error: err => { this.toast.error(err.error?.message || 'Delete failed'); this.showDeleteConfirm = false; }
    });
  }

  initials(r: ReceptionistDTO): string { return `${r.firstName[0]??''}${r.lastName[0]??''}`.toUpperCase(); }
  shiftClass(s: string): string { return s==='MORNING'?'badge-info':s==='AFTERNOON'?'badge-warning':s==='EVENING'?'badge-success':'badge-navy'; }
}