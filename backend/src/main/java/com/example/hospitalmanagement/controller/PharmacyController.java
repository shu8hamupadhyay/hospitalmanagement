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

    // Redirect /pharmacy -> /pharmacy/medicines
    @GetMapping
    public String redirectToMedicines() {
        return "redirect:/pharmacy/medicines";
    }

    // List all medicines
    @GetMapping("/medicines")
    public String listMedicines(Model model) {
        model.addAttribute("medicines", medicineService.getAllMedicines());
        return "pharmacy/medicine-list";
    }

    // Show Add Medicine Form
    @GetMapping("/add")
    public String showAddForm(Model model) {
        Medicine empty = new Medicine();
        empty.setId(null);   // ensure new entry always has null ID

        model.addAttribute("medicine", empty);
        model.addAttribute("formTitle", "Add New Medicine");
        model.addAttribute("formAction", "/pharmacy/add");

        return "pharmacy/add-medicine";
    }

    // Save new medicine
    @PostMapping("/add")
    public String saveMedicine(@ModelAttribute Medicine medicine) {

        // CRITICAL FIX — always force null ID to avoid PK collision
        medicine.setId(null);

        // Additional null-safety
        if (medicine.getPrice() == null) medicine.setPrice(0.0);
        if (medicine.getStockQuantity() == null) medicine.setStockQuantity(0);
        if (medicine.getComposition() == null) medicine.setComposition("");
        if (medicine.getDescription() == null) medicine.setDescription("");
        if (medicine.getType() == null) medicine.setType("");
        if (medicine.getLocation() == null) medicine.setLocation("");

        medicineService.saveMedicine(medicine);
        return "redirect:/pharmacy/medicines";
    }

    // View Medicine
    @GetMapping("/view/{id}")
    public String viewMedicine(@PathVariable Long id, Model model) {
        Medicine medicine = medicineService.getMedicineById(id);
        if (medicine == null) {
            return "redirect:/pharmacy/medicines";
        }
        model.addAttribute("medicine", medicine);
        return "pharmacy/view-medicine";
    }

    // Show Edit Medicine Form
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        Medicine medicine = medicineService.getMedicineById(id);
        if (medicine == null) {
            return "redirect:/pharmacy/medicines";
        }

        model.addAttribute("medicine", medicine);
        model.addAttribute("formTitle", "Edit Medicine");
        model.addAttribute("formAction", "/pharmacy/edit/" + id);

        return "pharmacy/add-medicine";  // reuse same form
    }

    // Update medicine
    @PostMapping("/edit/{id}")
    public String updateMedicine(@PathVariable Long id, @ModelAttribute Medicine updated) {

        Medicine existing = medicineService.getMedicineById(id);
        if (existing == null) {
            return "redirect:/pharmacy/medicines";
        }

        // Update fields safely
        existing.setName(updated.getName());
        existing.setManufacturer(updated.getManufacturer());
        existing.setBatchNumber(updated.getBatchNumber());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setComposition(updated.getComposition() != null ? updated.getComposition() : "");
        existing.setType(updated.getType() != null ? updated.getType() : "");
        existing.setDescription(updated.getDescription() != null ? updated.getDescription() : "");
        existing.setPrice(updated.getPrice() != null ? updated.getPrice() : 0.0);
        existing.setStockQuantity(updated.getStockQuantity() != null ? updated.getStockQuantity() : 0);
        existing.setLocation(updated.getLocation() != null ? updated.getLocation() : "");

        medicineService.saveMedicine(existing);

        return "redirect:/pharmacy/medicines";
    }
}
