package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.BirthReportDTO;
import com.example.hospitalmanagement.model.BirthReport;

public class BirthReportDTOMapper {

    // Convert Entity → DTO
    public static BirthReportDTO toDTO(BirthReport b) {
        if (b == null) return null;

        BirthReportDTO dto = new BirthReportDTO();

        dto.setId(b.getId());
        dto.setBabyName(b.getBabyName());
        dto.setMotherName(b.getMotherName());
        dto.setFatherName(b.getFatherName());
        dto.setGender(b.getGender());
        dto.setBirthDateTime(b.getBirthDateTime() != null ? b.getBirthDateTime().toString() : null);
        dto.setDoctorName(b.getDoctorName());
        dto.setRemarks(b.getRemarks());

        return dto;
    }

    // Convert DTO → Entity
    public static BirthReport toEntity(BirthReportDTO dto) {
        if (dto == null) return null;

        BirthReport b = new BirthReport();

        b.setId(dto.getId());
        b.setBabyName(dto.getBabyName());
        b.setMotherName(dto.getMotherName());
        b.setFatherName(dto.getFatherName());
        b.setGender(dto.getGender());

        if (dto.getBirthDateTime() != null && !dto.getBirthDateTime().isEmpty()) {
            b.setBirthDateTime(java.time.LocalDateTime.parse(dto.getBirthDateTime()));
        }

        b.setDoctorName(dto.getDoctorName());
        b.setRemarks(dto.getRemarks());

        return b;
    }
}
