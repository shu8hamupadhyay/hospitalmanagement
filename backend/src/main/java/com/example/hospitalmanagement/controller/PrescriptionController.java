package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.model.Prescription;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import com.example.hospitalmanagement.repository.PrescriptionRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequestMapping("/prescriptions")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository,
                                  PatientRepository patientRepository,
                                  DoctorRepository doctorRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // ✅ View all prescriptions
    @GetMapping
    public String listPrescriptions(Model model) {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        model.addAttribute("prescriptions", prescriptions);
        return "prescriptions";
    }

    // ✅ Show Add/Edit form
    @GetMapping("/form")
    public String showForm(@RequestParam(required = false) Long id, Model model) {
        Prescription prescription = (id != null)
                ? prescriptionRepository.findById(id).orElse(new Prescription())
                : new Prescription();

        model.addAttribute("prescription", prescription);
        model.addAttribute("patients", patientRepository.findAll());
        model.addAttribute("doctors", doctorRepository.findAll());
        return "prescription-form";
    }

    // ✅ Add or Update Prescription
    @PostMapping
    public String savePrescription(@ModelAttribute Prescription prescription,
                                   @RequestParam Long patientId,
                                   @RequestParam Long doctorId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        if (prescription.getDate() == null) {
            prescription.setDate(LocalDateTime.now());
        }

        prescriptionRepository.save(prescription);
        return "redirect:/prescriptions";
    }

    // ✅ Delete prescription
    @GetMapping("/delete/{id}")
    public String deletePrescription(@PathVariable Long id) {
        prescriptionRepository.deleteById(id);
        return "redirect:/prescriptions";
    }
}
