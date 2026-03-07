package com.example.hms.dto;

import java.time.LocalDateTime;

public class MedicalRecordDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private LocalDateTime visitDate;
    private String diagnosis;
    private String treatment;
    private String prescription;
    private String labTests;
    private String vitalSigns;
    private String notes;
    private LocalDateTime createdAt;

    // No-args constructor
    public MedicalRecordDTO() {
    }

    // All-args constructor
    public MedicalRecordDTO(
            Long id,
            Long patientId,
            String patientName,
            Long doctorId,
            String doctorName,
            Long appointmentId,
            LocalDateTime visitDate,
            String diagnosis,
            String treatment,
            String prescription,
            String labTests,
            String vitalSigns,
            String notes,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentId = appointmentId;
        this.visitDate = visitDate;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.prescription = prescription;
        this.labTests = labTests;
        this.vitalSigns = vitalSigns;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDateTime getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDateTime visitDate) {
        this.visitDate = visitDate;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public String getLabTests() {
        return labTests;
    }

    public void setLabTests(String labTests) {
        this.labTests = labTests;
    }

    public String getVitalSigns() {
        return vitalSigns;
    }

    public void setVitalSigns(String vitalSigns) {
        this.vitalSigns = vitalSigns;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
