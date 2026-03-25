package com.example.hms.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.hms.dto.*;
import com.example.hms.entity.Doctor;
import com.example.hms.repository.DoctorRepository;
import com.example.hms.security.UserDetailsImpl;
import com.example.hms.service.*;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    private final AppointmentService appointmentService;
    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;

    public DoctorController(AppointmentService appointmentService,
                            DoctorService doctorService, DoctorRepository doctorRepository) {
        this.appointmentService = appointmentService;
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getMyAppointments(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        Doctor doctor = doctorRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for logged-in user"));
        List<AppointmentDTO> list = appointmentService.getAppointmentsByDoctor(doctor.getId());
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No appointments found", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Doctor appointments fetched successfully", list));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST','DOCTOR')")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAvailableDoctors() {
        List<DoctorDTO> list = doctorService.getAvailableDoctors();
        if (list.isEmpty()) return ResponseEntity.ok(new ApiResponse<>(false, "No available doctors", null));
        return ResponseEntity.ok(new ApiResponse<>(true, "Available doctors fetched", list));
    }
}