package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.BirthReport;
import com.example.hospitalmanagement.repository.BirthReportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BirthReportService {

    private final BirthReportRepository birthReportRepository;

    public BirthReportService(BirthReportRepository birthReportRepository) {
        this.birthReportRepository = birthReportRepository;
    }

    public List<BirthReport> getAllBirthReports() {
        return birthReportRepository.findAll();
    }

    public BirthReport getBirthReportById(Long id) {
        return birthReportRepository.findById(id).orElse(null);
    }

    public void saveBirthReport(BirthReport report) {
        birthReportRepository.save(report);
    }
}
