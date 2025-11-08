package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.service.PatientService;
import com.example.hospitalmanagement.service.DoctorService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;
    private final DoctorService doctorService;

    public PatientController(PatientService patientService, DoctorService doctorService) {
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    // ==========================================================
    // 🩺 List all patients
    // ==========================================================
    @GetMapping
    public String listPatients(Model model) {
        model.addAttribute("patients", patientService.getAllPatients());
        return "patients/list"; // ✅ templates/patients/list.html
    }

    // ==========================================================
    // ➕ Show form to add new patient
    // ==========================================================
    @GetMapping("/new")
    public String newPatientForm(Model model) {
        model.addAttribute("patient", new Patient());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        return "patients/form";
    }

    // ==========================================================
    // 💾 Save new patient
    // ==========================================================
    @PostMapping
    public String savePatient(@ModelAttribute("patient") Patient patient) {
        if (patient.getDoctor() != null && patient.getDoctor().getId() != null) {
            Doctor assignedDoctor = doctorService.getDoctorById(patient.getDoctor().getId());
            patient.setDoctor(assignedDoctor);
        } else {
            patient.setDoctor(null);
        }

        patientService.savePatient(patient);
        return "redirect:/patients";
    }

    // ==========================================================
    // ✏️ Edit patient
    // ==========================================================
    @GetMapping("/edit/{id}")
    public String editPatient(@PathVariable Long id, Model model) {
        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + id));

        model.addAttribute("patient", patient);
        model.addAttribute("doctors", doctorService.getAllDoctors());
        return "patients/form";
    }

    // ==========================================================
    // 💾 Update patient
    // ==========================================================
    @PostMapping("/update/{id}")
    public String updatePatient(@PathVariable Long id, @ModelAttribute("patient") Patient updatedPatient) {
        updatedPatient.setId(id);

        if (updatedPatient.getDoctor() != null && updatedPatient.getDoctor().getId() != null) {
            Doctor assignedDoctor = doctorService.getDoctorById(updatedPatient.getDoctor().getId());
            updatedPatient.setDoctor(assignedDoctor);
        } else {
            updatedPatient.setDoctor(null);
        }

        patientService.savePatient(updatedPatient);
        return "redirect:/patients";
    }

    // ==========================================================
    // ❌ Delete patient
    // ==========================================================
    @GetMapping("/delete/{id}")
    public String deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return "redirect:/patients";
    }

    // ==========================================================
    // 🔍 View details
    // ==========================================================
    @GetMapping("/view/{id}")
    public String viewPatientDetails(@PathVariable Long id, Model model) {
        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + id));

        model.addAttribute("patient", patient);
        return "patients/view"; // ✅ templates/patients/view.html
    }

    // ==========================================================
    // 🧩 Populate doctors for dropdowns
    // ==========================================================
    @ModelAttribute("doctors")
    public List<Doctor> populateDoctors() {
        return doctorService.getAllDoctors();
    }
}
