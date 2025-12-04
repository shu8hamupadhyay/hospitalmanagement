package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.PrescriptionDTO;
import com.example.hospitalmanagement.dto.mapper.PrescriptionDTOMapper;
import com.example.hospitalmanagement.model.Prescription;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.PrescriptionService;
import com.example.hospitalmanagement.service.PatientService;
import com.example.hospitalmanagement.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionRestController {

    private final PrescriptionService prescriptionService;
    private final PatientService patientService;
    private final DoctorService doctorService;

    public PrescriptionRestController(PrescriptionService prescriptionService, PatientService patientService, DoctorService doctorService) {
        this.prescriptionService = prescriptionService;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<PrescriptionDTO> getAllPrescriptions() {
        return prescriptionService.findAll()
                .stream()
                .map(PrescriptionDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public PrescriptionDTO getPrescriptionById(@PathVariable Long id) {
        Prescription p = prescriptionService.findAll().stream()
                .filter(pr -> pr.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return PrescriptionDTOMapper.toDTO(p);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public PrescriptionDTO createPrescription(@RequestBody PrescriptionDTO dto) {
        Prescription p = new Prescription();
        p.setMedicine(dto.getMedicine());
        p.setDosage(dto.getDosage());
        p.setInstructions(dto.getInstructions());
        p.setDate(LocalDateTime.now());

        // Link Patient
        if (dto.getPatientId() != null) {
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            p.setPatient(patient);
        }

        // Link Doctor
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor != null) {
                p.setDoctor(doctor);
            }
        }

        Prescription saved = prescriptionService.save(p);
        return PrescriptionDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public PrescriptionDTO updatePrescription(@PathVariable Long id, @RequestBody PrescriptionDTO dto) {
        Prescription p = prescriptionService.findAll().stream()
                .filter(pr -> pr.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        p.setMedicine(dto.getMedicine());
        p.setDosage(dto.getDosage());
        p.setInstructions(dto.getInstructions());

        // Link Patient
        if (dto.getPatientId() != null) {
            Patient patient = patientService.getPatientById(dto.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            p.setPatient(patient);
        }

        // Link Doctor
        if (dto.getDoctorId() != null) {
            Doctor doctor = doctorService.getDoctorById(dto.getDoctorId());
            if (doctor != null) {
                p.setDoctor(doctor);
            }
        }

        Prescription updated = prescriptionService.save(p);
        return PrescriptionDTOMapper.toDTO(updated);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void deletePrescription(@PathVariable Long id) {
        List<Prescription> all = prescriptionService.findAll();
        Prescription p = all.stream()
                .filter(pr -> pr.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        // Note: Implement deletion in service layer if needed
    }
}
