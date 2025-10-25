package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> { }
