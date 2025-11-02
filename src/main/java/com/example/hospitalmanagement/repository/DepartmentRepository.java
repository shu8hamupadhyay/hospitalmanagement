package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> { }
