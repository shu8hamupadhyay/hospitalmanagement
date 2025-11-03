package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.BillItem;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.BillService;
import com.example.hospitalmanagement.repository.PatientRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/bills")
public class BillController {

    private final BillService billService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public BillController(BillService billService,
                          PatientRepository patientRepository,
                          DoctorRepository doctorRepository) {
        this.billService = billService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // 🧾 Show all bills
    @GetMapping
    public String listBills(Model model) {
        model.addAttribute("bills", billService.findAll());
        return "bills"; // → templates/bills.html
    }

    // ➕ Show create bill form
    @GetMapping("/new")
    public String createBillForm(Model model) {
        model.addAttribute("bill", new Bill());
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());
        return "bill-form"; // → templates/bill-form.html
    }

    // 💾 Save or update a bill (Fixed: No missing parameters now)
    @PostMapping
    public String saveBill(@ModelAttribute("bill") Bill bill) {

        // ✅ Extract nested object IDs from form
        Long patientId = bill.getPatient() != null ? bill.getPatient().getId() : null;
        Long doctorId = bill.getDoctor() != null ? bill.getDoctor().getId() : null;

        // ✅ Validate existence
        if (patientId == null || doctorId == null) {
            throw new IllegalArgumentException("Patient and Doctor must be selected.");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid doctor ID: " + doctorId));

        // ✅ Set linked entities
        bill.setPatient(patient);
        bill.setDoctor(doctor);

        // ✅ Ensure each BillItem is linked back to this Bill
        if (bill.getItems() != null && !bill.getItems().isEmpty()) {
            for (BillItem item : bill.getItems()) {
                item.setBill(bill);
            }
        }

        // ✅ Save (totals auto-calculated inside entity)
        billService.save(bill);

        return "redirect:/bills";
    }

    // 👁 View single bill
    @GetMapping("/{id}")
    public String viewBill(@PathVariable Long id, Model model) {
        Bill bill = billService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid bill ID: " + id));
        model.addAttribute("bill", bill);
        return "bill-details"; // → templates/bill-details.html
    }

    // 🗑 Delete bill
    @GetMapping("/delete/{id}")
    public String deleteBill(@PathVariable Long id) {
        billService.deleteById(id);
        return "redirect:/bills";
    }
}
