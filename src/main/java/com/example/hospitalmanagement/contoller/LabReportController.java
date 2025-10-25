package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.LabReport;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.repository.LabReportRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
@RequestMapping("/labreports")
public class LabReportController {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;

    public LabReportController(LabReportRepository labReportRepository, PatientRepository patientRepository) {
        this.labReportRepository = labReportRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public String listReports(Model model) {
        model.addAttribute("labreports", labReportRepository.findAll());
        return "labreports";
    }

    @PostMapping
    public String addReport(@RequestParam String testName,
                            @RequestParam String result,
                            @RequestParam(required = false) String notes,
                            @RequestParam Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        LabReport report = new LabReport();
        report.setTestName(testName);
        report.setResult(result);
        report.setNotes(notes);
        report.setReportDate(LocalDateTime.now());
        report.setPatient(patient);
        labReportRepository.save(report);
        return "redirect:/labreports";
    }
}
