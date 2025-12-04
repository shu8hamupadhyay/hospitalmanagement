package com.example.hospitalmanagement.controller.api;

import com.example.hospitalmanagement.dto.BillDTO;
import com.example.hospitalmanagement.dto.BillItemDTO;
import com.example.hospitalmanagement.dto.mapper.BillDTOMapper;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Medicine;

import com.example.hospitalmanagement.repository.PatientRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.BillRepository;
import com.example.hospitalmanagement.repository.MedicineRepository;

import com.example.hospitalmanagement.service.BillService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillRestController {

    private final BillService billService;
    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;

    public BillRestController(
            BillService billService,
            BillRepository billRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            MedicineRepository medicineRepository
    ) {
        this.billService = billService;
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.medicineRepository = medicineRepository;
    }

    // -------------------------
    // INVOICE GENERATOR
    // -------------------------
    private String generateInvoiceNumber() {
        long count = billRepository.count() + 1;
        return "INV-" + String.format("%04d", count);
    }

    // -------------------------
    // GET ALL (DTO)
    // -------------------------
    @GetMapping
    public List<BillDTO> getAllBills() {
        return billService.findAll()
                .stream()
                .map(BillDTOMapper::toDTO)
                .toList();
    }

    // -------------------------
    // GET ONE (DTO)
    // -------------------------
    @GetMapping("/{id}")
    public BillDTO getBill(@PathVariable Long id) {
        Bill bill = billService.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID " + id));
        return BillDTOMapper.toDTO(bill);
    }

    // -------------------------
    // CREATE BILL (DTO)
    // -------------------------
    @PostMapping
    public BillDTO createBill(@RequestBody BillDTO dto) {

        Bill bill = new Bill();

        // Set invoice number
        if (dto.getInvoiceNumber() == null || dto.getInvoiceNumber().isBlank()) {
            bill.setInvoiceNumber(generateInvoiceNumber());
        } else {
            bill.setInvoiceNumber(dto.getInvoiceNumber());
        }

        // PATIENT
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Invalid patient ID"));
        bill.setPatient(patient);

        // DOCTOR
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Invalid doctor ID"));
        bill.setDoctor(doctor);

        // ITEMS
        bill.getItems().clear();
        for (BillItemDTO itemDTO : dto.getItems()) {
            BillItem item = new BillItem();

            item.setDescription(itemDTO.getDescription());
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(itemDTO.getUnitPrice());
            item.setTaxPercent(itemDTO.getTaxPercent());
            item.setDiscountPercent(itemDTO.getDiscountPercent());

            // Link to medicine if medicineId is provided
            if (itemDTO.getMedicineId() != null) {
                Medicine medicine = medicineRepository.findById(itemDTO.getMedicineId())
                        .orElse(null);
                item.setMedicine(medicine);
            }

            item.setBill(bill);
            bill.getItems().add(item);
        }

        bill.calculateTotals();
        Bill saved = billService.save(bill);
        return BillDTOMapper.toDTO(saved);
    }

    // -------------------------
    // UPDATE BILL (DTO)
    // -------------------------
    @PutMapping("/{id}")
    public BillDTO updateBill(@PathVariable Long id, @RequestBody BillDTO dto) {

        Bill bill = billService.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with ID " + id));

        // UPDATE invoice
        if (dto.getInvoiceNumber() == null || dto.getInvoiceNumber().isBlank()) {
            bill.setInvoiceNumber(generateInvoiceNumber());
        } else {
            bill.setInvoiceNumber(dto.getInvoiceNumber());
        }

        // PATIENT
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new RuntimeException("Invalid patient ID"));
        bill.setPatient(patient);

        // DOCTOR
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Invalid doctor ID"));
        bill.setDoctor(doctor);

        // CLEAR OLD ITEMS
        bill.getItems().clear();

        // ADD NEW ITEMS
        if (dto.getItems() != null) {
            for (BillItemDTO itemDTO : dto.getItems()) {
                BillItem item = new BillItem(); // ❗ Correct — do NOT setId()

                item.setDescription(itemDTO.getDescription());
                item.setQuantity(itemDTO.getQuantity());
                item.setUnitPrice(itemDTO.getUnitPrice());
                item.setTaxPercent(itemDTO.getTaxPercent());
                item.setDiscountPercent(itemDTO.getDiscountPercent());

                // Link to medicine if medicineId is provided
                if (itemDTO.getMedicineId() != null) {
                    Medicine medicine = medicineRepository.findById(itemDTO.getMedicineId())
                            .orElse(null);
                    item.setMedicine(medicine);
                }

                item.setBill(bill);
                bill.getItems().add(item);
            }
        }

        bill.calculateTotals();
        Bill saved = billService.save(bill);

        return BillDTOMapper.toDTO(saved);
    }

    // -------------------------
    // DELETE
    // -------------------------
    @DeleteMapping("/{id}")
    public void deleteBill(@PathVariable Long id) {
        billService.deleteById(id);
    }
}
