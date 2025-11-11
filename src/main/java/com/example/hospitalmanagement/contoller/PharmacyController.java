package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Medicine;
import com.example.hospitalmanagement.service.MedicineService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/pharmacy")
public class PharmacyController {

    private final MedicineService medicineService;

    public PharmacyController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    // Default redirect so /pharmacy works directly
    @GetMapping
    public String redirectToMedicines() {
        return "redirect:/pharmacy/medicines";
    }

    // Show list of medicines
    @GetMapping("/medicines")
    public String listMedicines(Model model) {
        model.addAttribute("medicines", medicineService.getAllMedicines());
        return "pharmacy/medicine-list";
    }

    // Show add medicine form
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("medicine", new Medicine());
        model.addAttribute("formTitle", "Add New Medicine");
        model.addAttribute("formAction", "/pharmacy/add");
        return "pharmacy/add-medicine";
    }

    // Handle new medicine form submission
    @PostMapping("/add")
    public String saveMedicine(@ModelAttribute Medicine medicine) {
        medicineService.saveMedicine(medicine);
        return "redirect:/pharmacy/medicines";
    }

    // View details of a specific medicine
    @GetMapping("/view/{id}")
    public String viewMedicine(@PathVariable Long id, Model model) {
        Medicine medicine = medicineService.getMedicineById(id);
        if (medicine == null) {
            return "redirect:/pharmacy/medicines";
        }
        model.addAttribute("medicine", medicine);
        return "pharmacy/view-medicine";
    }

    // ==========================
    // ✳️ NEW: Edit medicine
    // ==========================

    // Show edit form
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        Medicine medicine = medicineService.getMedicineById(id);
        if (medicine == null) {
            return "redirect:/pharmacy/medicines";
        }
        model.addAttribute("medicine", medicine);
        model.addAttribute("formTitle", "Edit Medicine");
        model.addAttribute("formAction", "/pharmacy/edit/" + id);
        return "pharmacy/add-medicine"; // reuse same HTML form
    }

    // Handle edit submission
    @PostMapping("/edit/{id}")
    public String updateMedicine(@PathVariable Long id, @ModelAttribute Medicine updatedMedicine) {
        Medicine existing = medicineService.getMedicineById(id);
        if (existing == null) {
            return "redirect:/pharmacy/medicines";
        }

        // Update fields manually
        existing.setName(updatedMedicine.getName());
        existing.setManufacturer(updatedMedicine.getManufacturer());
        existing.setBatchNumber(updatedMedicine.getBatchNumber());
        existing.setExpiryDate(updatedMedicine.getExpiryDate());
        existing.setComposition(updatedMedicine.getComposition());
        existing.setType(updatedMedicine.getType());
        existing.setDescription(updatedMedicine.getDescription());
        existing.setPrice(updatedMedicine.getPrice());
        existing.setStockQuantity(updatedMedicine.getStockQuantity());

        medicineService.saveMedicine(existing);
        return "redirect:/pharmacy/medicines";
    }
}
