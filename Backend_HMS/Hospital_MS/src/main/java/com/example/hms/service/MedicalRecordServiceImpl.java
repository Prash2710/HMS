package com.example.hms.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.hms.dto.MedicalRecordDTO;
import com.example.hms.entity.*;
import com.example.hms.repository.*;

@Service
@Transactional
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public MedicalRecordServiceImpl(MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public MedicalRecordDTO createRecord(MedicalRecordDTO dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + dto.getPatientId()));
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + dto.getDoctorId()));
        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient); record.setDoctor(doctor);
        record.setDiagnosis(dto.getDiagnosis()); record.setTreatment(dto.getTreatment());
        record.setPrescription(dto.getPrescription()); record.setLabTests(dto.getLabTests());
        record.setVitalSigns(dto.getVitalSigns()); record.setNotes(dto.getNotes());
        record.setVisitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDateTime.now());
        return mapToDTO(medicalRecordRepository.save(record));
    }

    @Override public List<MedicalRecordDTO> getAllRecords() {
        return medicalRecordRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public MedicalRecordDTO getRecordById(Long id) {
        return mapToDTO(medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id)));
    }

    @Override public List<MedicalRecordDTO> getRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public void deleteRecord(Long id) {
        if (!medicalRecordRepository.existsById(id))
            throw new RuntimeException("Medical record not found with id: " + id);
        medicalRecordRepository.deleteById(id);
    }

    private MedicalRecordDTO mapToDTO(MedicalRecord record) {
        MedicalRecordDTO dto = new MedicalRecordDTO();
        dto.setId(record.getId());
        dto.setPatientId(record.getPatient().getId());
        dto.setPatientName(record.getPatient().getUser().getFirstName() + " " + record.getPatient().getUser().getLastName());
        dto.setDoctorId(record.getDoctor().getId());
        dto.setDoctorName(record.getDoctor().getUser().getFirstName() + " " + record.getDoctor().getUser().getLastName());
        dto.setAppointmentId(record.getAppointment() != null ? record.getAppointment().getId() : null);
        dto.setDiagnosis(record.getDiagnosis()); dto.setTreatment(record.getTreatment());
        dto.setPrescription(record.getPrescription()); dto.setLabTests(record.getLabTests());
        dto.setVitalSigns(record.getVitalSigns()); dto.setNotes(record.getNotes());
        dto.setVisitDate(record.getVisitDate()); dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}