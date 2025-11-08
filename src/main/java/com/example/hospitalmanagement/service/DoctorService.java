package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // ==========================================================
    // 🩺 Fetch all doctors
    // ==========================================================
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // ==========================================================
    // 🔍 Find doctor by ID (returns null if not found)
    // ==========================================================
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    // ==========================================================
    // 💾 Save or update doctor
    // ==========================================================
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // ==========================================================
    // ❌ Delete doctor by ID
    // ==========================================================
    public void deleteDoctor(Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
        }
    }

    // ==========================================================
    // ✅ Check if doctor exists
    // ==========================================================
    public boolean existsById(Long id) {
        return doctorRepository.existsById(id);
    }

    // ==========================================================
    // 🏥 Get doctors by department (for Appointment filtering)
    // ==========================================================
    public List<Doctor> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    // ==========================================================
    // 🔍 Find doctor by name (used in BillService / Reports)
    // ==========================================================
    public Doctor getDoctorByName(String name) {
        return doctorRepository.findByName(name).orElse(null);
    }
}
