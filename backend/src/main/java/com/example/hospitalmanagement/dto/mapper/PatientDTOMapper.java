package com.example.hospitalmanagement.dto.mapper;

import com.example.hospitalmanagement.dto.PatientDTO;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;

public class PatientDTOMapper {

    // Convert Entity → DTO
    public static PatientDTO toDTO(Patient p) {
        if (p == null) return null;

        PatientDTO dto = new PatientDTO();

        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setEmail(p.getEmail());
        dto.setPhone(p.getPhone());
        dto.setDob(p.getDob() != null ? p.getDob().toString() : null);
        dto.setAddress(p.getAddress());
        dto.setCity(p.getCity());
        dto.setState(p.getState());
        dto.setCountry(p.getCountry());
        dto.setBloodGroup(p.getBloodGroup());
        dto.setMaritalStatus(p.getMaritalStatus());
        dto.setMedicalHistory(p.getMedicalHistory());
        dto.setAllergies(p.getAllergies());
        dto.setCurrentMedications(p.getCurrentMedications());
        dto.setEmergencyContactName(p.getEmergencyContactName());
        dto.setEmergencyContactNumber(p.getEmergencyContactNumber());
        dto.setRelationshipToPatient(p.getRelationshipToPatient());
        dto.setInsuranceProvider(p.getInsuranceProvider());
        dto.setInsurancePolicyNumber(p.getInsurancePolicyNumber());

        // Doctor Info
        Doctor d = p.getDoctor();
        if (d != null) {
            dto.setDoctorId(d.getId());
            dto.setDoctorName(d.getName());
            dto.setDoctorSpecialization(d.getSpecialization());
        }

        return dto;
    }

    // Convert DTO → Entity
    public static Patient toEntity(PatientDTO dto) {
        if (dto == null) return null;

        Patient p = new Patient();

        p.setId(dto.getId());
        p.setName(dto.getName());
        p.setAge(dto.getAge());
        p.setGender(dto.getGender());
        p.setEmail(dto.getEmail());
        p.setPhone(dto.getPhone());

        if (dto.getDob() != null && !dto.getDob().isEmpty()) {
            p.setDob(java.time.LocalDate.parse(dto.getDob()));
        }

        p.setAddress(dto.getAddress());
        p.setCity(dto.getCity());
        p.setState(dto.getState());
        p.setCountry(dto.getCountry());
        p.setBloodGroup(dto.getBloodGroup());
        p.setMaritalStatus(dto.getMaritalStatus());
        p.setMedicalHistory(dto.getMedicalHistory());
        p.setAllergies(dto.getAllergies());
        p.setCurrentMedications(dto.getCurrentMedications());
        p.setEmergencyContactName(dto.getEmergencyContactName());
        p.setEmergencyContactNumber(dto.getEmergencyContactNumber());
        p.setRelationshipToPatient(dto.getRelationshipToPatient());
        p.setInsuranceProvider(dto.getInsuranceProvider());
        p.setInsurancePolicyNumber(dto.getInsurancePolicyNumber());

        // Doctor will be assigned in Service (not here)
        return p;
    }
}
