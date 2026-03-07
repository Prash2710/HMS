import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap, retry, shareReplay } from 'rxjs/operators';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  MedicalRecord,
  CreatePatientRequest,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  DoctorSearchParams,
  DoctorStats,
  DoctorSchedule,
  TimeSlot,
  DoctorAvailability,
  SpecializationStats,
  AppointmentStatus
} from '../models';

const API_URL = '/api/';

// ============================================
// PATIENT SERVICE
// ============================================

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  
  // Cache using Angular 17 signals
  private patientsCache = signal<Patient[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  public patients = this.patientsCache.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public patientCount = computed(() => this.patientsCache().length);

  createPatient(patient: CreatePatientRequest | any): Observable<Patient> {
    this.loadingSignal.set(true);
    return this.http.post<Patient>(API_URL + 'patients', patient).pipe(
      tap(newPatient => {
        this.patientsCache.update(patients => [...patients, newPatient]);
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  updatePatient(id: number, patient: CreatePatientRequest | any): Observable<Patient> {
    this.loadingSignal.set(true);
    return this.http.put<Patient>(`${API_URL}patients/${id}`, patient).pipe(
      tap(updatedPatient => {
        this.patientsCache.update(patients => 
          patients.map(p => p.id === id ? updatedPatient : p)
        );
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${API_URL}patients/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getPatientByUserId(userId: number): Observable<Patient> {
    return this.http.get<Patient>(`${API_URL}patients/user/${userId}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllPatients(): Observable<Patient[]> {
    this.loadingSignal.set(true);
    return this.http.get<Patient[]>(API_URL + 'patients').pipe(
      tap(patients => {
        this.patientsCache.set(patients);
        this.loadingSignal.set(false);
      }),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  deletePatient(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.http.delete<void>(`${API_URL}patients/${id}`).pipe(
      tap(() => {
        this.patientsCache.update(patients => patients.filter(p => p.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  searchPatients(query: string): Observable<Patient[]> {
    return this.getAllPatients().pipe(
      map(patients => patients.filter(p =>
        p.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        p.email?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  getPatientsByBloodGroup(bloodGroup: string): Observable<Patient[]> {
    return this.getAllPatients().pipe(
      map(patients => patients.filter(p => p.bloodGroup === bloodGroup))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Patient Service Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}

// ============================================
// DOCTOR SERVICE  
// ============================================

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  
  private doctorsCache = signal<Doctor[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  public doctors = this.doctorsCache.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public doctorCount = computed(() => this.doctorsCache().length);
  public availableDoctors = computed(() => 
    this.doctorsCache().filter(d => d.status === 'AVAILABLE')
  );
  public specializations = computed(() => 
    [...new Set(this.doctorsCache().map(d => d.specialization))].sort()
  );

  createDoctor(doctor: CreateDoctorRequest | any): Observable<Doctor> {
    this.loadingSignal.set(true);
    return this.http.post<Doctor>(API_URL + 'doctors', doctor).pipe(
      tap(newDoctor => {
        this.doctorsCache.update(doctors => [...doctors, newDoctor]);
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  updateDoctor(id: number, doctor: UpdateDoctorRequest | any): Observable<Doctor> {
    this.loadingSignal.set(true);
    return this.http.put<Doctor>(`${API_URL}doctors/${id}`, doctor).pipe(
      tap(updatedDoctor => {
        this.doctorsCache.update(doctors => 
          doctors.map(d => d.id === id ? updatedDoctor : d)
        );
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${API_URL}doctors/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllDoctors(): Observable<Doctor[]> {
    this.loadingSignal.set(true);
    return this.http.get<Doctor[]>(API_URL + 'doctors').pipe(
      tap(doctors => {
        this.doctorsCache.set(doctors);
        this.loadingSignal.set(false);
      }),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getDoctorsBySpecialization(specialization: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${API_URL}doctors/specialization/${specialization}`).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  deleteDoctor(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.http.delete<void>(`${API_URL}doctors/${id}`).pipe(
      tap(() => {
        this.doctorsCache.update(doctors => doctors.filter(d => d.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  searchDoctors(params: DoctorSearchParams): Observable<Doctor[]> {
    return this.getAllDoctors().pipe(
      map(doctors => this.filterDoctors(doctors, params))
    );
  }

  private filterDoctors(doctors: Doctor[], params: DoctorSearchParams): Doctor[] {
    let filtered = [...doctors];

    if (params.searchQuery) {
      const query = params.searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.firstName?.toLowerCase().includes(query) ||
        d.lastName?.toLowerCase().includes(query) ||
        d.specialization?.toLowerCase().includes(query)
      );
    }

    if (params.specialization) filtered = filtered.filter(d => d.specialization === params.specialization);
    if (params.minExperience) filtered = filtered.filter(d => (d.experience || 0) >= params.minExperience!);
    if (params.maxExperience) filtered = filtered.filter(d => (d.experience || 0) <= params.maxExperience!);
    if (params.minFee) filtered = filtered.filter(d => d.consultationFee >= params.minFee!);
    if (params.maxFee) filtered = filtered.filter(d => d.consultationFee <= params.maxFee!);
    if (params.status) filtered = filtered.filter(d => d.status === params.status);
    if (params.sortBy) filtered = this.sortDoctors(filtered, params.sortBy, params.sortOrder || 'asc');

    return filtered;
  }

  private sortDoctors(doctors: Doctor[], sortBy: string, sortOrder: 'asc' | 'desc'): Doctor[] {
    return doctors.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name': comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`); break;
        case 'specialization': comparison = a.specialization.localeCompare(b.specialization); break;
        case 'experience': comparison = (a.experience || 0) - (b.experience || 0); break;
        case 'fee': comparison = a.consultationFee - b.consultationFee; break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  getDoctorStats(doctorId: number, appointments: Appointment[]): DoctorStats {
    const doctor = this.doctorsCache().find(d => d.id === doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const doctorAppts = appointments.filter(a => a.doctorId === doctorId);
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      doctorId: doctor.id!,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.specialization,
      totalAppointments: doctorAppts.length,
      todayAppointments: doctorAppts.filter(a => new Date(a.appointmentDateTime) >= today && new Date(a.appointmentDateTime) < tomorrow).length,
      upcomingAppointments: doctorAppts.filter(a => new Date(a.appointmentDateTime) >= new Date() && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED')).length,
      completedAppointments: doctorAppts.filter(a => a.status === 'COMPLETED').length,
      availableSlotsToday: this.calculateAvailableSlots(doctorId, new Date(), appointments)
    };
  }

  generateDoctorSchedule(doctorId: number, date: Date, appointments: Appointment[], workingHours = { start: '09:00', end: '17:00', slotDuration: 30 }): DoctorSchedule {
    const doctor = this.doctorsCache().find(d => d.id === doctorId);
    if (!doctor) throw new Error('Doctor not found');

    const slots = this.generateTimeSlots(date, appointments, doctorId, workingHours);
    return {
      doctorId: doctor.id!,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      date: date.toISOString().split('T')[0],
      workingHours,
      slots,
      totalSlots: slots.length,
      availableSlots: slots.filter(s => s.available).length,
      bookedSlots: slots.filter(s => !s.available).length
    };
  }

  private generateTimeSlots(date: Date, appointments: Appointment[], doctorId: number, wh: any): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [startH, startM] = wh.start.split(':').map(Number);
    const [endH, endM] = wh.end.split(':').map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;
    
    const dayAppts = appointments.filter(a => a.doctorId === doctorId && new Date(a.appointmentDateTime).toDateString() === date.toDateString() && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED'));
    
    while (current < end) {
      const h = Math.floor(current / 60), m = current % 60;
      const time = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
      const appt = dayAppts.find(a => new Date(a.appointmentDateTime).getHours() === h && new Date(a.appointmentDateTime).getMinutes() === m);
      slots.push({ time, available: !appt, appointmentId: appt?.id, patientName: appt?.patientName });
      current += wh.slotDuration;
    }
    return slots;
  }

  private calculateAvailableSlots(doctorId: number, date: Date, appointments: Appointment[]): number {
    const total = 16; // 8 hours * 2 (30 min slots)
    const booked = appointments.filter(a => a.doctorId === doctorId && new Date(a.appointmentDateTime).toDateString() === date.toDateString() && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED')).length;
    return Math.max(0, total - booked);
  }

  refreshDoctors(): Observable<Doctor[]> { return this.getAllDoctors(); }
  clearCache(): void { this.doctorsCache.set([]); }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Doctor Service Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}

// ============================================
// APPOINTMENT SERVICE
// ============================================

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  
  private appointmentsCache = signal<Appointment[]>([]);
  private loadingSignal = signal<boolean>(false);
  
  public appointments = this.appointmentsCache.asReadonly();
  public loading = this.loadingSignal.asReadonly();
  public appointmentCount = computed(() => this.appointmentsCache().length);
  public upcomingAppointments = computed(() => 
    this.appointmentsCache().filter(a => new Date(a.appointmentDateTime) >= new Date() && (a.status === 'SCHEDULED' || a.status === 'CONFIRMED'))
  );

  createAppointment(appointment: CreateAppointmentRequest | any): Observable<Appointment> {
    this.loadingSignal.set(true);
    return this.http.post<Appointment>(API_URL + 'appointments', appointment).pipe(
      tap(newAppt => {
        this.appointmentsCache.update(appts => [...appts, newAppt]);
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  updateAppointment(id: number, appointment: UpdateAppointmentRequest | any): Observable<Appointment> {
    this.loadingSignal.set(true);
    return this.http.put<Appointment>(`${API_URL}appointments/${id}`, appointment).pipe(
      tap(updated => {
        this.appointmentsCache.update(appts => appts.map(a => a.id === id ? updated : a));
        this.loadingSignal.set(false);
      }),
      catchError(this.handleError)
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${API_URL}appointments/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getAllAppointments(): Observable<Appointment[]> {
    this.loadingSignal.set(true);
    return this.http.get<Appointment[]>(API_URL + 'appointments').pipe(
      tap(appts => { this.appointmentsCache.set(appts); this.loadingSignal.set(false); }),
      shareReplay(1),
      catchError(this.handleError)
    );
  }

  getAppointmentsByPatientId(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}appointments/patient/${patientId}`).pipe(retry(2), catchError(this.handleError));
  }

  getAppointmentsByDoctorId(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${API_URL}appointments/doctor/${doctorId}`).pipe(retry(2), catchError(this.handleError));
  }

  deleteAppointment(id: number): Observable<void> {
    this.loadingSignal.set(true);
    return this.http.delete<void>(`${API_URL}appointments/${id}`).pipe(
      tap(() => { this.appointmentsCache.update(appts => appts.filter(a => a.id !== id)); this.loadingSignal.set(false); }),
      catchError(this.handleError)
    );
  }

  getAppointmentsByStatus(status: AppointmentStatus): Observable<Appointment[]> {
    return this.getAllAppointments().pipe(map(appts => appts.filter(a => a.status === status)));
  }

  getTodayAppointments(): Observable<Appointment[]> {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getAllAppointments().pipe(map(appts => appts.filter(a => new Date(a.appointmentDateTime) >= today && new Date(a.appointmentDateTime) < tomorrow)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Appointment Service Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}

// ============================================
// MEDICAL RECORD SERVICE
// ============================================

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private http = inject(HttpClient);
  private loadingSignal = signal<boolean>(false);
  public loading = this.loadingSignal.asReadonly();

  createMedicalRecord(record: MedicalRecord | any): Observable<MedicalRecord> {
    this.loadingSignal.set(true);
    return this.http.post<MedicalRecord>(API_URL + 'medical-records', record).pipe(
      tap(() => this.loadingSignal.set(false)),
      catchError(this.handleError)
    );
  }

  getMedicalRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${API_URL}medical-records/${id}`).pipe(retry(2), catchError(this.handleError));
  }

  getMedicalRecordsByPatientId(patientId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${API_URL}medical-records/patient/${patientId}`).pipe(retry(2), catchError(this.handleError));
  }

  getMedicalRecordsByDoctorId(doctorId: number): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${API_URL}medical-records/doctor/${doctorId}`).pipe(retry(2), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Medical Record Service Error:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}