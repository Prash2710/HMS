import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  
  private API = '/api/appointments';  //for production

  getAll() {
    return this.http.get<any>(this.API);
  }

  getByDoctor(id: number) {
    return this.http.get<any>(`${this.API}/doctor/${id}`);
  }

  getByPatient(id: number) {
    return this.http.get<any>(`${this.API}/patient/${id}`);
  }
}