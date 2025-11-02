package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Long> { }
