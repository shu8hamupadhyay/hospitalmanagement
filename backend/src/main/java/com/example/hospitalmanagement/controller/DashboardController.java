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

        // ================================
        // 📊 SUMMARY COUNTS
        // ================================
        long doctorCount = doctorRepository.count();
        long patientCount = patientRepository.count();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

        long appointmentCount =
                appointmentRepository.countByAppointmentDateBetween(startOfDay, endOfDay);

        // TEMPORARY — replace with billing aggregation later
        double totalRevenue = 12500.50;

        // ================================
        // 📅 APPOINTMENTS
        // ================================
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusDays(7);

        // Future appointments
        List<Appointment> upcomingAppointments =
                appointmentRepository.findByAppointmentDateAfterOrderByAppointmentDateAsc(now);

        // Recent past appointments (last 7 days)
        List<Appointment> recentAppointments =
                appointmentRepository.findByAppointmentDateBetweenOrderByAppointmentDateDesc(
                        weekAgo, now
                );

        // ================================
        // 🔗 ADD TO MODEL
        // ================================
        model.addAttribute("doctorCount", doctorCount);
        model.addAttribute("patientCount", patientCount);
        model.addAttribute("appointmentCount", appointmentCount);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("upcomingAppointments", upcomingAppointments);
        model.addAttribute("recentAppointments", recentAppointments);

        // ================================
        // 🖥️ RETURN VIEW (Thymeleaf)
        // ================================
        return "dashboard";
    }
}
