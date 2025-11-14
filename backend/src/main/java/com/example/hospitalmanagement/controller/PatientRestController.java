package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.PatientService;
import com.example.hospitalmanagement.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*") // allow Next.js
public class PatientRestController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    public PatientRestController(PatientService patientService, DoctorService doctorService) {
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    // ==========================================================
    // 🩺 Get ALL patients (React requires array)
    // ==========================================================
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // ==========================================================
    // 🔍 Get patient BY ID
    // ==========================================================
    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found with id " + id));
    }

    // ==========================================================
    // ➕ Create new patient
    // ==========================================================
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {

        // Assign doctor if provided
        if (patient.getDoctor() != null && patient.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(patient.getDoctor().getId());
            patient.setDoctor(doctor);
        } else {
            patient.setDoctor(null);
        }

        return patientService.savePatient(patient);
    }

    // ==========================================================
    // ✏️ Update patient
    // ==========================================================
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient updated) {

        Patient existing = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + id));

        // Basic info
        existing.setName(updated.getName());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setDob(updated.getDob());

        // Address info
        existing.setAddress(updated.getAddress());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setCountry(updated.getCountry());

        // Medical info
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setMaritalStatus(updated.getMaritalStatus());
        existing.setMedicalHistory(updated.getMedicalHistory());
        existing.setAllergies(updated.getAllergies());
        existing.setCurrentMedications(updated.getCurrentMedications());

        // Emergency contact
        existing.setEmergencyContactName(updated.getEmergencyContactName());
        existing.setEmergencyContactNumber(updated.getEmergencyContactNumber());
        existing.setRelationshipToPatient(updated.getRelationshipToPatient());

        // Insurance
        existing.setInsuranceProvider(updated.getInsuranceProvider());
        existing.setInsurancePolicyNumber(updated.getInsurancePolicyNumber());

        // Doctor update
        if (updated.getDoctor() != null && updated.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(updated.getDoctor().getId());
            existing.setDoctor(doctor);
        } else {
            existing.setDoctor(null);
        }

        return patientService.savePatient(existing);
    }

    // ==========================================================
    // ❌ Delete patient
    // ==========================================================
    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
    }
}
