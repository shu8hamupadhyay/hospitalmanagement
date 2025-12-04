package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.PrescriptionDTO;
import com.example.hospitalmanagement.model.Prescription;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;

public class PrescriptionDTOMapper {

    // Convert Entity → DTO
    public static PrescriptionDTO toDTO(Prescription p) {
        if (p == null) return null;

        PrescriptionDTO dto = new PrescriptionDTO();

        dto.setId(p.getId());
        dto.setMedicine(p.getMedicine());
        dto.setDosage(p.getDosage());
        dto.setInstructions(p.getInstructions());
        dto.setDate(p.getDate() != null ? p.getDate().toString() : null);

        // Patient Info
        Patient patient = p.getPatient();
        if (patient != null) {
            dto.setPatientId(patient.getId());
            dto.setPatientName(patient.getName());
        }

        // Doctor Info
        Doctor doctor = p.getDoctor();
        if (doctor != null) {
            dto.setDoctorId(doctor.getId());
            dto.setDoctorName(doctor.getName());
            dto.setDoctorSpecialization(doctor.getSpecialization());
        }

        return dto;
    }

    // Convert DTO → Entity
    public static Prescription toEntity(PrescriptionDTO dto) {
        if (dto == null) return null;

        Prescription p = new Prescription();

        p.setId(dto.getId());
        p.setMedicine(dto.getMedicine());
        p.setDosage(dto.getDosage());
        p.setInstructions(dto.getInstructions());

        if (dto.getDate() != null && !dto.getDate().isEmpty()) {
            p.setDate(java.time.LocalDateTime.parse(dto.getDate()));
        }

        return p;
    }
}
