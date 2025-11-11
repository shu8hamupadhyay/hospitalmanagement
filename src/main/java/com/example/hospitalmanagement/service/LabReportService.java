package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.LabReport;
import com.example.hospitalmanagement.repository.LabReportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LabReportService {
    private final LabReportRepository repo;

    public LabReportService(LabReportRepository repo) {
        this.repo = repo;
    }

    public List<LabReport> findAll() {
        return repo.findAll();
    }

    public LabReport save(LabReport report) {
        return repo.save(report);
    }
}
