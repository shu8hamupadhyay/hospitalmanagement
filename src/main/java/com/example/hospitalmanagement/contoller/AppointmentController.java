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

import java.util.List;

@Controller
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final DepartmentService departmentService;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public AppointmentController(AppointmentService appointmentService,
                                 DepartmentService departmentService,
                                 DoctorService doctorService,
                                 PatientService patientService) {
        this.appointmentService = appointmentService;
        this.departmentService = departmentService;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    // ==========================================================
    // 📋 List All Appointments
    // ==========================================================
    @GetMapping
    public String listAppointments(Model model) {
        model.addAttribute("appointments", appointmentService.getAllAppointments());
        model.addAttribute("appointment", new Appointment()); // for inline form
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("patients", patientService.getAllPatients());
        return "appointments/list"; // ✅ templates/appointments/list.html
    }

    // ==========================================================
    // ➕ Show Form to Add New Appointment
    // ==========================================================
    @GetMapping("/new")
    public String newAppointmentForm(Model model) {
        model.addAttribute("appointment", new Appointment());
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("patients", patientService.getAllPatients());
        return "appointments/form"; // ✅ templates/appointments/form.html
    }

    // ==========================================================
    // 💾 Save Appointment (Auto Token / Serial)
    // ==========================================================
    @PostMapping
    public String saveAppointment(@ModelAttribute("appointment") Appointment appointment) {

        // ✅ Link Department
        if (appointment.getDepartment() != null && appointment.getDepartment().getId() != null) {
            Department dept = departmentService.getDepartmentById(appointment.getDepartment().getId());
            appointment.setDepartment(dept);
        } else {
            appointment.setDepartment(null);
        }

        // ✅ Link Doctor
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(appointment.getDoctor().getId());
            appointment.setDoctor(doctor);
        } else {
            appointment.setDoctor(null);
        }

        // ✅ Link Patient (safe Optional handling)
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            patientService.getPatientById(appointment.getPatient().getId())
        .ifPresent(appointment::setPatient);

        } else {
            appointment.setPatient(null);
        }

        // ✅ Auto-generate Serial No (Token)
        if (appointment.getSerialNo() == null || appointment.getSerialNo().isEmpty()) {
            if (appointment.getDepartment() != null && appointment.getDepartment().getName() != null) {
                String prefix = appointment.getDepartment().getName()
                        .substring(0, Math.min(3, appointment.getDepartment().getName().length()))
                        .toUpperCase();
                long count = appointmentService.countByDepartment(appointment.getDepartment().getId()) + 1;
                appointment.setSerialNo(prefix + "-" + String.format("%03d", count));
            } else {
                appointment.setSerialNo("GEN-" + System.currentTimeMillis());
            }
        }

        // ✅ Default status if missing
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("Active");
        }

        appointmentService.saveAppointment(appointment);
        return "redirect:/appointments";
    }

    // ==========================================================
    // ✏️ Edit Existing Appointment
    // ==========================================================
    @GetMapping("/edit/{id}")
    public String editAppointment(@PathVariable Long id, Model model) {
        Appointment appointment = appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid appointment ID: " + id));

        model.addAttribute("appointment", appointment);
        model.addAttribute("departments", departmentService.getAllDepartments());
        model.addAttribute("doctors", doctorService.getAllDoctors());
        model.addAttribute("patients", patientService.getAllPatients());

        return "appointments/form";
    }

    // ==========================================================
    // 🗑️ Delete Appointment
    // ==========================================================
    @GetMapping("/delete/{id}")
    public String deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return "redirect:/appointments";
    }

    // ==========================================================
    // 🔁 Filter Doctors by Department (AJAX)
    // ==========================================================
    @GetMapping("/doctors/by-department/{departmentId}")
    @ResponseBody
    public List<Doctor> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return doctorService.getDoctorsByDepartment(departmentId);
    }
}
