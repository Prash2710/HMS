package com.example.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.hms.entity.Receptionist;

public interface ReceptionistRepository extends JpaRepository<Receptionist, Long> {
}