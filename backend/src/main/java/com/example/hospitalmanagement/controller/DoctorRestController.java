package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.DoctorDTO;
import com.example.hospitalmanagement.service.DoctorApiService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorRestController {

    private final DoctorApiService doctorService;

    public DoctorRestController(DoctorApiService doctorService) {
        this.doctorService = doctorService;
    }

    // ==========================================================
    // GET ALL — returns DTO list
    // ==========================================================
    @GetMapping
    public List<DoctorDTO> getAll() {
        return doctorService.getAllDoctors();
    }

    // ==========================================================
    // GET ONE — returns DTO
    // ==========================================================
    @GetMapping("/{id}")
    public DoctorDTO getOne(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    // ==========================================================
    // CREATE — accepts DTO, returns DTO
    // ==========================================================
    @PostMapping
    public DoctorDTO create(@RequestBody DoctorDTO doctorDTO) {
        return doctorService.createDoctor(doctorDTO);
    }

    // ==========================================================
    // UPDATE — accepts DTO, returns DTO
    // ==========================================================
    @PutMapping("/{id}")
    public DoctorDTO update(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        return doctorService.updateDoctor(id, doctorDTO);
    }

    // ==========================================================
    // DELETE
    // ==========================================================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
    }

    // ==========================================================
    // GET BY DEPARTMENT — DTO list
    // ==========================================================
    @GetMapping("/by-department/{deptId}")
    public List<DoctorDTO> getByDepartment(@PathVariable Long deptId) {
        return doctorService.getDoctorsByDepartment(deptId);
    }
}
