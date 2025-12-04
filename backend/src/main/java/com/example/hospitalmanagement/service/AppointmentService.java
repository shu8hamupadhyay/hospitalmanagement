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

    // -----------------------------------------------------------
    // GET ALL
    // -----------------------------------------------------------
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // -----------------------------------------------------------
    // GET ONE
    // -----------------------------------------------------------
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // -----------------------------------------------------------
    // SAVE APPOINTMENT
    // -----------------------------------------------------------
    public Appointment saveAppointment(Appointment appointment) {

        // Default audit
        if (appointment.getLastModifiedBy() == null || appointment.getLastModifiedBy().isBlank()) {
            appointment.setLastModifiedBy("SYSTEM_AUTO");
        }

        // Default status
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("Scheduled");
        }

        // Auto-cancel reason
        if ("Cancelled".equalsIgnoreCase(appointment.getStatus())) {
            if (appointment.getCancellationReason() == null || appointment.getCancellationReason().isBlank()) {
                appointment.setCancellationReason("Patient Requested Cancellation");
            }
        }

        return appointmentRepository.save(appointment);
    }

    // -----------------------------------------------------------
    // FIXED SERIAL NUMBER GENERATION
    // -----------------------------------------------------------
    public void generateSerialIfNew(Appointment appointment) {

        // Only generate serial for NEW appointments
        if (appointment.getId() != null) return;
        if (appointment.getSerialNo() != null && !appointment.getSerialNo().isBlank()) return;

        // If controller has not assigned department yet → skip
        if (appointment.getDepartment() == null || appointment.getDepartment().getId() == null) {
            appointment.setSerialNo("GEN-" + System.currentTimeMillis());
            return;
        }

        // SAFETY FIX: avoid NullPointerException
        String deptName = appointment.getDepartment().getName();
        if (deptName == null || deptName.isBlank()) {
            deptName = "GEN";
        }

        String prefix = deptName.substring(0, Math.min(3, deptName.length())).toUpperCase();

        long count = appointmentRepository.countByDepartmentId(appointment.getDepartment().getId());

        appointment.setSerialNo(String.format("%s-%03d", prefix, count + 1));
    }

    // -----------------------------------------------------------
    // DELETE
    // -----------------------------------------------------------
    public void deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
        }
    }

    // -----------------------------------------------------------
    // FILTERS / ANALYTICS
    // -----------------------------------------------------------
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public long countAppointmentsToday() {
        LocalDate today = LocalDate.now();
        return appointmentRepository.countByAppointmentDateBetween(
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay().minusNanos(1)
        );
    }

    public List<Appointment> findUpcomingAppointments(LocalDateTime now) {
        return appointmentRepository.findByAppointmentDateAfterOrderByAppointmentDateAsc(now);
    }

    public double calculateTotalRevenue() {
        return appointmentRepository.findAll().stream()
                .mapToDouble(a -> a.getFee() != null ? a.getFee() : 0.0)
                .sum();
    }

    public long countAppointmentsBetween(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.countByAppointmentDateBetween(start, end);
    }
}
