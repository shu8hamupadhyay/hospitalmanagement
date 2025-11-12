package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // ==========================================================
    // 🩺 Fetch all patients
    // ==========================================================
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // ==========================================================
    // 🔍 Find patient by ID (returns Optional)
    // ==========================================================
    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    // ==========================================================
    // 💾 Save or update patient
    // ==========================================================
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // ==========================================================
    // ❌ Delete patient safely
    // ==========================================================
    public void deletePatient(Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
        } else {
            System.err.println("⚠️ Warning: Attempted to delete non-existent patient with ID: " + id);
        }
    }

    // ==========================================================
    // ✅ Check if patient exists
    // ==========================================================
    public boolean existsById(Long id) {
        return patientRepository.existsById(id);
    }

    // ==========================================================
    // 🔍 Find patients by Doctor (for doctor dashboards)
    // ==========================================================
    public List<Patient> getPatientsByDoctor(Long doctorId) {
        // Make sure this method exists in PatientRepository
        return patientRepository.findByDoctorId(doctorId);
    }

    // ==========================================================
    // 🔍 Find patients by City or Name (for search/filter UI)
    // ==========================================================
    public List<Patient> searchPatientsByCity(String city) {
        return patientRepository.findByCityIgnoreCase(city);
    }

    public List<Patient> searchPatientsByName(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }
}
