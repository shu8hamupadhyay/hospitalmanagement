package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.dto.DoctorDTO;
import com.example.hospitalmanagement.dto.mapper.DoctorDTOMapper;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.repository.DepartmentRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DoctorApiService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorDTOMapper mapper;

    public DoctorApiService(
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            DoctorDTOMapper mapper
    ) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.mapper = mapper;
    }

    // ==========================================================
    // GET ALL — DTO
    // ==========================================================
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    // ==========================================================
    // GET ONE — DTO
    // ==========================================================
    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + id));
        return mapper.toDTO(doctor);
    }

    // ==========================================================
    // CREATE
    // ==========================================================
    public DoctorDTO createDoctor(DoctorDTO dto) {

        Department dept = null;
        if (dto.getDepartmentId() != null) {
            dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
        }

        Doctor entity = mapper.toEntity(dto, dept);
        Doctor saved = doctorRepository.save(entity);
        return mapper.toDTO(saved);
    }

    // ==========================================================
    // UPDATE
    // ==========================================================
    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {

        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + id));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setQualification(dto.getQualification());
        existing.setSpecialization(dto.getSpecialization());

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId()).orElse(null);
            existing.setDepartment(dept);
        }

        Doctor saved = doctorRepository.save(existing);
        return mapper.toDTO(saved);
    }

    // ==========================================================
    // DELETE
    // ==========================================================
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // ==========================================================
    // GET DOCTORS BY DEPARTMENT — DTO
    // ==========================================================
    public List<DoctorDTO> getDoctorsByDepartment(Long deptId) {
        return doctorRepository.findByDepartmentId(deptId)
                .stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }
}
