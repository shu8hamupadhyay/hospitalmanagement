package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.RoomAllotmentDTO;
import com.example.hospitalmanagement.model.RoomAllotment;

public class RoomAllotmentDTOMapper {

    // Convert Entity → DTO
    public static RoomAllotmentDTO toDTO(RoomAllotment r) {
        if (r == null) return null;

        RoomAllotmentDTO dto = new RoomAllotmentDTO();

        dto.setId(r.getId());
        dto.setRoomNumber(r.getRoomNumber());
        dto.setPatientName(r.getPatientName());
        dto.setRoomType(r.getRoomType());
        dto.setDoctorInCharge(r.getDoctorInCharge());
        dto.setAdmissionDate(r.getAdmissionDate());
        dto.setDischargeDate(r.getDischargeDate());
        dto.setStatus(r.getStatus());

        return dto;
    }

    // Convert DTO → Entity
    public static RoomAllotment toEntity(RoomAllotmentDTO dto) {
        if (dto == null) return null;

        RoomAllotment r = new RoomAllotment();

        r.setId(dto.getId());
        r.setRoomNumber(dto.getRoomNumber());
        r.setPatientName(dto.getPatientName());
        r.setRoomType(dto.getRoomType());
        r.setDoctorInCharge(dto.getDoctorInCharge());
        r.setAdmissionDate(dto.getAdmissionDate());
        r.setDischargeDate(dto.getDischargeDate());
        r.setStatus(dto.getStatus());

        return r;
    }
}
