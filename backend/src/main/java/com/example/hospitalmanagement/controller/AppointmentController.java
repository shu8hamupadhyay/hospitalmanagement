package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Patient;

import com.example.hospitalmanagement.service.AppointmentService;
import com.example.hospitalmanagement.service.DepartmentService;
import com.example.hospitalmanagement.service.DoctorService;
import com.example.hospitalmanagement.service.PatientService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Spring MVC controller for Appointment entity (Thymeleaf views).
 * Uses pure entity model, NOT DTO.
 */
@Controller
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final DepartmentService departmentService;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public AppointmentController(
            AppointmentService appointmentService,
            DepartmentService departmentService,
            DoctorService doctorService,
            PatientService patientService
    ) {
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // -------------------------------------------------------------
    // LIST PAGE
    // -------------------------------------------------------------
    @GetMapping
    public String listAppointments(Model model) {
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        return "appointments";
    }

    // -------------------------------------------------------------
    // NEW FORM
    // -------------------------------------------------------------
    @GetMapping("/new")
    public String newAppointmentForm(Model model) {
        model.addAttribute("appointment", new Appointment());
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("patients", patientService.getAllPatients());
        return "appointment-form";
    }

    // -------------------------------------------------------------
    // EDIT FORM
    // -------------------------------------------------------------
    @GetMapping("/edit/{id}")
    public String editAppointment(@PathVariable Long id, Model model) {

        Appointment appt = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid appointment ID: " + id));

        model.addAttribute("appointment", appt);
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("patients", patientService.getAllPatients());

        return "appointment-form";
    }

    // -------------------------------------------------------------
    // SAVE (CREATE / UPDATE)
    // -------------------------------------------------------------
    @PostMapping
    public String saveAppointment(@ModelAttribute("appointment") Appointment appt) {

        // ----------- Department -----------
        if (appt.getDepartment() != null && appt.getDepartment().getId() != null) {
            Department d = departmentService.getDepartmentById(appt.getDepartment().getId());
            appt.setDepartment(d);
        } else {
            appt.setDepartment(null);
        }

        // ----------- Doctor -----------
        if (appt.getDoctor() != null && appt.getDoctor().getId() != null) {
            Doctor doc = doctorService.getDoctorById(appt.getDoctor().getId());
            appt.setDoctor(doc);
        } else {
            appt.setDoctor(null);
        }

        // ----------- Patient -----------
        if (appt.getPatient() != null && appt.getPatient().getId() != null) {
            Optional<Patient> pOpt = patientService.getPatientById(appt.getPatient().getId());
            Patient p = pOpt.orElseThrow(() ->
                    new RuntimeException("Invalid patient ID: " + appt.getPatient().getId()));
            appt.setPatient(p);
        } else {
            appt.setPatient(null);
        }

        // ----------- Serial number for NEW appointment -----------
        if (appt.getId() == null) {
            appointmentService.generateSerialIfNew(appt);
        }

        appointmentService.saveAppointment(appt);

        return "redirect:/appointments";
    }

    // -------------------------------------------------------------
    // DELETE
    // -------------------------------------------------------------
    @GetMapping("/delete/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return "redirect:/appointments";
    }
}
