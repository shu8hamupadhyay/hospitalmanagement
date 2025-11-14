package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.model.Department;
import com.example.hospitalmanagement.model.Doctor;
import com.example.hospitalmanagement.model.Patient;
import com.example.hospitalmanagement.service.AppointmentService;
import com.example.hospitalmanagement.service.DepartmentService;
import com.example.hospitalmanagement.service.DoctorService;
import com.example.hospitalmanagement.service.PatientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
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
    public List<Appointment> getAppointments() {
        return appointmentService.getAllAppointments();
    }

    // ==========================================================
    // ➕ Add New Appointment
    // ==========================================================
    @PostMapping
    public Appointment saveAppointment(@RequestBody Appointment appointment) {

        // Link Department
        if (appointment.getDepartment() != null && appointment.getDepartment().getId() != null) {
            Department dept = departmentService.getDepartmentById(appointment.getDepartment().getId());
            appointment.setDepartment(dept);
        } else {
            appointment.setDepartment(null);
        }

        // Link Doctor
        if (appointment.getDoctor() != null && appointment.getDoctor().getId() != null) {
            Doctor doctor = doctorService.getDoctorById(appointment.getDoctor().getId());
            appointment.setDoctor(doctor);
        } else {
            appointment.setDoctor(null);
        }

        // Link Patient
        if (appointment.getPatient() != null && appointment.getPatient().getId() != null) {
            patientService.getPatientById(appointment.getPatient().getId())
                    .ifPresent(appointment::setPatient);
        } else {
            appointment.setPatient(null);
        }

        // Auto-generate Serial No (Token)
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

        // Default status
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("Active");
        }

        return appointmentService.saveAppointment(appointment);
    }

    // ==========================================================
    // ✏️ Edit / Get One Appointment
    // ==========================================================
    @GetMapping("/{id}")
    public Appointment getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid appointment ID: " + id));
    }

    // ==========================================================
    // 🗑️ Delete Appointment
    // ==========================================================
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
    }

    // ==========================================================
    // 🔁 Filter Doctors by Department (React AJAX)
    // ==========================================================
    @GetMapping("/doctors/by-department/{departmentId}")
    public List<Doctor> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return doctorService.getDoctorsByDepartment(departmentId);
    }
}
