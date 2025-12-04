package com.example.hospitalmanagement.rest;

import com.example.hospitalmanagement.dto.LabReportDTO;
import com.example.hospitalmanagement.mapper.LabReportDTOMapper;
import com.example.hospitalmanagement.model.LabReport;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.service.LabReportService;
import com.example.hospitalmanagement.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/labreports")
@CrossOrigin(origins = "*")
public class LabReportRestController {

    private final LabReportService labReportService;
    private final PatientService patientService;
    private final LabReportDTOMapper mapper;

    public LabReportRestController(LabReportService labReportService, PatientService patientService, LabReportDTOMapper mapper) {
        this.labReportService = labReportService;
        this.patientService = patientService;
        this.mapper = mapper;
    }

    // =======================================================
    // GET ALL LAB REPORTS (DTO)
    // =======================================================
    @GetMapping
    public ResponseEntity<List<LabReportDTO>> getAll() {
        try {
            List<LabReportDTO> reports = labReportService.getAllLabReports()
                    .stream()
                    .map(mapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =======================================================
    // GET ONE LAB REPORT (DTO)
    // =======================================================
    @GetMapping("/{id}")
    public ResponseEntity<LabReportDTO> getOne(@PathVariable Long id) {
        try {
            LabReport report = labReportService.getLabReportById(id);
            if (report == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(mapper.toDTO(report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =======================================================
    // CREATE LAB REPORT (DTO)
    // =======================================================
    @PostMapping
    public ResponseEntity<?> create(@RequestBody LabReportDTO dto) {
        try {
            // Validate patient exists
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElse(null);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Patient not found with ID: " + dto.getPatientId());
            }

            // Create entity from DTO
            LabReport report = new LabReport();
            report.setTestName(dto.getTestName());
            report.setResult(dto.getResult());
            report.setReportDate(LocalDateTime.now());
            report.setNotes(dto.getNotes());
            report.setPatient(patient);

            // Save and return DTO
            LabReport saved = labReportService.saveLabReport(report);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating lab report: " + e.getMessage());
        }
    }

    // =======================================================
    // UPDATE LAB REPORT (DTO)
    // =======================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody LabReportDTO dto) {
        try {
            // Check if report exists
            LabReport existing = labReportService.getLabReportById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Lab report not found with ID: " + id);
            }

            // Validate patient exists
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElse(null);
            if (patient == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Patient not found with ID: " + dto.getPatientId());
            }

            // Update fields
            existing.setTestName(dto.getTestName());
            existing.setResult(dto.getResult());
            existing.setReportDate(dto.getReportDate() != null ? dto.getReportDate() : existing.getReportDate());
            existing.setNotes(dto.getNotes());
            existing.setPatient(patient);

            // Save and return updated DTO
            LabReport updated = labReportService.saveLabReport(existing);
            return ResponseEntity.ok(mapper.toDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating lab report: " + e.getMessage());
        }
    }

    // =======================================================
    // DELETE LAB REPORT
    // =======================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!labReportService.getAllLabReports().stream().anyMatch(r -> r.getId().equals(id))) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Lab report not found with ID: " + id);
            }
            labReportService.deleteLabReport(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting lab report: " + e.getMessage());
        }
    }
}
