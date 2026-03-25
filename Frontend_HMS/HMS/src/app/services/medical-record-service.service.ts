import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService {
  private http = inject(HttpClient);
  
  private API = '/api/records';  //for production

  getAll() {
    return this.http.get<any>(this.API);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(this.API, data);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.API}/${id}`);
  }
}