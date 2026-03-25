package com.example.hms.entity;

import javax.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(
    name = "APPOINTMENTS",
    indexes = {
        @Index(name = "idx_appointment_doctor", columnList = "DOCTOR_ID"),
        @Index(name = "idx_appointment_patient", columnList = "PATIENT_ID"),
        @Index(name = "idx_appointment_datetime", columnList = "APPOINTMENT_DATETIME")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "appointment_seq")
    @SequenceGenerator(
            name = "appointment_seq",
            sequenceName = "APPOINTMENT_SEQ",
            allocationSize = 1
    )
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PATIENT_ID", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DOCTOR_ID", nullable = false)
    private Doctor doctor;

    @Column(name = "APPOINTMENT_DATETIME", nullable = false)
    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", nullable = false)
    private Status status = Status.SCHEDULED;

    @Column(name = "REASON", length = 1000)
    private String reason;

    @Column(name = "NOTES", length = 1000)
    private String notes;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getFormattedDateTime() {
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        return appointmentDateTime.format(formatter);
    }

    public boolean isPast() {
        return appointmentDateTime.isBefore(LocalDateTime.now());
    }

    public boolean isUpcoming() {
        return appointmentDateTime.isAfter(LocalDateTime.now()) &&
                (status == Status.SCHEDULED || status == Status.CONFIRMED);
    }

    public enum Status {
        SCHEDULED,
        CONFIRMED,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }

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

	public LocalDateTime getAppointmentDateTime() {
		return appointmentDateTime;
	}

	public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
		this.appointmentDateTime = appointmentDateTime;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
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
    
    
}