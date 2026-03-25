package com.example.hms.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.hms.entity.Appointment;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByStatus(Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDateTime BETWEEN :start AND :end ORDER BY a.appointmentDateTime")
    List<Appointment> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDateTime BETWEEN :start AND :end ORDER BY a.appointmentDateTime")
    List<Appointment> findByPatientIdAndDateRange(@Param("patientId") Long patientId,
            @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @EntityGraph(attributePaths = {"patient", "patient.user", "doctor", "doctor.user"})
    @Query("SELECT a FROM Appointment a WHERE a.status IN :statuses " +
           "AND a.appointmentDateTime > :now ORDER BY a.appointmentDateTime")
    List<Appointment> findUpcomingAppointments(@Param("statuses") List<Appointment.Status> statuses,
            @Param("now") LocalDateTime now);
}