package com.example.hospitalmanagement.controller.api;

import com.example.hospitalmanagement.dto.PatientDTO;
import com.example.hospitalmanagement.dto.mapper.PatientDTOMapper;

import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;

import com.example.hospitalmanagement.service.PatientService;
import com.example.hospitalmanagement.service.DoctorService;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientRestController {

    private final PatientService patientService;
    private final DoctorService doctorService;  // ENTITY service

    public PatientRestController(PatientService patientService, DoctorService doctorService) {
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients()
                .stream()
                .map(PatientDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public PatientDTO getPatientById(@PathVariable Long id) {
        Patient p = patientService.getPatientById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return PatientDTOMapper.toDTO(p);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public PatientDTO createPatient(@RequestBody PatientDTO dto) {

        Patient p = new Patient();

        // BASIC FIELDS
        p.setName(dto.getName());
        p.setAge(dto.getAge());
        p.setGender(dto.getGender());
        p.setEmail(dto.getEmail());
        p.setPhone(dto.getPhone());

        p.setDob(dto.getDob() != null ? LocalDate.parse(dto.getDob()) : null);

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

        // DOCTOR (DTO → ENTITY)
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor == null)
                throw new RuntimeException("Invalid doctor ID: " + dto.getDoctorId());
            p.setDoctor(doctor);
        }

        Patient saved = patientService.savePatient(p);
        return PatientDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public PatientDTO updatePatient(@PathVariable Long id, @RequestBody PatientDTO dto) {

        Patient existing = patientService.getPatientById(id)
                .orElseThrow(() -> new RuntimeException("Invalid patient ID"));

        // BASIC FIELDS
        existing.setName(dto.getName());
        existing.setAge(dto.getAge());
        existing.setGender(dto.getGender());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());

        existing.setDob(dto.getDob() != null ? LocalDate.parse(dto.getDob()) : null);

        existing.setAddress(dto.getAddress());
        existing.setCity(dto.getCity());
        existing.setState(dto.getState());
        existing.setCountry(dto.getCountry());

        existing.setBloodGroup(dto.getBloodGroup());
        existing.setMaritalStatus(dto.getMaritalStatus());

        existing.setMedicalHistory(dto.getMedicalHistory());
        existing.setAllergies(dto.getAllergies());
        existing.setCurrentMedications(dto.getCurrentMedications());

        existing.setEmergencyContactName(dto.getEmergencyContactName());
        existing.setEmergencyContactNumber(dto.getEmergencyContactNumber());
        existing.setRelationshipToPatient(dto.getRelationshipToPatient());

        existing.setInsuranceProvider(dto.getInsuranceProvider());
        existing.setInsurancePolicyNumber(dto.getInsurancePolicyNumber());

        // DOCTOR — DTO → ENTITY
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor == null)
                throw new RuntimeException("Invalid doctor ID: " + dto.getDoctorId());
            existing.setDoctor(doctor);
        } else {
            existing.setDoctor(null);
        }

        Patient updated = patientService.savePatient(existing);
        return PatientDTOMapper.toDTO(updated);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
    }
}
