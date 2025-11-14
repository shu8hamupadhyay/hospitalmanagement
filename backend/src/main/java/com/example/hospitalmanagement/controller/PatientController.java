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
    // LIST ALL PATIENTS
    // ==========================================================
    @GetMapping
    public String listPatients(Model model) {
        model.addAttribute("patients", patientService.getAllPatients());
        return "patients/list";
    }

    // ==========================================================
    // ADD NEW PATIENT FORM
    // ==========================================================
    @GetMapping("/new")
    public String newPatientForm(Model model) {
        model.addAttribute("patient", new Patient());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        return "patients/form";
    }

    // ==========================================================
    // SAVE NEW PATIENT
    // ==========================================================
    @PostMapping
    public String savePatient(@ModelAttribute("patient") Patient patient) {

        // Assign doctor if provided
        if (patient.getDoctor() != null && patient.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(patient.getDoctor().getId());
            patient.setDoctor(doctor);
        } else {
            patient.setDoctor(null);
        }

        patientService.savePatient(patient);
        return "redirect:/patients";
    }

    // ==========================================================
    // EDIT PATIENT FORM
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
    // UPDATE PATIENT
    // ==========================================================
    @PostMapping("/update/{id}")
    public String updatePatient(
            @PathVariable Long id,
            @ModelAttribute("patient") Patient updatedPatient
    ) {

        Patient existing = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + id));

        // Update simple fields
        existing.setName(updatedPatient.getName());
        existing.setAge(updatedPatient.getAge());
        existing.setGender(updatedPatient.getGender());
        existing.setEmail(updatedPatient.getEmail());
        existing.setPhone(updatedPatient.getPhone());
        existing.setDob(updatedPatient.getDob());
        existing.setAddress(updatedPatient.getAddress());
        existing.setCity(updatedPatient.getCity());
        existing.setState(updatedPatient.getState());
        existing.setCountry(updatedPatient.getCountry());
        existing.setBloodGroup(updatedPatient.getBloodGroup());
        existing.setMaritalStatus(updatedPatient.getMaritalStatus());
        existing.setMedicalHistory(updatedPatient.getMedicalHistory());
        existing.setAllergies(updatedPatient.getAllergies());
        existing.setCurrentMedications(updatedPatient.getCurrentMedications());
        existing.setEmergencyContactName(updatedPatient.getEmergencyContactName());
        existing.setEmergencyContactNumber(updatedPatient.getEmergencyContactNumber());
        existing.setRelationshipToPatient(updatedPatient.getRelationshipToPatient());
        existing.setInsuranceProvider(updatedPatient.getInsuranceProvider());
        existing.setInsurancePolicyNumber(updatedPatient.getInsurancePolicyNumber());

        // Update doctor relation
        if (updatedPatient.getDoctor() != null && updatedPatient.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(updatedPatient.getDoctor().getId());
            existing.setDoctor(doctor);
        } else {
            existing.setDoctor(null);
        }

        patientService.savePatient(existing);
        return "redirect:/patients";
    }

    // ==========================================================
    // DELETE PATIENT
    // ==========================================================
    @GetMapping("/delete/{id}")
    public String deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return "redirect:/patients";
    }

    // ==========================================================
    // VIEW DETAILS
    // ==========================================================
    @GetMapping("/view/{id}")
    public String viewPatientDetails(@PathVariable Long id, Model model) {

        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid patient ID: " + id));

        model.addAttribute("patient", patient);
        return "patients/view";
    }

    // ==========================================================
    // POPULATE DOCTOR LIST FOR FORMS
    // ==========================================================
    @ModelAttribute("doctors")
    public List<Doctor> populateDoctors() {
        return doctorService.getAllDoctors();
    }
}
