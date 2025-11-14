package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.service.DepartmentService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final DepartmentService departmentService;

    public DoctorController(DoctorRepository doctorRepository,
                            DepartmentService departmentService) {
        this.doctorRepository = doctorRepository;
        this.departmentService = departmentService;
    }

    // ============================
    // LIST DOCTORS
    // ============================
    @GetMapping
    public String listDoctors(Model model) {
        model.addAttribute("doctors", doctorRepository.findAll());
        return "doctors/list";
    }

    // ============================
    // ADD FORM
    // ============================
    @GetMapping("/new")
    public String showAddForm(Model model) {
        model.addAttribute("doctor", new Doctor());
        model.addAttribute("departments", departmentService.getAllDepartments());
        return "doctors/form";
    }

    // ============================
    // SAVE NEW DOCTOR
    // ============================
    @PostMapping
    public String saveDoctor(@ModelAttribute("doctor") Doctor doctor) {

        if (doctor.getDepartment() != null && doctor.getDepartment().getId() != null) {
            Department dept = departmentService.getDepartmentById(doctor.getDepartment().getId());
            doctor.setDepartment(dept);
        } else {
            doctor.setDepartment(null);
        }

        doctorRepository.save(doctor);
        return "redirect:/doctors";
    }

    // ============================
    // EDIT FORM
    // ============================
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid doctor Id: " + id));

        model.addAttribute("doctor", doctor);
        model.addAttribute("departments", departmentService.getAllDepartments());
        return "doctors/form";
    }

    // ============================
    // UPDATE DOCTOR
    // ============================
    @PostMapping("/update/{id}")
    public String updateDoctor(@PathVariable Long id, @ModelAttribute Doctor updatedDoctor) {

        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid doctor Id: " + id));

        // Update basic fields
        existing.setName(updatedDoctor.getName());
        existing.setEmail(updatedDoctor.getEmail());
        existing.setPhone(updatedDoctor.getPhone());
        existing.setQualification(updatedDoctor.getQualification());
        existing.setSpecialization(updatedDoctor.getSpecialization());

        // Update department
        if (updatedDoctor.getDepartment() != null && updatedDoctor.getDepartment().getId() != null) {
            Department dept = departmentService.getDepartmentById(updatedDoctor.getDepartment().getId());
            existing.setDepartment(dept);
        } else {
            existing.setDepartment(null);
        }

        doctorRepository.save(existing);
        return "redirect:/doctors";
    }

    // ============================
    // DELETE DOCTOR
    // ============================
    @GetMapping("/delete/{id}")
    public String deleteDoctor(@PathVariable Long id, Model model) {
        try {
            doctorRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {

            model.addAttribute("errorMessage",
                    "Cannot delete doctor because appointments or patients are linked to this doctor.");

            model.addAttribute("doctors", doctorRepository.findAll());
            return "doctors/list";
        }

        return "redirect:/doctors";
    }
}
