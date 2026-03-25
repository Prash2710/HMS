package com.example.hms.service;

import java.util.List;
import com.example.hms.dto.CreateReceptionistRequest;
import com.example.hms.dto.ReceptionistDTO;

public interface ReceptionistService {

    ReceptionistDTO createReceptionist(CreateReceptionistRequest request);

    List<ReceptionistDTO> getAllReceptionists();

    ReceptionistDTO getReceptionistById(Long id);

    ReceptionistDTO updateReceptionist(Long id, CreateReceptionistRequest request);

    void deleteReceptionist(Long id);
}