package com.example.hms.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;



@Entity
@Table(name = "MEDICAL_RECORDS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "medicalrecord_seq")
    @SequenceGenerator(
    	    name = "medicalrecord_seq",
    	    sequenceName = "MEDICALRECORD_SEQ",
    	    allocationSize = 1
    	)

    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;

    @Column(nullable = false)
    private LocalDateTime visitDate;

    @Column(length = 2000)
    private String diagnosis;

    @Column(length = 2000)
    private String treatment;

    @Column(length = 2000)
    private String prescription;

    @Column(length = 1000)
    private String labTests;

    private String vitalSigns;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Doctor getDoctor() {
		return doctor;
	}

	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}

	public Appointment getAppointment() {
		return appointment;
	}

	public void setAppointment(Appointment appointment) {
		this.appointment = appointment;
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

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Java 17 helper methods
    public boolean hasLabTests() {
        return labTests != null && !labTests.trim().isEmpty();
    }
    
    public boolean hasPrescription() {
        return prescription != null && !prescription.trim().isEmpty();
    }
}