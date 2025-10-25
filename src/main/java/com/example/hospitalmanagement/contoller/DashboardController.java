package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.repository.AppointmentRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Controller
public class DashboardController {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public DashboardController(DoctorRepository doctorRepository,
                               PatientRepository patientRepository,
                               AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping("/dashboard")
    public String showDashboard(Model model) {

        // Total Doctors
        long doctorCount = doctorRepository.count();

        // Total Patients
        long patientCount = patientRepository.count();

        // Appointments Today
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);
        long appointmentCount = appointmentRepository.countAppointmentsToday(startOfDay, endOfDay);

        // Total Revenue (dummy value for now)
        double totalRevenue = 12500.50;

        // Add to model
        model.addAttribute("doctorCount", doctorCount);
        model.addAttribute("patientCount", patientCount);
        model.addAttribute("appointmentCount", appointmentCount);
        model.addAttribute("totalRevenue", totalRevenue);

        return "dashboard"; // Thymeleaf template
    }
}
