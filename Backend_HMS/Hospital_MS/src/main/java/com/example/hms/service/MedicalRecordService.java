package com.example.hms.service;

import java.util.List;

import com.example.hms.dto.MedicalRecordDTO;

public interface MedicalRecordService {

    MedicalRecordDTO createRecord(MedicalRecordDTO dto);

    List<MedicalRecordDTO> getAllRecords();

    MedicalRecordDTO getRecordById(Long id);

    List<MedicalRecordDTO> getRecordsByPatient(Long patientId);

    void deleteRecord(Long id);
}