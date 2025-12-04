package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.repository.DeathReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeathReportService {

    @Autowired
    private DeathReportRepository deathReportRepository;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    public List<DeathReport> getAllReports() {
        return deathReportRepository.findAll();
    }

    public Optional<DeathReport> getReportById(Long id) {
        return deathReportRepository.findById(id);
    }

    public DeathReport saveReport(DeathReport report) {
        return deathReportRepository.save(report);
    }

    public DeathReport updateReport(Long id, DeathReport reportDetails) {
        DeathReport report = deathReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Death report not found"));

        report.setCauseOfDeath(reportDetails.getCauseOfDeath());
        report.setWard(reportDetails.getWard());
        report.setDateOfDeath(reportDetails.getDateOfDeath());
        report.setRemarks(reportDetails.getRemarks());
        report.setGender(reportDetails.getGender());

        if (reportDetails.getPatient() != null) {
            report.setPatient(reportDetails.getPatient());
        }
        if (reportDetails.getDoctor() != null) {
            report.setDoctor(reportDetails.getDoctor());
        }

        return deathReportRepository.save(report);
    }

    public void deleteReport(Long id) {
        deathReportRepository.deleteById(id);
    }
}

