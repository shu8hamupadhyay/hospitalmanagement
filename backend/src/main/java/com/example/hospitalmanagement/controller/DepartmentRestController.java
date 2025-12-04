package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.DepartmentDTO;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.DepartmentService;
import com.example.hospitalmanagement.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentRestController {

    private final DepartmentService departmentService;
    private final DoctorService doctorService;

    public DepartmentRestController(DepartmentService departmentService, DoctorService doctorService) {
        this.departmentService = departmentService;
        this.doctorService = doctorService;
    }

    // ==========================================================
    // 🔹 ENTITY → DTO  (Correct mapping using headDoctor relation)
    // ==========================================================
    private DepartmentDTO toDTO(Department d) {
        DepartmentDTO dto = new DepartmentDTO();

        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setServicesOffered(d.getServicesOffered());
        dto.setStaffCount(d.getStaffCount());
        dto.setStatus(d.getStatus());

        // ⭐ Correct mapping: use the ManyToOne relation
        if (d.getHeadDoctor() != null) {
            dto.setHeadDoctorId(d.getHeadDoctor().getId());
            dto.setHeadDoctorName(d.getHeadDoctor().getName());
        }

        return dto;
    }

    // ==========================================================
    // 🔹 DTO → ENTITY (Correct mapping using headDoctor relation)
    // ==========================================================
    private Department toEntity(DepartmentDTO dto, Department existing) {

        Department d = existing != null ? existing : new Department();

        d.setName(dto.getName());
        d.setServicesOffered(dto.getServicesOffered());
        d.setStatus(dto.getStatus());
        d.setStaffCount(dto.getStaffCount());

        // ⭐ Correct mapping: assign actual doctor entity
        if (dto.getHeadDoctorId() != null) {
            Doctor headDoctor = doctorService.getDoctorById(dto.getHeadDoctorId());
            if (headDoctor == null) {
                throw new RuntimeException("Invalid Head Doctor ID: " + dto.getHeadDoctorId());
            }

            d.setHeadDoctor(headDoctor);  // sets headDoctor object
            d.setHead(headDoctor.getName()); // backward field (optional)
        } else {
            d.setHeadDoctor(null);
            d.setHead(null);
        }

        return d;
    }

    // ==========================================================
    // 📄 GET ALL (DTO List)
    // ==========================================================
    @GetMapping
    public List<DepartmentDTO> getAllDepartments() {
        return departmentService.getAllDepartments()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ==========================================================
    // 🔍 GET ONE
    // ==========================================================
    @GetMapping("/{id}")
    public DepartmentDTO getDepartmentById(@PathVariable Long id) {
        Department d = departmentService.getDepartmentById(id);
        if (d == null) throw new RuntimeException("Department not found");
        return toDTO(d);
    }

    // ==========================================================
    // ➕ CREATE
    // ==========================================================
    @PostMapping
    public DepartmentDTO createDepartment(@RequestBody DepartmentDTO dto) {
        Department entity = toEntity(dto, null);
        Department saved = departmentService.saveDepartment(entity);
        return toDTO(saved);
    }

    // ==========================================================
    // ✏️ UPDATE
    // ==========================================================
    @PutMapping("/{id}")
    public DepartmentDTO updateDepartment(@PathVariable Long id, @RequestBody DepartmentDTO dto) {

        Department existing = departmentService.getDepartmentById(id);
        if (existing == null)
            throw new RuntimeException("Department Not Found with ID: " + id);

        Department updated = toEntity(dto, existing);
        Department saved = departmentService.saveDepartment(updated);

        return toDTO(saved);
    }

    // ==========================================================
    // 🗑️ DELETE
    // ==========================================================
    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
    }
}
