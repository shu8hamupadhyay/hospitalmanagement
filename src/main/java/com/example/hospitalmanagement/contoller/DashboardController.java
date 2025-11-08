package com.example.hospitalmanagement.controller;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.repository.AppointmentRepository;
import com.example.hospitalmanagement.repository.DoctorRepository;
import com.example.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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

        // ==========================================================
        // 📊 1️⃣ DASHBOARD SUMMARY STATS
        // ==========================================================
        long doctorCount = doctorRepository.count();
        long patientCount = patientRepository.count();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

        // Count appointments happening "today"
        long appointmentCount = appointmentRepository.countByAppointmentDateBetween(startOfDay, endOfDay);

        // Placeholder — replace with actual billing service or aggregation
        double totalRevenue = 12500.50;

        // ==========================================================
        // 🗓️ 2️⃣ APPOINTMENT LISTS
        // ==========================================================
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusDays(7);

        // ✅ Upcoming = any appointment after "now" (including tomorrow/future)
        List<Appointment> upcomingAppointments =
                appointmentRepository.findByAppointmentDateAfterOrderByAppointmentDateAsc(now);

        // ✅ Recent = appointments in last 7 days (excluding today’s future)
        List<Appointment> recentAppointments =
                appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateDesc(weekAgo, now);

        // ==========================================================
        // 🎯 3️⃣ ADD DATA TO MODEL
        // ==========================================================
        model.addAttribute("doctorCount", doctorCount);
        model.addAttribute("patientCount", patientCount);
        model.addAttribute("appointmentCount", appointmentCount);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("upcomingAppointments", upcomingAppointments);
        model.addAttribute("recentAppointments", recentAppointments);

        // ==========================================================
        // ✅ 4️⃣ RETURN VIEW
        // ==========================================================
        return "dashboard";  // Thymeleaf template: templates/dashboard.html
    }
}
