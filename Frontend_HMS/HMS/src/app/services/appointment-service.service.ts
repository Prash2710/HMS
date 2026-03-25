import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private http = inject(HttpClient);
  private API = 'http://localhost:8082/appointments';

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