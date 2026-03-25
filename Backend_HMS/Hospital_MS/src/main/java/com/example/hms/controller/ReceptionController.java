package com.example.hms.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.hms.dto.*;
import com.example.hms.service.*;
import java.util.List;

@RestController
@RequestMapping("/reception")
@PreAuthorize("hasAnyRole('RECEPTIONIST','ADMIN')")
public class ReceptionController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final DoctorService doctorService;

    public ReceptionController(PatientService patientService,
            AppointmentService appointmentService, DoctorService doctorService) {
        this.patientService = patientService;
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
    }

    @PostMapping("/patients")
    public ResponseEntity<ApiResponse<PatientDTO>> createPatient(@RequestBody CreatePatientRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient created successfully", patientService.createPatient(request)));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<Page<PatientDTO>>> getPatients(Pageable pageable) {
        Page<PatientDTO> patients = patientService.getAllPatients(pageable);
        if (patients.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No patients found", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Patients fetched successfully", patients));
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient found", patientService.getPatientById(id)));
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> updatePatient(@PathVariable Long id, @RequestBody CreatePatientRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient updated successfully", patientService.updatePatient(id, request)));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<ApiResponse<String>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient deleted successfully", null));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<Page<DoctorDTO>>> getDoctors(Pageable pageable) {
        Page<DoctorDTO> doctors = doctorService.getAllDoctors(pageable);
        if (doctors.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No doctors available", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctors fetched successfully", doctors));
    }

    @PostMapping("/appointments")
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(@RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment booked successfully", appointmentService.createAppointment(request)));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAppointments() {
        List<AppointmentDTO> list = appointmentService.getAllAppointments();
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No appointments found", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointments fetched successfully", list));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<ApiResponse<String>> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment cancelled successfully", null));
    }

    @GetMapping("/appointments/upcoming")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getUpcomingAppointments() {
        List<AppointmentDTO> list = appointmentService.getUpcomingAppointments();
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No upcoming appointments", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Upcoming appointments fetched", list));
    }
}