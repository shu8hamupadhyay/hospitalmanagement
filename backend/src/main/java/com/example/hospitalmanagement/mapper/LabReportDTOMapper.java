package com.example.hospitalmanagement.mapper;

import com.example.hospitalmanagement.dto.LabReportDTO;
import com.example.hospitalmanagement.model.LabReport;
import org.springframework.stereotype.Component;

@Component
public class LabReportDTOMapper {

    // Entity to DTO (enriched with patient details)
    public LabReportDTO toDTO(LabReport entity) {
        if (entity == null) return null;

        LabReportDTO dto = new LabReportDTO();
        dto.setId(entity.getId());
        dto.setTestName(entity.getTestName());
        dto.setResult(entity.getResult());
        dto.setReportDate(entity.getReportDate());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getReportDate());

        // Enrich with patient details
        if (entity.getPatient() != null) {
            dto.setPatientId(entity.getPatient().getId());
            dto.setPatientName(entity.getPatient().getName());
            dto.setPatientEmail(entity.getPatient().getEmail());
            dto.setPatientAge(entity.getPatient().getAge());
            dto.setPatientPhone(entity.getPatient().getPhone());
        }

        return dto;
    }

    // DTO to Entity (basic conversion, relationships handled in Service)
    public LabReport toEntity(LabReportDTO dto) {
        if (dto == null) return null;

        LabReport entity = new LabReport();
        entity.setId(dto.getId());
        entity.setTestName(dto.getTestName());
        entity.setResult(dto.getResult());
        entity.setReportDate(dto.getReportDate());
        entity.setNotes(dto.getNotes());

        return entity;
    }
}
