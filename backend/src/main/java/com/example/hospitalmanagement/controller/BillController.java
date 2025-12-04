package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import com.example.hospitalmanagement.service.BillService;
import com.itextpdf.text.DocumentException;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

/**
 * 🧾 BillController — (Thymeleaf MVC)
 */
@Controller
@RequestMapping("/bills")
public class BillController {

    private final BillService billService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public BillController(
            BillService billService,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {
        this.billService = billService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // -------------------------------------------------------------
    // LIST ALL BILLS
    // -------------------------------------------------------------
    @GetMapping
    public String listBills(Model model) {
        model.addAttribute("bills", billService.findAll());
        return "bills";
    }

    // -------------------------------------------------------------
    // NEW BILL FORM
    // -------------------------------------------------------------
    @GetMapping("/new")
    public String createBillForm(Model model) {
        model.addAttribute("bill", new Bill());
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());
        return "bill-form";
    }

    // -------------------------------------------------------------
    // EDIT BILL FORM
    // -------------------------------------------------------------
    @GetMapping("/edit/{id}")
    public String editBillForm(@PathVariable Long id, Model model) {

        Bill bill = billService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid bill ID: " + id));

        model.addAttribute("bill", bill);
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());

        return "bill-form";
    }

    // -------------------------------------------------------------
    // SAVE BILL (CREATE OR UPDATE)
    // -------------------------------------------------------------
    @PostMapping
    public String saveBill(@ModelAttribute("bill") Bill bill) {

        // ------------------------
        // Validate Patient/Doctor
        // ------------------------
        Long patientId = bill.getPatient() != null ? bill.getPatient().getId() : null;
        Long doctorId = bill.getDoctor() != null ? bill.getDoctor().getId() : null;

        if (patientId == null || doctorId == null) {
            throw new IllegalArgumentException("Patient and Doctor must be selected.");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + patientId));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid doctor ID: " + doctorId));

        bill.setPatient(patient);
        bill.setDoctor(doctor);

        // ------------------------
        // Fix item → bill relation
        // ------------------------
        if (bill.getItems() != null) {

            // IMPORTANT FIX:
            // Reset bidirectional binding so BillItem.bill is always correct
            for (BillItem item : bill.getItems()) {
                item.setBill(bill);
            }
        }

        billService.save(bill);

        return "redirect:/bills";
    }

    // -------------------------------------------------------------
    // VIEW BILL DETAILS
    // -------------------------------------------------------------
    @GetMapping("/{id}")
    public String viewBill(@PathVariable Long id, Model model) {

        Bill bill = billService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid bill ID: " + id));

        model.addAttribute("bill", bill);
        return "bill-details";
    }

    // -------------------------------------------------------------
    // DELETE BILL
    // -------------------------------------------------------------
    @GetMapping("/delete/{id}")
    public String deleteBill(@PathVariable Long id) {
        billService.deleteById(id);
        return "redirect:/bills";
    }

    // -------------------------------------------------------------
    // EXPORT EXCEL
    // -------------------------------------------------------------
    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportBillsToExcel() throws IOException {

        List<Bill> bills = billService.findAll();
        ByteArrayInputStream excel = billService.exportBillsToExcel(bills);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=bills.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ))
                .body(new InputStreamResource(excel));
    }

    // -------------------------------------------------------------
    // IMPORT EXCEL
    // -------------------------------------------------------------
    @PostMapping("/import")
    public String importBills(@RequestParam("file") MultipartFile file, Model model) {

        try {
            billService.importBillsFromExcel(file.getInputStream());
            model.addAttribute("message", "Bills imported successfully!");
        } catch (Exception e) {
            model.addAttribute("error", "Failed to import: " + e.getMessage());
        }

        return "redirect:/bills";
    }

    // -------------------------------------------------------------
    // PDF EXPORT
    // -------------------------------------------------------------
    @GetMapping("/{id}/pdf")
    public ResponseEntity<InputStreamResource> downloadBillPDF(@PathVariable Long id)
            throws DocumentException {

        Bill bill = billService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid bill ID: " + id));

        ByteArrayInputStream pdf = billService.exportBillToPDF(bill);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition",
                "inline; filename=" + bill.getInvoiceNumber() + ".pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
}
