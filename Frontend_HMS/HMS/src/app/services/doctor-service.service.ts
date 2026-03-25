import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private http = inject(HttpClient);
  
  private API = '/api';  //for production

  getAll(page = 0, size = 5) {
    return this.http.get<any>(`${this.API}/admin/doctors?page=${page}&size=${size}`);
  }

  getAvailable() {
    return this.http.get<any>(`${this.API}/doctor/available`);
  }

  getMyAppointments() {
    return this.http.get<any>(`${this.API}/doctor/appointments`);
  }
}