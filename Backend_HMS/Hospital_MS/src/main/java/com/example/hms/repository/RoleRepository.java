package com.example.hms.repository;

import com.example.hms.entity.*;
import com.example.hms.entity.Role.RoleName;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    //Optional<Role> findByName(Role.RoleName name);
    
    Optional<Role> findByName(RoleName name);
    
    
}

