package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // 🔍 Find patients assigned to a specific doctor
    List<Patient> findByDoctorId(Long doctorId);

    // 🔍 Search patients by city (case-insensitive)
    List<Patient> findByCityIgnoreCase(String city);

    // 🔍 Search patients by name (partial match, case-insensitive)
    List<Patient> findByNameContainingIgnoreCase(String name);

    // 🔍 Find single patient by exact name (used in Billing or other logic)
    Optional<Patient> findByName(String name);
}
