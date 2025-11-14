package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Department;
import java.util.List;

public interface DepartmentService {

    List<Department> getAllDepartments();

    Department getDepartmentById(Long id);

    Department saveDepartment(Department department);  // MUST return Department

    void deleteDepartment(Long id);
}
