import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PageResponse, DoctorDTO, CreateDoctorRequest, ReceptionistDTO, CreateReceptionistRequest, PatientDTO, CreatePatientRequest, AppointmentDTO, CreateAppointmentRequest, MedicalRecordDTO, CreateMedicalRecordRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE = 'http://localhost:8082/api';
  constructor(private http: HttpClient) {}

  // Admin: Doctors
  createDoctor(r: CreateDoctorRequest): Observable<ApiResponse<DoctorDTO>> { return this.http.post<ApiResponse<DoctorDTO>>(`${this.BASE}/admin/doctors`, r); }
  getAllDoctors(page=0,size=20): Observable<ApiResponse<PageResponse<DoctorDTO>>> { return this.http.get<any>(`${this.BASE}/admin/doctors`, { params: new HttpParams().set('page',page).set('size',size) }); }
  getDoctorById(id: number): Observable<ApiResponse<DoctorDTO>> { return this.http.get<ApiResponse<DoctorDTO>>(`${this.BASE}/admin/doctors/${id}`); }
  updateDoctor(id: number, r: any): Observable<ApiResponse<DoctorDTO>> { return this.http.put<ApiResponse<DoctorDTO>>(`${this.BASE}/admin/doctors/${id}`, r); }
  deleteDoctor(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.BASE}/admin/doctors/${id}`); }

  // Admin: Receptionists
  createReceptionist(r: CreateReceptionistRequest): Observable<ApiResponse<ReceptionistDTO>> { return this.http.post<ApiResponse<ReceptionistDTO>>(`${this.BASE}/admin/receptionists`, r); }
  getAllReceptionists(): Observable<ApiResponse<ReceptionistDTO[]>> { return this.http.get<ApiResponse<ReceptionistDTO[]>>(`${this.BASE}/admin/receptionists`); }
  updateReceptionist(id: number, r: any): Observable<ApiResponse<ReceptionistDTO>> { return this.http.put<ApiResponse<ReceptionistDTO>>(`${this.BASE}/admin/receptionists/${id}`, r); }
  deleteReceptionist(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.BASE}/admin/receptionists/${id}`); }

  // Reception: Patients
  createPatient(r: CreatePatientRequest): Observable<ApiResponse<PatientDTO>> { return this.http.post<ApiResponse<PatientDTO>>(`${this.BASE}/reception/patients`, r); }
  getAllPatients(page=0,size=20): Observable<ApiResponse<PageResponse<PatientDTO>>> { return this.http.get<any>(`${this.BASE}/reception/patients`, { params: new HttpParams().set('page',page).set('size',size) }); }
  getPatientById(id: number): Observable<ApiResponse<PatientDTO>> { return this.http.get<ApiResponse<PatientDTO>>(`${this.BASE}/reception/patients/${id}`); }
  updatePatient(id: number, r: any): Observable<ApiResponse<PatientDTO>> { return this.http.put<ApiResponse<PatientDTO>>(`${this.BASE}/reception/patients/${id}`, r); }
  deletePatient(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.BASE}/reception/patients/${id}`); }

  // Reception: Appointments
  bookAppointment(r: CreateAppointmentRequest): Observable<ApiResponse<AppointmentDTO>> { return this.http.post<ApiResponse<AppointmentDTO>>(`${this.BASE}/reception/appointments`, r); }
  getReceptionAppointments(): Observable<ApiResponse<AppointmentDTO[]>> { return this.http.get<ApiResponse<AppointmentDTO[]>>(`${this.BASE}/reception/appointments`); }
  getUpcomingAppointments(): Observable<ApiResponse<AppointmentDTO[]>> { return this.http.get<ApiResponse<AppointmentDTO[]>>(`${this.BASE}/reception/appointments/upcoming`); }
  cancelAppointment(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.BASE}/reception/appointments/${id}`); }
  getReceptionDoctors(page=0,size=50): Observable<ApiResponse<PageResponse<DoctorDTO>>> { return this.http.get<any>(`${this.BASE}/reception/doctors`, { params: new HttpParams().set('page',page).set('size',size) }); }

  // Appointments
  getAppointmentsByDoctor(id: number): Observable<ApiResponse<AppointmentDTO[]>> { return this.http.get<ApiResponse<AppointmentDTO[]>>(`${this.BASE}/appointments/doctor/${id}`); }
  getAppointmentsByPatient(id: number): Observable<ApiResponse<AppointmentDTO[]>> { return this.http.get<ApiResponse<AppointmentDTO[]>>(`${this.BASE}/appointments/patient/${id}`); }

  // Doctor
  getMyAppointments(): Observable<ApiResponse<AppointmentDTO[]>> { return this.http.get<ApiResponse<AppointmentDTO[]>>(`${this.BASE}/doctor/appointments`); }
  getAvailableDoctors(): Observable<ApiResponse<DoctorDTO[]>> { return this.http.get<ApiResponse<DoctorDTO[]>>(`${this.BASE}/doctor/available`); }

  // Medical Records
  createMedicalRecord(r: CreateMedicalRecordRequest): Observable<ApiResponse<MedicalRecordDTO>> { return this.http.post<ApiResponse<MedicalRecordDTO>>(`${this.BASE}/records`, r); }
  getAllRecords(): Observable<ApiResponse<MedicalRecordDTO[]>> { return this.http.get<ApiResponse<MedicalRecordDTO[]>>(`${this.BASE}/records`); }
  getRecordsByPatient(id: number): Observable<ApiResponse<MedicalRecordDTO[]>> { return this.http.get<ApiResponse<MedicalRecordDTO[]>>(`${this.BASE}/records/patient/${id}`); }
  getRecordById(id: number): Observable<ApiResponse<MedicalRecordDTO>> { return this.http.get<ApiResponse<MedicalRecordDTO>>(`${this.BASE}/records/${id}`); }
  deleteRecord(id: number): Observable<ApiResponse<string>> { return this.http.delete<ApiResponse<string>>(`${this.BASE}/records/${id}`); }
}