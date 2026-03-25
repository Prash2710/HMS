export interface LoginRequest { username: string; password: string;}
export interface AuthResponse { token: string; type: string; id: number; username: string; email: string; roles: string[]; }
export interface ApiResponse<T> {success: boolean; message: string; data: T; }
export interface PageResponse<T> { content: T[]; totalElements: number; totalPages: number; size: number; number: number; }

export interface DoctorDTO { 
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  about: string;
  licenceNumber: string;
  consultationFee: number;
  status: string;
  createdAt: string;
}

export interface CreateDoctorRequest {
  username: string; 
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
}

export interface ReceptionistDTO {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shift: string;
}

export interface CreateReceptionistRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  shift: string;
}

export interface PatientDTO {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  createdAt: string;
}

export interface CreatePatientRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface AppointmentDTO {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDateTime: string;
  status: string;
  reason: string;
  notes: string;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  reason: string;
  notes?: string;
}

export interface MedicalRecordDTO {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  appointmentId: number;
  visitDate: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  labTests: string;
  vitalSigns: string;
  notes: string;
  createdAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  visitDate?: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  labTests?: string;
  vitalSigns?: string;
  notes?: string;
}