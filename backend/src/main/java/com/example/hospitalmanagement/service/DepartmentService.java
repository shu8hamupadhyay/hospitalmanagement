package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id).orElse(null);
    }

    public void saveDepartment(Department department) {
        departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
