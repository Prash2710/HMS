// User and Authentication Models
export interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// Patient Model
export interface Patient {
  id?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt?: string;
}

// Doctor Model
export interface Doctor {
  id?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization: string;
  qualification: string;
  experience?: number;
  about?: string;
  licenseNumber?: string;
  consultationFee: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ON_LEAVE';
  createdAt?: string;
}

// Appointment Model
export interface Appointment {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  doctorSpecialization?: string;
  appointmentDateTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  createdAt?: string;
}

// Medical Record Model
export interface MedicalRecord {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentId?: number;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  labTests?: string;
  vitalSigns?: string;
  notes?: string;
  createdAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// ============================================
// USER & AUTHENTICATION MODELS
// ============================================

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles?: string[];
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// ============================================
// PATIENT MODEL
// ============================================

export interface Patient {
  id?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientRequest {
  userId: number;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

// ============================================
// DOCTOR MODEL
// ============================================

export interface Doctor {
  id?: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization: string;
  qualification: string;
  experience?: number;
  about?: string;
  licenseNumber?: string;
  consultationFee: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ON_LEAVE';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorRequest {
  userId: number;
  specialization: string;
  qualification: string;
  experience?: number;
  about?: string;
  licenseNumber?: string;
  consultationFee: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ON_LEAVE';
}

export interface UpdateDoctorRequest {
  specialization: string;
  qualification: string;
  experience?: number;
  about?: string;
  licenseNumber?: string;
  consultationFee: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ON_LEAVE';
}

// Doctor Specializations Enum
export enum DoctorSpecialization {
  CARDIOLOGY = 'Cardiology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  DERMATOLOGY = 'Dermatology',
  OPHTHALMOLOGY = 'Ophthalmology',
  ENT = 'ENT',
  DENTISTRY = 'Dentistry',
  GENERAL_MEDICINE = 'General Medicine',
  GYNECOLOGY = 'Gynecology',
  PSYCHIATRY = 'Psychiatry',
  UROLOGY = 'Urology',
  ONCOLOGY = 'Oncology',
  RADIOLOGY = 'Radiology',
  ANESTHESIOLOGY = 'Anesthesiology',
  PULMONOLOGY = 'Pulmonology',
  GASTROENTEROLOGY = 'Gastroenterology',
  NEPHROLOGY = 'Nephrology',
  ENDOCRINOLOGY = 'Endocrinology',
  RHEUMATOLOGY = 'Rheumatology'
}

// Doctor Status
export enum DoctorStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  ON_LEAVE = 'ON_LEAVE'
}

// ============================================
// APPOINTMENT MODEL
// ============================================

export interface Appointment {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  doctorSpecialization?: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDateTime?: string;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
}

// Appointment Status
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

// ============================================
// MEDICAL RECORD MODEL
// ============================================

export interface MedicalRecord {
  id?: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentId?: number;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  labTests?: string;
  vitalSigns?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicalRecordRequest {
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  labTests?: string;
  vitalSigns?: string;
  notes?: string;
}

export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

// ============================================
// SCHEDULE & TIME SLOT MODELS
// ============================================

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: number;
  patientName?: string;
}

export interface DoctorSchedule {
  doctorId: number;
  doctorName: string;
  date: string;
  workingHours: WorkingHours;
  slots: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
}

export interface WorkingHours {
  start: string; // e.g., "09:00"
  end: string;   // e.g., "17:00"
  slotDuration: number; // in minutes
  breakStart?: string;
  breakEnd?: string;
}

export interface DoctorAvailability {
  doctorId: number;
  date: string;
  isAvailable: boolean;
  availableSlots: number;
  reason?: string; // e.g., "On Leave", "Fully Booked"
}

// ============================================
// STATISTICS & DASHBOARD MODELS
// ============================================

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

export interface DoctorStats {
  doctorId: number;
  doctorName: string;
  specialization: string;
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  availableSlotsToday: number;
  rating?: number;
  reviewCount?: number;
}

export interface PatientStats {
  patientId: number;
  patientName: string;
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  lastVisitDate?: string;
  nextAppointmentDate?: string;
}

export interface SpecializationStats {
  specialization: string;
  doctorCount: number;
  appointmentCount: number;
  averageConsultationFee: number;
}

// ============================================
// FILTER & SEARCH MODELS
// ============================================

export interface DoctorSearchParams {
  searchQuery?: string;
  specialization?: string;
  minExperience?: number;
  maxExperience?: number;
  minFee?: number;
  maxFee?: number;
  status?: DoctorStatus;
  sortBy?: 'name' | 'specialization' | 'experience' | 'fee';
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentSearchParams {
  patientId?: number;
  doctorId?: number;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'patient' | 'doctor' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface PatientSearchParams {
  searchQuery?: string;
  bloodGroup?: string;
  gender?: string;
  city?: string;
  state?: string;
  sortBy?: 'name' | 'dateOfBirth' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// NOTIFICATION MODELS
// ============================================

export interface Notification {
  id?: number;
  userId: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export type NotificationType = 
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CONFIRMED'
  | 'APPOINTMENT_CANCELLED'
  | 'APPOINTMENT_RESCHEDULED'
  | 'NEW_MESSAGE'
  | 'PRESCRIPTION_READY'
  | 'LAB_RESULTS_READY'
  | 'SYSTEM_ALERT';

// ============================================
// PRESCRIPTION MODELS
// ============================================

export interface Prescription {
  id?: number;
  medicalRecordId: number;
  patientId: number;
  doctorId: number;
  medications: Medication[];
  instructions?: string;
  validUntil?: string;
  createdAt?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

// ============================================
// RESPONSE WRAPPER MODELS
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ============================================
// ERROR MODELS
// ============================================

export interface ApiError {
  status: number;
  error: string;
  message: string;
  timestamp: string;
  path?: string;
  details?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  rejectedValue?: any;
}

// ============================================
// UTILITY TYPES
// ============================================

export type SortOrder = 'asc' | 'desc';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// ============================================
// CONSTANTS
// ============================================

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const SPECIALIZATIONS: string[] = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Dentistry',
  'General Medicine',
  'Gynecology',
  'Psychiatry',
  'Urology',
  'Oncology',
  'Radiology',
  'Anesthesiology',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Endocrinology',
  'Rheumatology'
];

export const SPECIALIZATION_ICONS: { [key: string]: string } = {
  'Cardiology': '❤️',
  'Neurology': '🧠',
  'Orthopedics': '🦴',
  'Pediatrics': '👶',
  'Dermatology': '🧴',
  'Ophthalmology': '👁️',
  'ENT': '👂',
  'Dentistry': '🦷',
  'General Medicine': '⚕️',
  'Gynecology': '👩‍⚕️',
  'Psychiatry': '🧘',
  'Urology': '💧',
  'Oncology': '🎗️',
  'Radiology': '🔬',
  'Anesthesiology': '💉',
  'Pulmonology': '🫁',
  'Gastroenterology': '🍽️',
  'Nephrology': '🫘',
  'Endocrinology': '⚗️',
  'Rheumatology': '🦵'
};

export const APPOINTMENT_STATUS_COLORS: { [key: string]: string } = {
  'SCHEDULED': '#3b82f6',
  'CONFIRMED': '#10b981',
  'COMPLETED': '#8b5cf6',
  'CANCELLED': '#ef4444',
  'NO_SHOW': '#f59e0b'
};

export const DOCTOR_STATUS_COLORS: { [key: string]: string } = {
  'AVAILABLE': '#10b981',
  'UNAVAILABLE': '#ef4444',
  'ON_LEAVE': '#f59e0b'
};