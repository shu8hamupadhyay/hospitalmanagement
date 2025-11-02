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

    /** ✅ List all lab reports */
    @GetMapping
    public String listReports(Model model) {
        model.addAttribute("labreports", labReportRepository.findAll());
        return "labreports";
    }

    /** ✅ Add new lab report */
    @PostMapping
    public String addReport(@RequestParam String testName,
                            @RequestParam String result,
                            @RequestParam(required = false) String notes,
                            @RequestParam Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + patientId));

        LabReport report = new LabReport();
        report.setTestName(testName);
        report.setResult(result);
        report.setNotes(notes);
        report.setReportDate(LocalDateTime.now());
        report.setPatient(patient);

        labReportRepository.save(report);
        return "redirect:/labreports";
    }

    /** ✅ Show edit form */
    @GetMapping("/edit/{id}")
    public String editReport(@PathVariable Long id, Model model) {
        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid report ID: " + id));

        model.addAttribute("report", report);
        model.addAttribute("patients", patientRepository.findAll());
        return "edit-labreport";
    }

    /** ✅ Update lab report */
    @PostMapping("/update/{id}")
    public String updateReport(@PathVariable Long id,
                               @ModelAttribute LabReport updatedReport,
                               @RequestParam Long patientId) {
        LabReport existing = labReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid report ID: " + id));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + patientId));

        existing.setTestName(updatedReport.getTestName());
        existing.setResult(updatedReport.getResult());
        existing.setNotes(updatedReport.getNotes());
        existing.setPatient(patient);

        labReportRepository.save(existing);
        return "redirect:/labreports";
    }

    /** ✅ Delete lab report */
    @GetMapping("/delete/{id}")
    public String deleteReport(@PathVariable Long id) {
        labReportRepository.deleteById(id);
        return "redirect:/labreports";
    }
}
