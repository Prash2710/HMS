package com.example.hms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.hms.dto.ApiResponse;
import com.example.hms.dto.MedicalRecordDTO;
import com.example.hms.service.MedicalRecordService;

@RestController
@RequestMapping("/records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    // ==============================
    // CREATE RECORD (DOCTOR ONLY)
    // ==============================

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<MedicalRecordDTO>> createRecord(
            @RequestBody MedicalRecordDTO dto) {

        MedicalRecordDTO record = medicalRecordService.createRecord(dto);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Medical record created successfully", record)
        );
    }

    // ==============================
    // GET ALL RECORDS (ADMIN)
    // ==============================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MedicalRecordDTO>>> getAllRecords() {

        List<MedicalRecordDTO> list = medicalRecordService.getAllRecords();

        if (list.isEmpty()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(false, "No medical records found", null)
            );
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Medical records fetched successfully", list)
        );
    }

    // ==============================
    // GET RECORD BY ID
    // ==============================

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<ApiResponse<MedicalRecordDTO>> getRecord(@PathVariable Long id) {

        MedicalRecordDTO record = medicalRecordService.getRecordById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Medical record found", record)
        );
    }

    // ==============================
    // GET RECORDS BY PATIENT
    // ==============================

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<ApiResponse<List<MedicalRecordDTO>>> getPatientRecords(
            @PathVariable Long patientId) {

        List<MedicalRecordDTO> list = medicalRecordService.getRecordsByPatient(patientId);

        if (list.isEmpty()) {
            return ResponseEntity.ok(
                    new ApiResponse<>(false, "No records found for this patient", null)
            );
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Patient records fetched successfully", list)
        );
    }

    // ==============================
    // DELETE RECORD (ADMIN ONLY)
    // ==============================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteRecord(@PathVariable Long id) {

        medicalRecordService.deleteRecord(id);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Medical record deleted successfully", null)
        );
    }
}