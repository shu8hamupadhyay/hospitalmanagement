package com.example.hospitalmanagement.repository;

import com.example.hospitalmanagement.model.DeathReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeathReportRepository extends JpaRepository<DeathReport, Long> { }
