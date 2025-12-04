package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.dto.MedicineDTO;
import com.example.hospitalmanagement.mapper.MedicineDTOMapper;
import com.example.hospitalmanagement.model.Medicine;
import com.example.hospitalmanagement.service.MedicineService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pharmacy")
@CrossOrigin(origins = "*")
public class PharmacyRestController {

    private final MedicineService medicineService;
    private final MedicineDTOMapper mapper;

    public PharmacyRestController(MedicineService medicineService, MedicineDTOMapper mapper) {
        this.medicineService = medicineService;
        this.mapper = mapper;
    }

    // =======================================================
    // GET ALL MEDICINES (DTO)
    // =======================================================
    @GetMapping("/medicines")
    public ResponseEntity<List<MedicineDTO>> getAllMedicines() {
        try {
            List<MedicineDTO> medicines = medicineService.getAllMedicines()
                    .stream()
                    .map(mapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(medicines);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =======================================================
    // GET ONE MEDICINE (DTO)
    // =======================================================
    @GetMapping("/medicines/{id}")
    public ResponseEntity<MedicineDTO> getMedicine(@PathVariable Long id) {
        try {
            Medicine medicine = medicineService.getMedicineById(id);
            if (medicine == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(mapper.toDTO(medicine));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // =======================================================
    // CREATE MEDICINE (DTO)
    // =======================================================
    @PostMapping("/medicines")
    public ResponseEntity<?> addMedicine(@RequestBody MedicineDTO dto) {
        try {
            // Validate required fields
            if (dto.getName() == null || dto.getName().trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Medicine name is required");
            }

            Medicine medicine = mapper.toEntity(dto);
            medicine.setId(null); // Ensure ID is null for new records

            Medicine saved = medicineService.saveMedicine(medicine);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating medicine: " + e.getMessage());
        }
    }

    // =======================================================
    // UPDATE MEDICINE (DTO)
    // =======================================================
    @PutMapping("/medicines/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody MedicineDTO dto) {
        try {
            Medicine existing = medicineService.getMedicineById(id);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Medicine not found with ID: " + id);
            }

            mapper.updateEntityFromDTO(dto, existing);
            Medicine updated = medicineService.saveMedicine(existing);
            return ResponseEntity.ok(mapper.toDTO(updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating medicine: " + e.getMessage());
        }
    }

    // =======================================================
    // DELETE MEDICINE
    // =======================================================
    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        try {
            Medicine medicine = medicineService.getMedicineById(id);
            if (medicine == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Medicine not found with ID: " + id);
            }

            medicineService.deleteMedicine(id);
            return ResponseEntity.ok("Medicine deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting medicine: " + e.getMessage());
        }
    }
}
