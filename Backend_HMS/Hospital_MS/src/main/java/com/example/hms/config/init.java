package com.example.hms.config;

import com.example.hms.entity.Role;
import com.example.hms.entity.User;
import com.example.hms.repository.RoleRepository;
import com.example.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class init {

    @Bean
    CommandLineRunner initRolesAndAdmin(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // 🔹 Create roles if not exist
            createRoleIfNotFound(roleRepository, Role.RoleName.ROLE_ADMIN);
            createRoleIfNotFound(roleRepository, Role.RoleName.ROLE_DOCTOR);
            createRoleIfNotFound(roleRepository, Role.RoleName.ROLE_PATIENT);
            createRoleIfNotFound(roleRepository, Role.RoleName.ROLE_RECEPTIONIST);

            // 🔹 Create default admin if not exist
            if (!userRepository.existsByUsername("admin")) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@hms.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFirstName("System");
                admin.setLastName("Admin");

                Set<Role> roles = new HashSet<>();
                Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Admin role not found"));

                roles.add(adminRole);
                admin.setRoles(roles);

                userRepository.save(admin);

                System.out.println("Default ADMIN created → username: admin / password: admin123");
            }
        };
    }

    private void createRoleIfNotFound(RoleRepository roleRepository, Role.RoleName roleName) {

        roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(roleName);
                    return roleRepository.save(role);
                });
    }
}
