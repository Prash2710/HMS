package com.example.hms.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.hms.dto.*;
import com.example.hms.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments() {
        List<AppointmentDTO> list = appointmentService.getAllAppointments();
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No appointments found", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointments fetched successfully", list));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> getAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Appointment found", appointmentService.getAppointmentById(id)));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getDoctorAppointments(@PathVariable Long doctorId) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByDoctor(doctorId);
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No appointments found for this doctor", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor appointments fetched", list));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getPatientAppointments(@PathVariable Long patientId) {
        List<AppointmentDTO> list = appointmentService.getAppointmentsByPatient(patientId);
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No appointments found for this patient", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Patient appointments fetched", list));
    }
}