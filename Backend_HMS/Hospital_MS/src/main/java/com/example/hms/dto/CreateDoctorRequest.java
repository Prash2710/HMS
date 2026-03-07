package com.example.hms.dto;

public class CreateDoctorRequest {

    private Long userId;
    private String specialization;
    private String qualification;
    private Integer experience;
    private String about;
    private String licenseNumber;
    private Double consultationFee;
    private String status;

    // No-args constructor
    public CreateDoctorRequest() {
    }

    // All-args constructor
    public CreateDoctorRequest(
            Long userId,
            String specialization,
            String qualification,
            Integer experience,
            String about,
            String licenseNumber,
            Double consultationFee,
            String status
    ) {
        this.userId = userId;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.about = about;
        this.licenseNumber = licenseNumber;
        this.consultationFee = consultationFee;
        this.status = status;
    }

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}
