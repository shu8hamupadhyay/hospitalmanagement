package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.repository.DeathReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeathReportService {

    @Autowired
    private DeathReportRepository deathReportRepository;

    public List<DeathReport> getAllReports() {
        return deathReportRepository.findAll();
    }

    public Optional<DeathReport> getReportById(Long id) {
        return deathReportRepository.findById(id);
    }

    public DeathReport saveReport(DeathReport report) {
        return deathReportRepository.save(report);
    }

    public void deleteReport(Long id) {
        deathReportRepository.deleteById(id);
    }
}
