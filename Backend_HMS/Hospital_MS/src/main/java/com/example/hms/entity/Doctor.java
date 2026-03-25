package com.example.hms.entity;

import javax.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "DOCTORS",
    indexes = {
        @Index(name = "idx_doctor_specialization", columnList = "SPECIALIZATION"),
        @Index(name = "idx_doctor_status", columnList = "STATUS")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doctor_seq")
    @SequenceGenerator(
            name = "doctor_seq",
            sequenceName = "DOCTOR_SEQ",
            allocationSize = 1
    )
    private Long id;

    // 🔥 FIX 1: column name uppercase (VERY IMPORTANT)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    @Column(name = "SPECIALIZATION", nullable = false)
    private String specialization;

    @Column(name = "QUALIFICATION", nullable = false)
    private String qualification;

    @Column(name = "EXPERIENCE")
    private Integer experience;

    @Column(name = "ABOUT", length = 500)
    private String about;

    @Column(name = "LICENSE_NUMBER", unique = true)
    private String licenseNumber;

    @Column(name = "CONSULTATION_FEE", nullable = false)
    private Double consultationFee;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS")
    private Status status = Status.AVAILABLE;

    // 🔥 FIX 2: LAZY to avoid pagination crash
    @OneToMany(mappedBy = "doctor", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments = new ArrayList<>();

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

    // ✅ Utility methods

    public String getExperienceLevel() {
        int exp = experience != null ? experience : 0;

        if (exp < 2) return "Junior";
        if (exp < 5) return "Mid-level";
        if (exp < 10) return "Senior";

        return "Expert";
    }

    public boolean isAvailable() {
        return status == Status.AVAILABLE;
    }

    public enum Status {
        AVAILABLE("Available"),
        UNAVAILABLE("Unavailable"),
        ON_LEAVE("On Leave");

        private final String displayName;

        Status(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getSpecialization() {
		return specialization;
	}

	public void setSpecialization(String specialization) {
		this.specialization = specialization;
	}

	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public Integer getExperience() {
		return experience;
	}

	public void setExperience(Integer experience) {
		this.experience = experience;
	}

	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	public String getLicenseNumber() {
		return licenseNumber;
	}

	public void setLicenseNumber(String licenseNumber) {
		this.licenseNumber = licenseNumber;
	}

	public Double getConsultationFee() {
		return consultationFee;
	}

	public void setConsultationFee(Double consultationFee) {
		this.consultationFee = consultationFee;
	}

	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	public List<Appointment> getAppointments() {
		return appointments;
	}

	public void setAppointments(List<Appointment> appointments) {
		this.appointments = appointments;
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