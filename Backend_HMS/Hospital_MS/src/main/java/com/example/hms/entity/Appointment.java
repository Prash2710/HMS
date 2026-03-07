package com.example.hms.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "APPOINTMENTS")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDateTime appointmentDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SCHEDULED;

    @Column(length = 1000)
    private String reason;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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

    // Utility methods (safe)
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
}
