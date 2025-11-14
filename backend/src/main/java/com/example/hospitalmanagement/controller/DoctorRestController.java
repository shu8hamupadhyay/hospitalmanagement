package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*") // allows React (localhost:3000) to access it
public class DoctorRestController {

    private final DoctorRepository doctorRepository;

    public DoctorRestController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Get all doctors
    @GetMapping
    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    // Get a single doctor by ID
    @GetMapping("/{id}")
    public Doctor getOne(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id " + id));
    }

    // Create a new doctor
    @PostMapping
    public Doctor create(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Update an existing doctor
    @PutMapping("/{id}")
    public Doctor update(@PathVariable Long id, @RequestBody Doctor updatedDoctor) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id " + id));

        existing.setName(updatedDoctor.getName());
        existing.setEmail(updatedDoctor.getEmail());
        existing.setPhone(updatedDoctor.getPhone());
        existing.setQualification(updatedDoctor.getQualification());
        existing.setSpecialization(updatedDoctor.getSpecialization());

        return doctorRepository.save(existing);
    }

    // Delete a doctor
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        doctorRepository.deleteById(id);
    }
}
