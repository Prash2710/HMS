package com.example.hms.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.hms.entity.Role;
import com.example.hms.entity.Role.RoleName;
import com.example.hms.entity.User;
import com.example.hms.repository.RoleRepository;
import com.example.hms.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                RoleRepository roleRepository,
                PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (roleRepository.count() == 0) {

            roleRepository.save(new Role(RoleName.ADMIN));
            roleRepository.save(new Role(RoleName.DOCTOR));
            roleRepository.save(new Role(RoleName.RECEPTIONIST));
            roleRepository.save(new Role(RoleName.PATIENT));
        }

        if (userRepository.count() == 0) {

            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = new User();

            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEnabled(true);

            admin.addRole(adminRole);

            userRepository.save(admin);
        }
    }
}