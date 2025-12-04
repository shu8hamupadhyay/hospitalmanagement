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

    // =======================================================
    // 🔹 GET ALL LAB REPORTS (Used in Dashboard)
    // =======================================================
    public List<LabReport> getAllLabReports() {
        return repo.findAll();
    }

    // =======================================================
    // 🔹 GET ONE REPORT
    // =======================================================
    public LabReport getLabReportById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // =======================================================
    // 🔹 SAVE OR UPDATE
    // =======================================================
    public LabReport saveLabReport(LabReport report) {
        return repo.save(report);
    }

    // Compatibility support for existing usages
    public LabReport save(LabReport report) {
        return repo.save(report);
    }

    // =======================================================
    // 🔹 UPDATE LAB REPORT
    // =======================================================
    public LabReport updateLabReport(Long id, LabReport reportDetails) {
        return repo.findById(id).map(existing -> {
            if (reportDetails.getTestName() != null) {
                existing.setTestName(reportDetails.getTestName());
            }
            if (reportDetails.getResult() != null) {
                existing.setResult(reportDetails.getResult());
            }
            if (reportDetails.getReportDate() != null) {
                existing.setReportDate(reportDetails.getReportDate());
            }
            if (reportDetails.getNotes() != null) {
                existing.setNotes(reportDetails.getNotes());
            }
            if (reportDetails.getPatient() != null) {
                existing.setPatient(reportDetails.getPatient());
            }
            return repo.save(existing);
        }).orElse(null);
    }

    // =======================================================
    // 🔹 DELETE LAB REPORT
    // =======================================================
    public void deleteLabReport(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
        }
    }

    // =======================================================
    // 🔹 COUNT (Used in dashboard)
    // =======================================================
    public long countLabReports() {
        return repo.count();
    }
}

