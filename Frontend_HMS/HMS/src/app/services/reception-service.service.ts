import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReceptionService {
  private http = inject(HttpClient);
  
  private API = '/api/reception';  //for production

  getPatients(page = 0, size = 5) {
    return this.http.get<any>(`${this.API}/patients?page=${page}&size=${size}`);
  }

  createPatient(data: any) {
    return this.http.post<any>(`${this.API}/patients`, data);
  }

  getDoctors(page = 0, size = 5) {
    return this.http.get<any>(`${this.API}/doctors?page=${page}&size=${size}`);
  }

  bookAppointment(data: any) {
    return this.http.post<any>(`${this.API}/appointments`, data);
  }

  // 🔥 ADD THIS METHOD (IMPORTANT)
  getReceptionAppointments() {
    return this.http.get<any>(`${this.API}/appointments`);
  }
}