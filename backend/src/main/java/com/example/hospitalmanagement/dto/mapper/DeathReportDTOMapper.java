package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.DeathReportDTO;
import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;

public class DeathReportDTOMapper {

    // Convert Entity → DTO
    public static DeathReportDTO toDTO(DeathReport report) {
        if (report == null) return null;

        DeathReportDTO dto = new DeathReportDTO();

        dto.setId(report.getId());
        dto.setCauseOfDeath(report.getCauseOfDeath());
        dto.setWard(report.getWard());
        dto.setDateOfDeath(report.getDateOfDeath());
        dto.setRemarks(report.getRemarks());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setGender(report.getGender());

        // Patient Info
        Patient patient = report.getPatient();
        if (patient != null) {
            dto.setPatientId(patient.getId());
            dto.setPatientName(patient.getName());
            dto.setPatientAge(patient.getAge());
            dto.setPatientPhone(patient.getPhone());
        }

        // Doctor Info
        Doctor doctor = report.getDoctor();
        if (doctor != null) {
            dto.setDoctorId(doctor.getId());
            dto.setDoctorName(doctor.getName());
            dto.setDoctorSpecialization(doctor.getSpecialization());
        }

        return dto;
    }

    // Convert DTO → Entity
    public static DeathReport toEntity(DeathReportDTO dto) {
        if (dto == null) return null;

        DeathReport report = new DeathReport();

        report.setId(dto.getId());
        report.setCauseOfDeath(dto.getCauseOfDeath());
        report.setWard(dto.getWard());
        report.setDateOfDeath(dto.getDateOfDeath());
        report.setRemarks(dto.getRemarks());
        report.setGender(dto.getGender());

        // Note: Patient and Doctor will be assigned in Service (not here)
        // This ensures relationships are properly managed

        return report;
    }
}
