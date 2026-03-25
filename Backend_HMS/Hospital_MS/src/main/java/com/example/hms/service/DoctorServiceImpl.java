package com.example.hms.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.hms.dto.*;
import com.example.hms.entity.*;
import com.example.hms.entity.Role.RoleName;
import com.example.hms.repository.*;

@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(DoctorRepository doctorRepository, UserRepository userRepository,
            RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<DoctorDTO> getAvailableDoctors() {
        return doctorRepository.findByStatus(Doctor.Status.AVAILABLE).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public DoctorDTO createDoctorByAdmin(AdminCreateDoctorRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already taken: " + request.getUsername());
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already in use: " + request.getEmail());
        User user = new User();
        user.setUsername(request.getUsername()); user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName()); user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.addRole(roleRepository.findByName(RoleName.DOCTOR).orElseThrow(() -> new RuntimeException("DOCTOR role not found")));
        user = userRepository.save(user);
        Doctor doctor = new Doctor();
        doctor.setUser(user); doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification()); doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        return mapToDTO(doctorRepository.save(doctor));
    }

    @Override
    public DoctorDTO registerDoctor(RegisterDoctorRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already in use: " + request.getEmail());
        User user = new User();
        user.setUsername(request.getEmail()); user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName()); user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); user.setPhone(request.getPhone());
        user.addRole(roleRepository.findByName(RoleName.DOCTOR).orElseThrow(() -> new RuntimeException("DOCTOR role not found")));
        user = userRepository.save(user);
        Doctor doctor = new Doctor();
        doctor.setUser(user); doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification()); doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        return mapToDTO(doctorRepository.save(doctor));
    }

    @Override
    public DoctorDTO createDoctor(CreateDoctorRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        Doctor doctor = new Doctor();
        doctor.setUser(user); doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification()); doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        return mapToDTO(doctorRepository.save(doctor));
    }

    @Override public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }
    
    @Transactional
    @Override
    public Page<DoctorDTO> getAllDoctors(Pageable pageable) {
        Page<Doctor> page = doctorRepository.findAll(pageable);

        return page.map(doctor -> {
            doctor.getUser().getUsername(); // force load
            return mapToDTO(doctor);
        });
    }

    @Override public DoctorDTO getDoctorById(Long id) {
        return mapToDTO(doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id)));
    }

    @Override
    public DoctorDTO updateDoctor(Long id, CreateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        doctor.setSpecialization(request.getSpecialization()); doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience()); doctor.setConsultationFee(request.getConsultationFee());
        return mapToDTO(doctorRepository.save(doctor));
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        userRepository.delete(user);
    }

    private DoctorDTO mapToDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId()); dto.setUserId(doctor.getUser().getId());
        dto.setFirstName(doctor.getUser().getFirstName()); dto.setLastName(doctor.getUser().getLastName());
        dto.setEmail(doctor.getUser().getEmail()); dto.setPhone(doctor.getUser().getPhone());
        dto.setSpecialization(doctor.getSpecialization()); dto.setQualification(doctor.getQualification());
        dto.setExperience(doctor.getExperience()); dto.setAbout(doctor.getAbout());
        dto.setLicenseNumber(doctor.getLicenseNumber()); dto.setConsultationFee(doctor.getConsultationFee());
        dto.setStatus(doctor.getStatus() != null ? doctor.getStatus().name() : null);
        dto.setCreatedAt(doctor.getCreatedAt());
        return dto;
    }
}