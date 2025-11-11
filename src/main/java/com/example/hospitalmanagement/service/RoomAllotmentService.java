package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.RoomAllotment;
import com.example.hospitalmanagement.repository.RoomAllotmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoomAllotmentService {
    private final RoomAllotmentRepository repository;

    public RoomAllotmentService(RoomAllotmentRepository repository) {
        this.repository = repository;
    }

    public List<RoomAllotment> getAllRoomAllotments() {
        return repository.findAll();
    }

    public RoomAllotment getRoomAllotmentById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
