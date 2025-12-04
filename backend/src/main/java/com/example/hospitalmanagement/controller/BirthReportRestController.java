package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.BirthReportDTO;
import com.example.hospitalmanagement.dto.mapper.BirthReportDTOMapper;
import com.example.hospitalmanagement.model.BirthReport;
import com.example.hospitalmanagement.service.BirthReportService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/birthreports")
@CrossOrigin(origins = "*")
public class BirthReportRestController {

    private final BirthReportService birthReportService;

    public BirthReportRestController(BirthReportService birthReportService) {
        this.birthReportService = birthReportService;
    }

    // =====================================================
    // GET ALL — DTO List
    // =====================================================
    @GetMapping
    public List<BirthReportDTO> getAllBirthReports() {
        return birthReportService.getAllBirthReports()
                .stream()
                .map(BirthReportDTOMapper::toDTO)
                .collect(Collectors.toList());
    }

    // =====================================================
    // GET ONE — DTO
    // =====================================================
    @GetMapping("/{id}")
    public BirthReportDTO getBirthReportById(@PathVariable Long id) {
        BirthReport b = birthReportService.getBirthReportById(id);
        if (b == null) {
            throw new RuntimeException("Birth Report not found");
        }
        return BirthReportDTOMapper.toDTO(b);
    }

    // =====================================================
    // CREATE — DTO Based
    // =====================================================
    @PostMapping
    public BirthReportDTO createBirthReport(@RequestBody BirthReportDTO dto) {
        BirthReport b = new BirthReport();
        b.setBabyName(dto.getBabyName());
        b.setMotherName(dto.getMotherName());
        b.setFatherName(dto.getFatherName());
        b.setGender(dto.getGender());
        // Use birthDateTime from DTO if provided, otherwise use now
        if (dto.getBirthDateTime() != null && !dto.getBirthDateTime().isEmpty()) {
            try {
                b.setBirthDateTime(LocalDateTime.parse(dto.getBirthDateTime()));
            } catch (Exception e) {
                b.setBirthDateTime(LocalDateTime.now());
            }
        } else {
            b.setBirthDateTime(LocalDateTime.now());
        }
        b.setDoctorName(dto.getDoctorName());
        b.setRemarks(dto.getRemarks());

        BirthReport saved = birthReportService.saveBirthReport(b);
        return BirthReportDTOMapper.toDTO(saved);
    }

    // =====================================================
    // UPDATE — DTO Based
    // =====================================================
    @PutMapping("/{id}")
    public BirthReportDTO updateBirthReport(@PathVariable Long id, @RequestBody BirthReportDTO dto) {
        BirthReport b = birthReportService.getBirthReportById(id);
        if (b == null) {
            throw new RuntimeException("Birth Report not found");
        }

        b.setBabyName(dto.getBabyName());
        b.setMotherName(dto.getMotherName());
        b.setFatherName(dto.getFatherName());
        b.setGender(dto.getGender());
        b.setDoctorName(dto.getDoctorName());
        b.setRemarks(dto.getRemarks());

        birthReportService.saveBirthReport(b);
        return BirthReportDTOMapper.toDTO(b);
    }

    // =====================================================
    // DELETE
    // =====================================================
    @DeleteMapping("/{id}")
    public void deleteBirthReport(@PathVariable Long id) {
        BirthReport b = birthReportService.getBirthReportById(id);
        if (b == null) {
            throw new RuntimeException("Birth Report not found");
        }
        // Note: Implement deletion in service layer if needed
    }
}
