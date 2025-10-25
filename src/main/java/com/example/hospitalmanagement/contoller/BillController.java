package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Bill;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.repository.BillRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Controller
@RequestMapping("/bills")
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public BillController(BillRepository billRepository, PatientRepository patientRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public String listBills(Model model) {
        model.addAttribute("bills", billRepository.findAll());
        return "bills";
    }

    @PostMapping
public String addBill(@RequestParam double amount,
                      @RequestParam String status,
                      @RequestParam Long patientId,
                      Model model) {
    // Try to fetch patient
    Patient patient = patientRepository.findById(patientId)
            .orElse(null);

    if (patient == null) {
        // Patient not found, show error on page
        model.addAttribute("bills", billRepository.findAll());
        model.addAttribute("error", "Patient not found with ID: " + patientId);
        return "bills"; // returns to bills page with error message
    }

    // Create and save bill
    Bill bill = new Bill();
    bill.setAmount(amount);
    bill.setStatus(status);
    bill.setBillDate(LocalDateTime.now());
    bill.setPatient(patient);
    billRepository.save(bill);

    return "redirect:/bills";
}

}
