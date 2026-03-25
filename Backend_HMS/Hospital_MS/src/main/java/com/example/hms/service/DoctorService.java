package com.example.hms.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.hms.dto.AdminCreateDoctorRequest;
import com.example.hms.dto.CreateDoctorRequest;
import com.example.hms.dto.DoctorDTO;
import com.example.hms.dto.RegisterDoctorRequest;

public interface DoctorService {

    DoctorDTO createDoctorByAdmin(AdminCreateDoctorRequest request);

    DoctorDTO registerDoctor(RegisterDoctorRequest request);

    DoctorDTO createDoctor(CreateDoctorRequest request);   // ← ADD THIS

    List<DoctorDTO> getAvailableDoctors();

    List<DoctorDTO> getAllDoctors();

    Page<DoctorDTO> getAllDoctors(Pageable pageable);

    DoctorDTO getDoctorById(Long id);

    DoctorDTO updateDoctor(Long id, CreateDoctorRequest request);

    void deleteDoctor(Long id);
}