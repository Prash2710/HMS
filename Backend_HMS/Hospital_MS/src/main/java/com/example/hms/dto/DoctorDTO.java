package com.example.hms.dto;

import java.time.LocalDateTime;

public class DoctorDTO {

    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private String about;
    private String licenseNumber;
    private Double consultationFee;
    private String status;
    private LocalDateTime createdAt;

    // No-args constructor
    public DoctorDTO() {
    }

    // All-args constructor
    public DoctorDTO(
            Long id,
            Long userId,
            String firstName,
            String lastName,
            String email,
            String phone,
            String specialization,
            String qualification,
            Integer experience,
            String about,
            String licenseNumber,
            Double consultationFee,
            String status,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.about = about;
        this.licenseNumber = licenseNumber;
        this.consultationFee = consultationFee;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
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

    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
