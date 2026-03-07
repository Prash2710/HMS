package com.example.hms.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hms.dto.JwtResponse;
import com.example.hms.dto.LoginRequest;
import com.example.hms.dto.SignUpRequest;
import com.example.hms.entity.Role;
import com.example.hms.entity.User;
import com.example.hms.repository.RoleRepository;
import com.example.hms.repository.UserRepository;
import com.example.hms.security.JWTUtil;
import com.example.hms.security.UserDetailsImpl;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JWTUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String token = jwtUtil.generateToken(userDetails);

        // Fixed: .toList() is Java 16+ — use Collectors.toList() for Java 8
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        JwtResponse response = new JwtResponse(
                token,
                "Bearer",
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // Fixed: replaced var with explicit types (var is Java 10+ only)
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setPhone(signUpRequest.getPhone());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role patientRole = roleRepository.findByName(Role.RoleName.ROLE_PATIENT)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(patientRole);
        } else {
            // Fixed: replaced switch arrow syntax with traditional if-else (Java 8 compatible)
            strRoles.forEach(role -> {
                String roleLower = role.toLowerCase();
                Role.RoleName roleName;
                if (roleLower.equals("admin")) {
                    roleName = Role.RoleName.ROLE_ADMIN;
                } else if (roleLower.equals("doctor")) {
                    roleName = Role.RoleName.ROLE_DOCTOR;
                } else if (roleLower.equals("receptionist")) {
                    roleName = Role.RoleName.ROLE_RECEPTIONIST;
                } else {
                    roleName = Role.RoleName.ROLE_PATIENT;
                }
                roleRepository.findByName(roleName).ifPresent(roles::add);
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}