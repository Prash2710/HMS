package com.example.hms.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.hms.dto.AdminCreateDoctorRequest;
import com.example.hms.dto.ApiResponse;
import com.example.hms.dto.CreateDoctorRequest;
import com.example.hms.dto.CreateReceptionistRequest;
import com.example.hms.dto.DoctorDTO;
import com.example.hms.dto.ReceptionistDTO;
import com.example.hms.service.DoctorService;
import com.example.hms.service.ReceptionistService;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DoctorService doctorService;
    private final ReceptionistService receptionistService;

    public AdminController(DoctorService doctorService, ReceptionistService receptionistService ) {
        this.doctorService = doctorService;
        this.receptionistService = receptionistService;
    }

    // ==============================
    // CREATE DOCTOR (ADMIN)
    // ==============================

    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorDTO>> createDoctor(
            @RequestBody AdminCreateDoctorRequest request) {

        DoctorDTO doctor = doctorService.createDoctorByAdmin(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor created successfully", doctor)
        );
    }

    // ==============================
    // GET ALL DOCTORS (PAGINATION)
    // ==============================

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<Page<DoctorDTO>>> getDoctors(Pageable pageable) {

        Page<DoctorDTO> doctors = doctorService.getAllDoctors(pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctors fetched successfully", doctors)
        );
    }

    // ==============================
    // GET DOCTOR BY ID
    // ==============================

    @GetMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctorById(@PathVariable Long id) {

        DoctorDTO doctor = doctorService.getDoctorById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor found", doctor)
        );
    }

    // ==============================
    // UPDATE DOCTOR
    // ==============================

    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateDoctor(
            @PathVariable Long id,
            @RequestBody CreateDoctorRequest request) {

        DoctorDTO doctor = doctorService.updateDoctor(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor updated successfully", doctor)
        );
    }

    // ==============================
    // DELETE DOCTOR
    // ==============================

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Doctor deleted successfully", null)
        );
    }
    
    
    //----------------------------------------------From here Receptionist is started-------------------------------------------------------------
    
    //Create
    @PostMapping("/receptionists")
    public ResponseEntity<ApiResponse<ReceptionistDTO>> createReceptionist(
            @RequestBody CreateReceptionistRequest request) {

        ReceptionistDTO r = receptionistService.createReceptionist(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Receptionist created successfully", r)
        );
    }
    
    //Get all
    @GetMapping("/receptionists")
    public ResponseEntity<ApiResponse<List<ReceptionistDTO>>> getReceptionists() {

        List<ReceptionistDTO> list = receptionistService.getAllReceptionists();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Receptionists fetched successfully", list)
        );
    }
    
    //Get by id
    @GetMapping("/receptionists/{id}")
    public ResponseEntity<ApiResponse<ReceptionistDTO>> getReceptionist(@PathVariable Long id) {

        ReceptionistDTO r = receptionistService.getReceptionistById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Receptionist found", r)
        );
    }
    
    //Update
    @PutMapping("/receptionists/{id}")
    public ResponseEntity<ApiResponse<ReceptionistDTO>> updateReceptionist(
            @PathVariable Long id,
            @RequestBody CreateReceptionistRequest request) {

        ReceptionistDTO r = receptionistService.updateReceptionist(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Receptionist updated successfully", r)
        );
    }
    
    //Delete
    @DeleteMapping("/receptionists/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReceptionist(@PathVariable Long id) {

        receptionistService.deleteReceptionist(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Receptionist deleted successfully", null)
        );
    }
}