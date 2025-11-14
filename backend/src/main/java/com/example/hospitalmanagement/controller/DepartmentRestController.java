package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentRestController {

    private final DepartmentService departmentService;

    public DepartmentRestController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // ==========================================================
    // 📄 Get All Departments
    // ==========================================================
    @GetMapping
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // ==========================================================
    // 🔍 Get Department by ID
    // ==========================================================
    @GetMapping("/{id}")
    public Department getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    // ==========================================================
    // ➕ Create Department
    // ==========================================================
    @PostMapping
    public Department createDepartment(@RequestBody Department department) {
        return departmentService.saveDepartment(department);
    }

    // ==========================================================
    // ✏️ Update Department
    // ==========================================================
    @PutMapping("/{id}")
    public Department updateDepartment(@PathVariable Long id, @RequestBody Department updated) {

        Department existing = departmentService.getDepartmentById(id);

        if (existing == null) {
            throw new RuntimeException("Department Not Found with ID: " + id);
        }

        existing.setName(updated.getName());
        existing.setHead(updated.getHead());
        existing.setStaffCount(updated.getStaffCount());
        existing.setServicesOffered(updated.getServicesOffered());
        existing.setStatus(updated.getStatus());

        return departmentService.saveDepartment(existing);
    }

    // ==========================================================
    // 🗑️ Delete Department
    // ==========================================================
    @DeleteMapping("/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
    }
}
