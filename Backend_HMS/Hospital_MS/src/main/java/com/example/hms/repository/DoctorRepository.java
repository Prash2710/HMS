package com.example.hms.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.hms.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByStatus(Doctor.Status status);
    Optional<Doctor> findByUserId(Long userId);
}