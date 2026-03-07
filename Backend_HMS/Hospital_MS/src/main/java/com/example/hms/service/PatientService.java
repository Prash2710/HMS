package com.example.hms.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hms.dto.CreatePatientRequest;
import com.example.hms.dto.PatientDTO;
import com.example.hms.entity.Patient;
import com.example.hms.entity.User;
import com.example.hms.repository.PatientRepository;
import com.example.hms.repository.UserRepository;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientDTO createPatient(CreatePatientRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = new Patient();
        patient.setUser(user);
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Patient.Gender.valueOf(request.getGender()));
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setZipCode(request.getZipCode());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());

        Patient savedPatient = patientRepository.save(patient);
        return convertToDTO(savedPatient);
    }

    public PatientDTO updatePatient(Long id, CreatePatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Patient.Gender.valueOf(request.getGender()));
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setZipCode(request.getZipCode());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMedicalHistory(request.getMedicalHistory());
        patient.setAllergies(request.getAllergies());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDTO(updatedPatient);
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientById(Long id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return convertToDTO(patient);
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientByUserId(Long userId) {

        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return convertToDTO(patient);
    }

    @Transactional(readOnly = true)
    public List<PatientDTO> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList()); // Java 8
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    // DTO conversion using setters (not records)
    private PatientDTO convertToDTO(Patient patient) {

        PatientDTO dto = new PatientDTO();

        dto.setId(patient.getId());
        dto.setUserId(patient.getUser().getId());
        dto.setFirstName(patient.getUser().getFirstName());
        dto.setLastName(patient.getUser().getLastName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setPhone(patient.getUser().getPhone());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender().name());
        dto.setAddress(patient.getAddress());
        dto.setCity(patient.getCity());
        dto.setState(patient.getState());
        dto.setZipCode(patient.getZipCode());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setAllergies(patient.getAllergies());
        dto.setEmergencyContactName(patient.getEmergencyContactName());
        dto.setEmergencyContactPhone(patient.getEmergencyContactPhone());
        dto.setCreatedAt(patient.getCreatedAt());

        return dto;
    }
}
	