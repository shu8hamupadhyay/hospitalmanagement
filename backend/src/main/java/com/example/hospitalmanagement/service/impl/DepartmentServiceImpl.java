package com.example.hospitalmanagement.service.impl;

import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.repository.DepartmentRepository;
import com.example.hospitalmanagement.service.DepartmentService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // ---------------------------------------------------------
    // GET ALL
    // ---------------------------------------------------------
    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // ---------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------
    @Override
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    // ---------------------------------------------------------
    // SAVE / UPDATE
    // ---------------------------------------------------------
    @Override
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    // ---------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------
    @Override
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found: " + id);
        }
        departmentRepository.deleteById(id);
    }
}
