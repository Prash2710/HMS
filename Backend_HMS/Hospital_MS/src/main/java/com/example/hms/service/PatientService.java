package com.example.hms.service;

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
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository,
                          RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository; this.userRepository = userRepository;
        this.roleRepository = roleRepository; this.passwordEncoder = passwordEncoder;
    }

    public PatientDTO createPatient(CreatePatientRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already taken: " + request.getUsername());
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already in use: " + request.getEmail());
        User user = new User();
        user.setUsername(request.getUsername()); user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName()); user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.addRole(roleRepository.findByName(RoleName.PATIENT).orElseThrow(() -> new RuntimeException("PATIENT role not found")));
        user = userRepository.save(user);
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));
        patient.setAddress(request.getAddress()); patient.setCity(request.getCity());
        patient.setState(request.getState()); patient.setZipCode(request.getZipCode());
        patient.setBloodGroup(request.getBloodGroup()); patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        return convertToDTO(patientRepository.save(patient));
    }

    public PatientDTO updatePatient(Long id, CreatePatientRequest request) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));
        patient.setAddress(request.getAddress()); patient.setCity(request.getCity());
        patient.setState(request.getState()); patient.setZipCode(request.getZipCode());
        patient.setBloodGroup(request.getBloodGroup()); patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        return convertToDTO(patientRepository.save(patient));
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientById(Long id) {
        return convertToDTO(patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found")));
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientByUserId(Long userId) {
        return convertToDTO(patientRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("Patient not found")));
    }

    @Transactional(readOnly = true)
    public Page<PatientDTO> getAllPatients(Pageable pageable) {
        return patientRepository.findAll(pageable).map(this::convertToDTO);
    }

    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
        User user = patient.getUser();
        patientRepository.delete(patient);
        userRepository.delete(user);
    }

    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId()); dto.setUserId(patient.getUser().getId());
        dto.setFirstName(patient.getUser().getFirstName()); dto.setLastName(patient.getUser().getLastName());
        dto.setEmail(patient.getUser().getEmail()); dto.setPhone(patient.getUser().getPhone());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender() != null ? patient.getGender().name() : null);
        dto.setAddress(patient.getAddress()); dto.setCity(patient.getCity());
        dto.setState(patient.getState()); dto.setZipCode(patient.getZipCode());
        dto.setBloodGroup(patient.getBloodGroup()); dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setAllergies(patient.getAllergies());
        dto.setEmergencyContactName(patient.getEmergencyContactName());
        dto.setEmergencyContactPhone(patient.getEmergencyContactPhone());
        dto.setCreatedAt(patient.getCreatedAt());
        return dto;
    }
}