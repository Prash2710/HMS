package com.example.hms.dto;

import java.time.LocalDate;

public class CreatePatientRequest {

    private Long userId;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String bloodGroup;
    private String medicalHistory;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // No-args constructor
    public CreatePatientRequest() {
    }

    // All-args constructor
    public CreatePatientRequest(
            Long userId,
            LocalDate dateOfBirth,
            String gender,
            String address,
            String city,
            String state,
            String zipCode,
            String bloodGroup,
            String medicalHistory,
            String allergies,
            String emergencyContactName,
            String emergencyContactPhone
    ) {
        this.userId = userId;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.bloodGroup = bloodGroup;
        this.medicalHistory = medicalHistory;
        this.allergies = allergies;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactPhone = emergencyContactPhone;
    }

    // Getters and Setters

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }
    
    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }
    
    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public String getAllergies() {
        return allergies;
    }
    
    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getEmergencyContactName() {
        return emergencyContactName;
    }
    
    public void setEmergencyContactName(String emergencyContactName) {
        this.emergencyContactName = emergencyContactName;
    }

    public String getEmergencyContactPhone() {
        return emergencyContactPhone;
    }
    
    public void setEmergencyContactPhone(String emergencyContactPhone) {
        this.emergencyContactPhone = emergencyContactPhone;
    }
}
