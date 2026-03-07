import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DoctorService, AppointmentService } from '../../services/api.service';
import { Doctor, Appointment } from '../../models';

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: number;
}

interface DoctorSchedule {
  doctor: Doctor;
  date: string;
  slots: TimeSlot[];
}

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorsManagementComponent implements OnInit {
  currentUser: any;
  
  // Data
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  appointments: Appointment[] = [];
  
  // Specializations
  specializations: string[] = [];
  selectedSpecialization = 'ALL';
  
  // UI States
  loading = true;
  activeTab = 'list';
  activeView = 'grid'; // grid or table
  
  // Modals
  showAddDoctorModal = false;
  showEditDoctorModal = false;
  showScheduleModal = false;
  showDeleteConfirmModal = false;
  
  // Selected items
  selectedDoctor: Doctor | null = null;
  doctorToDelete: Doctor | null = null;
  doctorSchedule: DoctorSchedule | null = null;
  
  // Forms
  doctorForm = {
    id: null as number | null,
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: 0,
    about: '',
    licenseNumber: '',
    consultationFee: 0,
    status: 'AVAILABLE'
  };
  
  // Schedule
  selectedDate: string = '';
  workingHours = {
    start: '09:00',
    end: '17:00',
    slotDuration: 30 // minutes
  };
  
  // Search and Sort
  searchQuery = '';
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  // Statistics
  stats = {
    total: 0,
    available: 0,
    unavailable: 0,
    onLeave: 0,
    bySpecialization: {} as { [key: string]: number }
  };

  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.selectedDate = this.getTodayDate();
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAllAppointments();
  }

  loadDoctors(): void {
    this.loading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.extractSpecializations();
        this.calculateStatistics();
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctors', error);
        this.loading = false;
      }
    });
  }

  loadAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments;
      },
      error: (error) => console.error('Error loading appointments', error)
    });
  }

  extractSpecializations(): void {
    const specs = new Set(this.doctors.map(d => d.specialization));
    this.specializations = Array.from(specs).sort();
  }

  calculateStatistics(): void {
    this.stats.total = this.doctors.length;
    this.stats.available = this.doctors.filter(d => d.status === 'AVAILABLE').length;
    this.stats.unavailable = this.doctors.filter(d => d.status === 'UNAVAILABLE').length;
    this.stats.onLeave = this.doctors.filter(d => d.status === 'ON_LEAVE').length;
    
    // Count by specialization
    this.stats.bySpecialization = {};
    this.doctors.forEach(d => {
      const spec = d.specialization;
      this.stats.bySpecialization[spec] = (this.stats.bySpecialization[spec] || 0) + 1;
    });
  }

  applyFiltersAndSort(): void {
    let result = [...this.doctors];
    
    // Filter by specialization
    if (this.selectedSpecialization !== 'ALL') {
      result = result.filter(d => d.specialization === this.selectedSpecialization);
    }
    
    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(d =>
        d.firstName?.toLowerCase().includes(query) ||
        d.lastName?.toLowerCase().includes(query) ||
        d.specialization?.toLowerCase().includes(query) ||
        d.qualification?.toLowerCase().includes(query) ||
        d.email?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
          break;
        case 'specialization':
          comparison = a.specialization.localeCompare(b.specialization);
          break;
        case 'experience':
          comparison = (a.experience || 0) - (b.experience || 0);
          break;
        case 'fee':
          comparison = a.consultationFee - b.consultationFee;
          break;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
    
    this.filteredDoctors = result;
  }

  onSpecializationChange(): void {
    this.applyFiltersAndSort();
  }

  onSearchChange(): void {
    this.applyFiltersAndSort();
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setActiveView(view: 'grid' | 'table'): void {
    this.activeView = view;
  }

  // CRUD Operations
  openAddDoctorModal(): void {
    this.resetDoctorForm();
    this.showAddDoctorModal = true;
  }

  closeAddDoctorModal(): void {
    this.showAddDoctorModal = false;
    this.resetDoctorForm();
  }

  openEditDoctorModal(doctor: Doctor): void {
    this.doctorForm = {
      id: doctor.id || null,
      userId: doctor.userId,
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience || 0,
      about: doctor.about || '',
      licenseNumber: doctor.licenseNumber || '',
      consultationFee: doctor.consultationFee,
      status: doctor.status
    };
    this.showEditDoctorModal = true;
  }

  closeEditDoctorModal(): void {
    this.showEditDoctorModal = false;
    this.resetDoctorForm();
  }

  addDoctor(): void {
    const newDoctor = {
      userId: this.doctorForm.userId,
      specialization: this.doctorForm.specialization,
      qualification: this.doctorForm.qualification,
      experience: this.doctorForm.experience,
      about: this.doctorForm.about,
      licenseNumber: this.doctorForm.licenseNumber,
      consultationFee: this.doctorForm.consultationFee,
      status: this.doctorForm.status
    };

    this.doctorService.createDoctor(newDoctor).subscribe({
      next: (doctor) => {
        this.doctors.push(doctor);
        this.calculateStatistics();
        this.extractSpecializations();
        this.applyFiltersAndSort();
        this.closeAddDoctorModal();
        alert('Doctor added successfully!');
      },
      error: (error) => {
        console.error('Error adding doctor', error);
        alert('Failed to add doctor. Please check all fields.');
      }
    });
  }

  updateDoctor(): void {
    if (!this.doctorForm.id) return;

    const updatedDoctor = {
      userId: this.doctorForm.userId,
      specialization: this.doctorForm.specialization,
      qualification: this.doctorForm.qualification,
      experience: this.doctorForm.experience,
      about: this.doctorForm.about,
      licenseNumber: this.doctorForm.licenseNumber,
      consultationFee: this.doctorForm.consultationFee,
      status: this.doctorForm.status
    };

    this.doctorService.updateDoctor(this.doctorForm.id, updatedDoctor).subscribe({
      next: (doctor) => {
        const index = this.doctors.findIndex(d => d.id === this.doctorForm.id);
        if (index !== -1) {
          this.doctors[index] = doctor;
        }
        this.calculateStatistics();
        this.applyFiltersAndSort();
        this.closeEditDoctorModal();
        alert('Doctor updated successfully!');
      },
      error: (error) => {
        console.error('Error updating doctor', error);
        alert('Failed to update doctor.');
      }
    });
  }

  confirmDelete(doctor: Doctor): void {
    this.doctorToDelete = doctor;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.doctorToDelete = null;
  }

  deleteDoctor(): void {
    if (!this.doctorToDelete || !this.doctorToDelete.id) return;

    this.doctorService.deleteDoctor(this.doctorToDelete.id).subscribe({
      next: () => {
        this.doctors = this.doctors.filter(d => d.id !== this.doctorToDelete!.id);
        this.calculateStatistics();
        this.extractSpecializations();
        this.applyFiltersAndSort();
        this.closeDeleteConfirmModal();
        alert('Doctor deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting doctor', error);
        alert('Failed to delete doctor. They may have existing appointments.');
      }
    });
  }

  // Schedule Management
  viewSchedule(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.loadDoctorSchedule(doctor);
    this.showScheduleModal = true;
  }

  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedDoctor = null;
    this.doctorSchedule = null;
  }

  loadDoctorSchedule(doctor: Doctor): void {
    if (!doctor.id) return;

    const startDate = new Date(this.selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(this.selectedDate);
    endDate.setHours(23, 59, 59, 999);

    // Get appointments for this doctor on selected date
    const dayAppointments = this.appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDateTime);
      return apt.doctorId === doctor.id &&
             aptDate >= startDate &&
             aptDate <= endDate &&
             (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
    });

    // Generate time slots
    const slots = this.generateTimeSlots(dayAppointments);
    
    this.doctorSchedule = {
      doctor: doctor,
      date: this.selectedDate,
      slots: slots
    };
  }

  generateTimeSlots(appointments: Appointment[]): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [startHour, startMin] = this.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = this.workingHours.end.split(':').map(Number);
    
    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    while (currentTime < endTime) {
      const hour = Math.floor(currentTime / 60);
      const min = currentTime % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // Check if this slot has an appointment
      const appointment = appointments.find(apt => {
        const aptTime = new Date(apt.appointmentDateTime);
        const aptHour = aptTime.getHours();
        const aptMin = aptTime.getMinutes();
        return aptHour === hour && aptMin === min;
      });
      
      slots.push({
        time: timeStr,
        available: !appointment,
        appointmentId: appointment?.id
      });
      
      currentTime += this.workingHours.slotDuration;
    }
    
    return slots;
  }

  onScheduleDateChange(): void {
    if (this.selectedDoctor) {
      this.loadDoctorSchedule(this.selectedDoctor);
    }
  }

  getDoctorAppointmentCount(doctorId: number): number {
    return this.appointments.filter(apt => 
      apt.doctorId === doctorId && 
      (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED')
    ).length;
  }

  getTodayAppointmentCount(doctorId: number): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDateTime);
      return apt.doctorId === doctorId &&
             aptDate >= today &&
             aptDate < tomorrow &&
             (apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED');
    }).length;
  }

  getAvailableSlots(doctorId: number): number {
    const totalSlots = this.calculateTotalDailySlots();
    const bookedSlots = this.getTodayAppointmentCount(doctorId);
    return Math.max(0, totalSlots - bookedSlots);
  }

  calculateTotalDailySlots(): number {
    const [startHour, startMin] = this.workingHours.start.split(':').map(Number);
    const [endHour, endMin] = this.workingHours.end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return Math.floor(totalMinutes / this.workingHours.slotDuration);
  }

  getStatusClass(status: string): string {
    const statusMap: any = {
      'AVAILABLE': 'status-available',
      'UNAVAILABLE': 'status-unavailable',
      'ON_LEAVE': 'status-leave'
    };
    return statusMap[status] || '';
  }

  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'AVAILABLE': return '#48bb78';
      case 'UNAVAILABLE': return '#f56565';
      case 'ON_LEAVE': return '#ed8936';
      default: return '#a0aec0';
    }
  }

  resetDoctorForm(): void {
    this.doctorForm = {
      id: null,
      userId: 0,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialization: '',
      qualification: '',
      experience: 0,
      about: '',
      licenseNumber: '',
      consultationFee: 0,
      status: 'AVAILABLE'
    };
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatTime(time: string): string {
    const [hour, min] = time.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${min.toString().padStart(2, '0')} ${ampm}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}