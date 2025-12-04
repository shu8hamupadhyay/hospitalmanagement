package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.RoomAllotmentDTO;
import com.example.hospitalmanagement.dto.mapper.RoomAllotmentDTOMapper;
import com.example.hospitalmanagement.model.RoomAllotment;
import com.example.hospitalmanagement.service.RoomAllotmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roomallotments")
@CrossOrigin(origins = "*")
public class RoomAllotmentRestController {

    private final RoomAllotmentService roomAllotmentService;

    public RoomAllotmentRestController(RoomAllotmentService roomAllotmentService) {
        this.roomAllotmentService = roomAllotmentService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<RoomAllotmentDTO> getAllRoomAllotments() {
        return roomAllotmentService.getAllRoomAllotments()
                .stream()
                .map(RoomAllotmentDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public RoomAllotmentDTO getRoomAllotmentById(@PathVariable Long id) {
        RoomAllotment r = roomAllotmentService.getRoomAllotmentById(id);
        if (r == null) {
            throw new RuntimeException("Room Allotment not found");
        }
        return RoomAllotmentDTOMapper.toDTO(r);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public RoomAllotmentDTO createRoomAllotment(@RequestBody RoomAllotmentDTO dto) {
        RoomAllotment r = new RoomAllotment();
        r.setRoomNumber(dto.getRoomNumber());
        r.setPatientName(dto.getPatientName());
        r.setRoomType(dto.getRoomType());
        r.setDoctorInCharge(dto.getDoctorInCharge());
        r.setAdmissionDate(dto.getAdmissionDate());
        r.setDischargeDate(dto.getDischargeDate());
        r.setStatus(dto.getStatus());

        RoomAllotment saved = roomAllotmentService.saveRoomAllotment(r);
        return RoomAllotmentDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public RoomAllotmentDTO updateRoomAllotment(@PathVariable Long id, @RequestBody RoomAllotmentDTO dto) {
        RoomAllotment r = roomAllotmentService.getRoomAllotmentById(id);
        if (r == null) {
            throw new RuntimeException("Room Allotment not found");
        }

        r.setRoomNumber(dto.getRoomNumber());
        r.setPatientName(dto.getPatientName());
        r.setRoomType(dto.getRoomType());
        r.setDoctorInCharge(dto.getDoctorInCharge());
        r.setAdmissionDate(dto.getAdmissionDate());
        r.setDischargeDate(dto.getDischargeDate());
        r.setStatus(dto.getStatus());
        // Note: Add save method to RoomAllotmentService if needed
        return RoomAllotmentDTOMapper.toDTO(r);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void deleteRoomAllotment(@PathVariable Long id) {
        RoomAllotment r = roomAllotmentService.getRoomAllotmentById(id);
        if (r == null) {
            throw new RuntimeException("Room Allotment not found");
        }
        // Note: Implement deletion in service layer if needed
    }
}
