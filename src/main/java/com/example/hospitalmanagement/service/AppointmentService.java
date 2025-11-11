package com.example.hospitalmanagement.service;

import com.example.hospitalmanagement.model.Appointment;
import com.example.hospitalmanagement.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // ==========================================================
    // 📋 Get All Appointments
    // ==========================================================
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // ==========================================================
    // 🔍 Get Appointment by ID
    // ==========================================================
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // ==========================================================
    // 💾 Save Appointment (auto token + default status)
    // ==========================================================
    public Appointment saveAppointment(Appointment appointment) {
        // ✅ Auto-generate Serial No (token)
        if (appointment.getSerialNo() == null || appointment.getSerialNo().isBlank()) {
            if (appointment.getDepartment() != null && appointment.getDepartment().getName() != null) {
                String prefix = appointment.getDepartment().getName()
                        .substring(0, Math.min(3, appointment.getDepartment().getName().length()))
                        .toUpperCase();

                long count = appointmentRepository.countByDepartmentId(appointment.getDepartment().getId());
                String serial = String.format("%s-%03d", prefix, count + 1);
                appointment.setSerialNo(serial);
            } else {
                appointment.setSerialNo("GEN-" + System.currentTimeMillis());
            }
        }

        // ✅ Default Status
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("Active");
        }

        return appointmentRepository.save(appointment);
    }

    // ==========================================================
    // 🗑️ Delete Appointment by ID (safe)
    // ==========================================================
    public void deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
        } else {
            System.err.println("⚠️ Warning: Attempted to delete non-existent appointment with ID: " + id);
        }
    }

    // ==========================================================
    // 🔢 Count by Department (for token generation)
    // ==========================================================
    public long countByDepartment(Long departmentId) {
        return appointmentRepository.countByDepartmentId(departmentId);
    }

    // ==========================================================
    // 🔍 Find Appointments by Doctor or Patient
    // ==========================================================
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // ==========================================================
    // 📅 Count Today's Appointments
    // ==========================================================
    public long countAppointmentsToday() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);
        return appointmentRepository.countByAppointmentDateBetween(startOfDay, endOfDay);
    }

    // ==========================================================
    // ⏳ Find Upcoming Appointments (for Dashboard)
    // ==========================================================
    public List<Appointment> findUpcomingAppointments(LocalDateTime now) {
        return appointmentRepository.findByAppointmentDateAfterOrderByAppointmentDateAsc(now);
    }

    // ==========================================================
    // 💰 Calculate Total Revenue (if fee column exists)
    // ==========================================================
    public double calculateTotalRevenue() {
        return appointmentRepository.findAll().stream()
                .mapToDouble(a -> a.getFee() != null ? a.getFee() : 0.0)
                .sum();
    }

    // ==========================================================
    // 📊 Count Between Dates (for Analytics/Reports)
    // ==========================================================
    public long countAppointmentsBetween(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.countByAppointmentDateBetween(start, end);
    }
}
