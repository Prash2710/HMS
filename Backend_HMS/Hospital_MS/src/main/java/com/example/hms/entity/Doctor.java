package com.example.hms.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "DOCTORS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "doctor_seq")
	@SequenceGenerator(
		    name = "doctor_seq",
		    sequenceName = "DOCTOR_SEQ",
		    allocationSize = 1
		)

    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    private Integer experience;

    @Column(length = 500)
    private String about;

    private String licenseNumber;

    @Column(nullable = false)
    private Double consultationFee;

    @Enumerated(EnumType.STRING)
    private Status status = Status.AVAILABLE;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments = new ArrayList<>();

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

	@PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public String getExperienceLevel() {
        int exp = experience != null ? experience : 0;

        if (exp < 2) {
            return "Junior";
        } else if (exp < 5) {
            return "Mid-level";
        } else if (exp < 10) {
            return "Senior";
        } else {
            return "Expert";
        }
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
}