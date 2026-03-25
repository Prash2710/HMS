package com.example.hms.dto;

import java.time.LocalDateTime;

public class CreateAppointmentRequest {
	private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDateTime;
    private String status;
    private String reason;
    private String notes;
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}
	public LocalDateTime getAppointmentDateTime() {
		return appointmentDateTime;
	}
	public void setAppointmentDateTime(LocalDateTime appointmentDateTime) {
		this.appointmentDateTime = appointmentDateTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
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
    
}
