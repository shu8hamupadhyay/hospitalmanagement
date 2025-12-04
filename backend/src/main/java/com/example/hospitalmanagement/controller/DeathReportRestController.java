package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.DeathReportDTO;
import com.example.hospitalmanagement.dto.mapper.DeathReportDTOMapper;
import com.example.hospitalmanagement.model.DeathReport;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.DeathReportService;
import com.example.hospitalmanagement.service.PatientService;
import com.example.hospitalmanagement.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/death-reports")
@CrossOrigin(origins = "*")
public class DeathReportRestController {

    private final DeathReportService deathReportService;
    private final PatientService patientService;
    private final DoctorService doctorService;

    public DeathReportRestController(
            DeathReportService deathReportService,
            PatientService patientService,
            DoctorService doctorService) {
        this.deathReportService = deathReportService;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<DeathReportDTO> getAll() {
        return deathReportService.getAllReports()
                .stream()
                .map(DeathReportDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public DeathReportDTO getById(@PathVariable Long id) {
        DeathReport report = deathReportService.getReportById(id)
                .orElseThrow(() -> new RuntimeException("Death report not found"));
        return DeathReportDTOMapper.toDTO(report);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public DeathReportDTO create(@RequestBody DeathReportDTO dto) {

        DeathReport report = new DeathReport();

        // BASIC FIELDS
        report.setCauseOfDeath(dto.getCauseOfDeath());
        report.setWard(dto.getWard());
        report.setDateOfDeath(dto.getDateOfDeath());
        report.setRemarks(dto.getRemarks());
        report.setGender(dto.getGender());

        // ============ PATIENT (DTO → ENTITY) ============
        if (dto.getPatientId() != null) {
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Invalid patient ID: " + dto.getPatientId()));
            report.setPatient(patient);
            // Also set legacy field for backward compatibility
            report.setPatientName(patient.getName());
        }

        // ============ DOCTOR (DTO → ENTITY) ============
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor == null)
                throw new RuntimeException("Invalid doctor ID: " + dto.getDoctorId());
            report.setDoctor(doctor);
            // Also set legacy field for backward compatibility
            report.setDoctorName(doctor.getName());
        }

        DeathReport saved = deathReportService.saveReport(report);
        return DeathReportDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public DeathReportDTO update(@PathVariable Long id, @RequestBody DeathReportDTO dto) {

        DeathReport report = deathReportService.getReportById(id)
                .orElseThrow(() -> new RuntimeException("Death report not found"));

        // UPDATE BASIC FIELDS
        report.setCauseOfDeath(dto.getCauseOfDeath());
        report.setWard(dto.getWard());
        report.setDateOfDeath(dto.getDateOfDeath());
        report.setRemarks(dto.getRemarks());
        report.setGender(dto.getGender());

        // UPDATE PATIENT if provided
        if (dto.getPatientId() != null) {
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Invalid patient ID: " + dto.getPatientId()));
            report.setPatient(patient);
            report.setPatientName(patient.getName());
        }

        // UPDATE DOCTOR if provided
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor == null)
                throw new RuntimeException("Invalid doctor ID: " + dto.getDoctorId());
            report.setDoctor(doctor);
            report.setDoctorName(doctor.getName());
        }

        DeathReport updated = deathReportService.saveReport(report);
        return DeathReportDTOMapper.toDTO(updated);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        deathReportService.deleteReport(id);
    }
}
