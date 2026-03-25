package com.example.hms.service;

import java.util.List;
import com.example.hms.dto.AppointmentDTO;
import com.example.hms.dto.CreateAppointmentRequest;

public interface AppointmentService {
    AppointmentDTO createAppointment(CreateAppointmentRequest request);
    List<AppointmentDTO> getAllAppointments();
    AppointmentDTO getAppointmentById(Long id);
    void cancelAppointment(Long id);
    List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentDTO> getAppointmentsByPatient(Long patientId);
    List<AppointmentDTO> getUpcomingAppointments();
}