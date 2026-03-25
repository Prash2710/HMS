package com.example.hms.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.hms.dto.AppointmentDTO;
import com.example.hms.dto.CreateAppointmentRequest;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Doctor;
import com.example.hms.entity.Patient;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.DoctorRepository;
import com.example.hms.repository.PatientRepository;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository, PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public AppointmentDTO createAppointment(CreateAppointmentRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + request.getDoctorId()));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + request.getPatientId()));
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(Appointment.Status.SCHEDULED);
        return mapToDTO(appointmentRepository.save(appointment));
    }

    @Override @Transactional(readOnly = true)
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public AppointmentDTO getAppointmentById(Long id) {
        return mapToDTO(appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id)));
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override @Transactional(readOnly = true)
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override @Transactional(readOnly = true)
    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentRepository.findUpcomingAppointments(
                Arrays.asList(Appointment.Status.SCHEDULED, Appointment.Status.CONFIRMED),
                LocalDateTime.now()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private AppointmentDTO mapToDTO(Appointment a) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setId(a.getId());
        dto.setDoctorId(a.getDoctor().getId());
        dto.setDoctorName(a.getDoctor().getUser().getFirstName() + " " + a.getDoctor().getUser().getLastName());
        dto.setDoctorSpecialization(a.getDoctor().getSpecialization());
        dto.setPatientId(a.getPatient().getId());
        dto.setPatientName(a.getPatient().getUser().getFirstName() + " " + a.getPatient().getUser().getLastName());
        dto.setAppointmentDateTime(a.getAppointmentDateTime());
        dto.setStatus(a.getStatus() != null ? a.getStatus().name() : null);
        dto.setReason(a.getReason());
        dto.setNotes(a.getNotes());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}