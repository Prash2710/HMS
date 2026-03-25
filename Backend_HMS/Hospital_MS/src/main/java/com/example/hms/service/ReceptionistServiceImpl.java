package com.example.hms.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.hms.dto.*;
import com.example.hms.entity.*;
import com.example.hms.entity.Role.RoleName;
import com.example.hms.repository.*;

@Service
@Transactional
public class ReceptionistServiceImpl implements ReceptionistService {

    private final ReceptionistRepository receptionistRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ReceptionistServiceImpl(ReceptionistRepository receptionistRepository,
            UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.receptionistRepository = receptionistRepository; this.userRepository = userRepository;
        this.roleRepository = roleRepository; this.passwordEncoder = passwordEncoder;
    }

    @Override
    public ReceptionistDTO createReceptionist(CreateReceptionistRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            throw new RuntimeException("Username already taken: " + request.getUsername());
        if (userRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already in use: " + request.getEmail());
        User user = new User();
        user.setUsername(request.getUsername()); user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName()); user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.addRole(roleRepository.findByName(RoleName.RECEPTIONIST).orElseThrow(() -> new RuntimeException("RECEPTIONIST role not found")));
        user = userRepository.save(user);
        Receptionist receptionist = new Receptionist();
        receptionist.setUser(user); receptionist.setShift(request.getShift());
        return mapToDTO(receptionistRepository.save(receptionist));
    }

    @Override public List<ReceptionistDTO> getAllReceptionists() {
        return receptionistRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override public ReceptionistDTO getReceptionistById(Long id) {
        return mapToDTO(receptionistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receptionist not found with id: " + id)));
    }

    @Override
    public ReceptionistDTO updateReceptionist(Long id, CreateReceptionistRequest request) {
        Receptionist r = receptionistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receptionist not found with id: " + id));
        r.setShift(request.getShift());
        User user = r.getUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName()  != null) user.setLastName(request.getLastName());
        if (request.getPhone()     != null) user.setPhone(request.getPhone());
        if (request.getEmail()     != null) user.setEmail(request.getEmail());
        userRepository.save(user);
        return mapToDTO(receptionistRepository.save(r));
    }

    @Override
    public void deleteReceptionist(Long id) {
        Receptionist receptionist = receptionistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receptionist not found with id: " + id));
        User user = receptionist.getUser();
        receptionistRepository.delete(receptionist);
        userRepository.delete(user);
    }

    private ReceptionistDTO mapToDTO(Receptionist r) {
        ReceptionistDTO dto = new ReceptionistDTO();
        dto.setId(r.getId()); dto.setUserId(r.getUser().getId());
        dto.setFirstName(r.getUser().getFirstName()); dto.setLastName(r.getUser().getLastName());
        dto.setEmail(r.getUser().getEmail()); dto.setPhone(r.getUser().getPhone());
        dto.setShift(r.getShift());
        return dto;
    }
}