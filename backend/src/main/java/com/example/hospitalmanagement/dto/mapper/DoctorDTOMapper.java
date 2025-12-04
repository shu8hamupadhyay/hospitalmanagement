package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.DoctorDTO;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Department;
import org.springframework.stereotype.Component;

@Component
public class DoctorDTOMapper {

    public DoctorDTO toDTO(Doctor doc) {
        if (doc == null) return null;

        DoctorDTO dto = new DoctorDTO();
        dto.setId(doc.getId());
        dto.setName(doc.getName());
        dto.setEmail(doc.getEmail());
        dto.setPhone(doc.getPhone());
        dto.setQualification(doc.getQualification());
        dto.setSpecialization(doc.getSpecialization());

        if (doc.getDepartment() != null) {
            dto.setDepartmentId(doc.getDepartment().getId());
            dto.setDepartmentName(doc.getDepartment().getName());
        }

        return dto;
    }

    public Doctor toEntity(DoctorDTO dto, Department department) {
        Doctor doc = new Doctor();
        doc.setId(dto.getId());
        doc.setName(dto.getName());
        doc.setEmail(dto.getEmail());
        doc.setPhone(dto.getPhone());
        doc.setQualification(dto.getQualification());
        doc.setSpecialization(dto.getSpecialization());
        doc.setDepartment(department);
        return doc;
    }
}
