package com.example.hms.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.hms.entity.Appointment;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByStatus(Appointment.Status status);

    @Query("SELECT a FROM Appointment a " +
           "WHERE a.doctor.id = ?1 " +
           "AND a.appointmentDateTime BETWEEN ?2 AND ?3 " +
           "ORDER BY a.appointmentDateTime")
    List<Appointment> findByDoctorIdAndDateRange(Long doctorId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a " +
           "WHERE a.patient.id = ?1 " +
           "AND a.appointmentDateTime BETWEEN ?2 AND ?3 " +
           "ORDER BY a.appointmentDateTime")
    List<Appointment> findByPatientIdAndDateRange(Long patientId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a " +
           "LEFT JOIN FETCH a.patient p " +
           "LEFT JOIN FETCH a.doctor d " +
           "WHERE a.status IN ('SCHEDULED', 'CONFIRMED') " +
           "AND a.appointmentDateTime > CURRENT_TIMESTAMP " +
           "ORDER BY a.appointmentDateTime")
    List<Appointment> findUpcomingAppointments();
}