package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.BirthReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BirthReportRepository extends JpaRepository<BirthReport, Long> {
}
