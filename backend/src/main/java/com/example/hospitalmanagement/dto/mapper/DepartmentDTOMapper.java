package com.example.hospitalmanagement.mapper;

import com.example.hospitalmanagement.dto.DepartmentDTO;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import org.springframework.stereotype.Component;

@Component
public class DepartmentDTOMapper {

    // ============================
    //   ENTITY → DTO
    // ============================
    public DepartmentDTO toDTO(Department d) {

        if (d == null) return null;

        DepartmentDTO dto = new DepartmentDTO();

        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setStaffCount(d.getStaffCount());
        dto.setServicesOffered(d.getServicesOffered());
        dto.setStatus(d.getStatus());

        // HEAD DOCTOR MAPPING
        if (d.getHeadDoctor() != null) {
            dto.setHeadDoctorId(d.getHeadDoctor().getId());
            dto.setHeadDoctorName(d.getHeadDoctor().getName());
        }

        return dto;
    }

    // ============================
    //   DTO → ENTITY
    // ============================
    public Department toEntity(DepartmentDTO dto, Doctor headDoctor) {

        if (dto == null) return null;

        Department d = new Department();

        d.setId(dto.getId());
        d.setName(dto.getName());
        d.setStaffCount(dto.getStaffCount());
        d.setServicesOffered(dto.getServicesOffered());
        d.setStatus(dto.getStatus());

        // HEAD DOCTOR MAPPING
        d.setHeadDoctor(headDoctor);   // This auto-sets headName internally

        return d;
    }
}
